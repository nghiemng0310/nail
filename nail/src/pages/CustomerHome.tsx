import { useState, useEffect, useRef } from 'react';
import { Image, Spin, message, Tag } from 'antd';
// import { HeartOutlined } from '@ant-design/icons';
import { getImages } from '../services/imageService';
import type { ImageModel } from '../types/image';
import type { GetImagesResult } from '../services/imageService';
import type { QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import Masonry from 'react-masonry-css';
import './CustomerHome.css';
import menu from '../assets/menu.png';
const breakpointColumnsObj = {
  default: 5,
  1440: 5,
  1024: 4,
  768: 2,
  0: 1
};
function CustomerHome() {
  const [images, setImages] = useState<ImageModel[]>([]);

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);

  const observerTarget = useRef<HTMLDivElement>(null);


  // const attachSwipeListeners = () => {
  //   const wrapper = document.querySelector('.ant-image-preview-wrap');
  //   if (!wrapper) return;

  //   let startX = 0;
  //   let endX = 0;

  //   const handleTouchStart = (e: TouchEvent) => {
  //     startX = e.touches[0].clientX;
  //   };
  //   const handleTouchMove = (e: TouchEvent) => {
  //     endX = e.touches[0].clientX;
  //   };
  //   const handleTouchEnd = () => {
  //     const diff = startX - endX;
  //     if (diff > 50) {
  //       const nextBtn = document.querySelector('.ant-image-preview-switch-right') as HTMLElement;
  //       nextBtn?.click();
  //     } else if (diff < -50) {
  //       const prevBtn = document.querySelector('.ant-image-preview-switch-left') as HTMLElement;
  //       prevBtn?.click();
  //     }
  //   };

  //   wrapper.addEventListener('touchstart', handleTouchStart as any);
  //   wrapper.addEventListener('touchmove', handleTouchMove as any);
  //   wrapper.addEventListener('touchend', handleTouchEnd);

  //   (wrapper as any)._touchHandlers = { handleTouchStart, handleTouchMove, handleTouchEnd };
  // };

  // const detachSwipeListeners = () => {
  //   const wrapper = document.querySelector('.ant-image-preview-wrap');
  //   const handlers = (wrapper as any)?._touchHandlers;
  //   if (!wrapper || !handlers) return;

  //   wrapper.removeEventListener('touchstart', handlers.handleTouchStart);
  //   wrapper.removeEventListener('touchmove', handlers.handleTouchMove);
  //   wrapper.removeEventListener('touchend', handlers.handleTouchEnd);
  // };

  // Load initial images
  useEffect(() => {
    loadInitialImages();
  }, []);

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
        categories: undefined
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

  // const handleCategoryChange = (values: string[]) => {
  //   setSelectedCategories(values);
  //   setImages([]);
  //   setLastDoc(null);
  //   setHasMore(true);
  // };

  // const handleLike = async (imageId: string, e: React.MouseEvent) => {
  //   e.stopPropagation();

  //   // Optimistic UI update - always increase
  //   setImages(prev => prev.map(img =>
  //     img.id === imageId
  //       ? { ...img, likes: img.likes + 1 }
  //       : img
  //   ));

  //   try {
  //     await likeImage(imageId);
  //   } catch (error) {
  //     console.error('Error liking image:', error);
  //     message.error('Không thể thích hình ảnh');

  //     // Revert optimistic update
  //     setImages(prev => prev.map(img =>
  //       img.id === imageId
  //         ? { ...img, likes: img.likes - 1 }
  //         : img
  //     ));
  //   }
  // };



  return (
    <div className="customer-home-container">
      <div className='background-container'>
        <div className='header-container container'>
          <div className='header-content'>
            <h1 className='header-title'>Bộ sưu tập</h1>
            <p className='header-description'>Chuyên những mẫu nail chất lượng</p>
          </div>
        </div>
        <div className='content-container'>
          <div className='content container'>
            {/* <div className='filter-container'>
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
            </div> */}
            <div className='row-container container'>
              <div className='title-row'>| Dịch Vụ Nổi Bật</div>
              <div className='row-boc'>


                <div className='images-row'>
                  <div key={'1'} className='image-item'>
                    <img src={menu} alt='1' className='img-item' loading='lazy' />
                  </div> 
                  <div key={'2'} className='image-item'>
                    <img src={menu} alt='2' className='img-item' loading='lazy' />
                  </div>
                  <div key={'1'} className='image-item'>
                    <img src={menu} alt='1' className='img-item' loading='lazy' />
                  </div> 
                  <div key={'2'} className='image-item'>
                    <img src={menu} alt='2' className='img-item' loading='lazy' />
                  </div>
                </div>
              </div>
            </div>
            <div className='row-container container'>
              <div className='title-row'>| Dành cho chị em</div>
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
                    </div>
                  </div>
                ))}
              </Masonry>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomerHome;