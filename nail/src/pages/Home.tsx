import React, { useState, useEffect, useRef } from 'react';
import { Image, Spin, Empty, Select, Tag, Button, message } from 'antd';
import { HeartOutlined } from '@ant-design/icons';
import { getImages, likeImage } from '../services/imageService';
import type { ImageModel } from '../types/image';
import type { GetImagesResult } from '../services/imageService';
import { IMAGE_CATEGORIES } from '../types/image';
import type { QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import './Home.css';
import Masonry from 'react-masonry-css';

const breakpointColumnsObj = {
  default: 5,
  1440: 5,
  1024: 4,
  768: 2,
  0: 1
};
const { Option } = Select;

const Home: React.FC = () => {
  const [images, setImages] = useState<ImageModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);

  const observerTarget = useRef<HTMLDivElement>(null);

  const attachSwipeListeners = () => {
    const wrapper = document.querySelector('.ant-image-preview-wrap');
    if (!wrapper) return;

    let startX = 0;
    let endX = 0;

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
    };
    const handleTouchMove = (e: TouchEvent) => {
      endX = e.touches[0].clientX;
    };
    const handleTouchEnd = () => {
      const diff = startX - endX;
      if (diff > 50) {
        const nextBtn = document.querySelector('.ant-image-preview-switch-right') as HTMLElement;
        nextBtn?.click();
      } else if (diff < -50) {
        const prevBtn = document.querySelector('.ant-image-preview-switch-left') as HTMLElement;
        prevBtn?.click();
      }
    };

    wrapper.addEventListener('touchstart', handleTouchStart as any);
    wrapper.addEventListener('touchmove', handleTouchMove as any);
    wrapper.addEventListener('touchend', handleTouchEnd);

    (wrapper as any)._touchHandlers = { handleTouchStart, handleTouchMove, handleTouchEnd };
  };

  const detachSwipeListeners = () => {
    const wrapper = document.querySelector('.ant-image-preview-wrap');
    const handlers = (wrapper as any)?._touchHandlers;
    if (!wrapper || !handlers) return;

    wrapper.removeEventListener('touchstart', handlers.handleTouchStart);
    wrapper.removeEventListener('touchmove', handlers.handleTouchMove);
    wrapper.removeEventListener('touchend', handlers.handleTouchEnd);
  };

  // Load initial images
  useEffect(() => {
    loadInitialImages();
  }, [selectedCategories]);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading && !loadingMore) {
          loadMoreImages();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [hasMore, loading, loadingMore, lastDoc]);

  const loadInitialImages = async () => {
    // Only show full page loading on very first load
    const isFirstLoad = images.length === 0 && !loading && !loadingMore;

    if (isFirstLoad) {
      setLoading(true);
    } else {
      // When filtering, just show loading on gallery
      setLoadingMore(true);
    }

    try {
      const result: GetImagesResult = await getImages({
        pageSize: 10,
        categories: selectedCategories.length > 0 ? selectedCategories : undefined
      });

      setImages(result.images);
      setLastDoc(result.lastDoc);
      setHasMore(result.hasMore);
    } catch (error) {
      console.error('Error loading images:', error);
      message.error('Không thể tải hình ảnh');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMoreImages = async () => {
    if (!hasMore || loadingMore) return;

    // If filtering by categories, no more images available (loaded all at once)
    if (selectedCategories.length > 0) return;

    if (!lastDoc) return;

    setLoadingMore(true);
    try {
      const result: GetImagesResult = await getImages({
        pageSize: 10,
        lastDoc: lastDoc,
        categories: undefined
      });

      setImages(prev => [...prev, ...result.images]);
      setLastDoc(result.lastDoc);
      setHasMore(result.hasMore);
    } catch (error) {
      console.error('Error loading more images:', error);
      message.error('Không thể tải thêm hình ảnh');
    } finally {
      setLoadingMore(false);
    }
  };

  const handleCategoryChange = (values: string[]) => {
    setSelectedCategories(values);
    setImages([]);
    setLastDoc(null);
    setHasMore(true);
  };

  const handleLike = async (imageId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    // Optimistic UI update - always increase
    setImages(prev => prev.map(img =>
      img.id === imageId
        ? { ...img, likes: img.likes + 1 }
        : img
    ));

    try {
      await likeImage(imageId);
    } catch (error) {
      console.error('Error liking image:', error);
      message.error('Không thể thích hình ảnh');

      // Revert optimistic update
      setImages(prev => prev.map(img =>
        img.id === imageId
          ? { ...img, likes: img.likes - 1 }
          : img
      ));
    }
  };

  return (
    <div className="home-container">
      <div className="home-header">
        <h1 className="home-title">Ngọc Nails</h1>
        <div className="filter-container">
          <Select
            mode="multiple"
            placeholder="Lọc theo loại"
            value={selectedCategories}
            onChange={handleCategoryChange}
            style={{ width: '100%', maxWidth: '500px' }}
            allowClear
            size="large"
            maxTagCount="responsive"
            disabled={loadingMore}
          >
            {IMAGE_CATEGORIES.map(category => (
              <Option key={category} value={category}>
                {category}
              </Option>
            ))}
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <Spin size="large" />
          <p style={{ marginTop: '16px', color: '#8c8c8c' }}>Đang tải hình ảnh...</p>
        </div>
      ) : images.length === 0 && !loadingMore ? (
        <Empty
          description={selectedCategories.length > 0 ? 'Không tìm thấy hình ảnh với loại đã chọn' : 'Chưa có hình ảnh nào'}
          style={{ marginTop: '60px' }}
        />
      ) : (
        <>
          {!loadingMore && (
            <div className="images-count">
              {images.length} hình ảnh {hasMore && '(còn nữa)'}
            </div>
          )}

          {loadingMore && images.length === 0 && (
            <div className="loading-container" style={{ minHeight: '200px' }}>
              <Spin size="large" />
              <p style={{ marginTop: '16px', color: '#8c8c8c' }}>Đang tải hình ảnh...</p>
            </div>
          )}

          <Image.PreviewGroup
            preview={{
              countRender: (current, total) => `${current} / ${total}`,
              onVisibleChange: (visible) => {
                if (visible) attachSwipeListeners();
                else detachSwipeListeners();
              },
            }}
          >
            {/* <div className={`gallery-grid ${loadingMore && images.length > 0 ? 'loading' : ''}`}>
              {images.map((image, index) => (
                <div
                  key={image.id}
                  className="gallery-item"
                  style={{
                    animationDelay: `${index * 0.05}s`
                  }}
                >
                  <Image
                    src={image.image}
                    alt={image.name}
                    className="gallery-image"
                    loading="lazy"
                    placeholder={
                      <div className="image-placeholder">
                        <Spin />
                      </div>
                    }
                  />
                  <div className="image-overlay">
                    <div className="image-info">
                      <div className="image-name">{image.name}</div>
                      <div className="image-categories">
                        {image.categories.slice(0, 3).map(cat => (
                          <Tag key={cat} color="blue" style={{ fontSize: '11px', margin: '2px' }}>
                            {cat}
                          </Tag>
                        ))}
                        {image.categories.length > 3 && (
                          <Tag color="default" style={{ fontSize: '11px', margin: '2px' }}>
                            +{image.categories.length - 3}
                          </Tag>
                        )}
                      </div>
                    </div>
                    <Button
                      type="text"
                      icon={<HeartOutlined />}
                      className="like-button"
                      onClick={(e) => handleLike(image.id, e)}
                    >
                      {image.likes}
                    </Button>
                  </div>
                </div>
              ))}
            </div> */}


            <Masonry
              breakpointCols={breakpointColumnsObj}
              className="gallery-grid"
              columnClassName="gallery-grid-column"
            >
              {images.map((image, index) => (
                <div
                  key={image.id}
                  className="gallery-item"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <Image
                    src={image.image}
                    alt={image.name}
                    className="gallery-image"
                    loading="lazy"
                    placeholder={
                      <div className="image-placeholder">
                        <Spin />
                      </div>
                    }
                  />
                  <div className="image-overlay">
                    <div className="image-info">
                      <div className="image-name">{image.name}</div>
                      <div className="image-categories">
                        {image.categories.slice(0, 3).map(cat => (
                          <Tag key={cat} color="blue" style={{ fontSize: '11px', margin: '2px' }}>
                            {cat}
                          </Tag>
                        ))}
                        {image.categories.length > 3 && (
                          <Tag color="default" style={{ fontSize: '11px', margin: '2px' }}>
                            +{image.categories.length - 3}
                          </Tag>
                        )}
                      </div>
                    </div>
                    <Button
                      type="text"
                      icon={<HeartOutlined />}
                      className="like-button"
                      onClick={(e) => handleLike(image.id, e)}
                    >
                      {image.likes}
                    </Button>
                  </div>
                </div>
              ))}
            </Masonry>
          </Image.PreviewGroup>

          {/* Infinite scroll trigger */}
          <div ref={observerTarget} style={{ height: '20px', margin: '20px 0' }}>
            {loadingMore && (
              <div style={{ textAlign: 'center' }}>
                <Spin />
                <p style={{ marginTop: '8px', color: '#8c8c8c' }}>Đang tải thêm...</p>
              </div>
            )}
            {!hasMore && images.length > 0 && (
              <div style={{ textAlign: 'center', color: '#8c8c8c' }}>
                Đã hiển thị tất cả hình ảnh
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
