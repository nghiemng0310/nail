import { useState, useEffect, useRef } from 'react';
import { Image, Spin, message, Tag } from 'antd';
import { getImages } from '../services/imageService';
import type { ImageModel } from '../types/image';
import type { GetImagesResult } from '../services/imageService';
import type { QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import Masonry from 'react-masonry-css';
import './NailGallery.css';
import Footer from '../components/Footer';

const breakpointColumnsObj = {
  default: 5,
  1440: 5,
  1024: 4,
  768: 2,
  0: 1
};

function NailGallery() {
  const [images, setImages] = useState<ImageModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);

  const observerTarget = useRef<HTMLDivElement>(null);

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
    setLoading(true);

    try {
      const result: GetImagesResult = await getImages({
        pageSize: 15,
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
    }
  };

  const loadMoreImages = async () => {
    if (!hasMore || loadingMore || !lastDoc) return;

    setLoadingMore(true);
    try {
      const result: GetImagesResult = await getImages({
        pageSize: 15,
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

  return (
    <div className="nail-gallery-container">
      <div className='banner-container'>
        <div className='banner-content container'>
          <h1 className='banner-title'>Mẫu Nail Đẹp</h1>
          <p className='banner-description'>Khám phá bộ sưu tập nail độc đáo & sang trọng</p>
        </div>
      </div>

      <div className='gallery-content-container'>
        <div className='gallery-content container'>
          <div className='gallery-header'>
            <h2 className='gallery-title'>| Tất cả mẫu nail</h2>
            {!loading && images.length > 0 && (
              <p className='gallery-count'>{images.length} mẫu {hasMore && '(còn nữa)'}</p>
            )}
          </div>

          {loading ? (
            <div className='loading-wrapper'>
              <Spin size="large" />
              <p className='loading-text'>Đang tải hình ảnh...</p>
            </div>
          ) : images.length === 0 ? (
            <div className='empty-state'>
              <p>Chưa có hình ảnh nào</p>
            </div>
          ) : (
            <>
              <Image.PreviewGroup
                preview={{
                  countRender: (current, total) => `${current} / ${total}`,
                }}
              >
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
              </Image.PreviewGroup>

              {/* Infinite scroll trigger */}
              <div ref={observerTarget} className='scroll-observer'>
                {loadingMore && (
                  <div className='loading-more'>
                    <Spin />
                    <p className='loading-text'>Đang tải thêm...</p>
                  </div>
                )}
                {!hasMore && images.length > 0 && (
                  <div className='end-message'>
                    <p>Đã hiển thị tất cả hình ảnh</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default NailGallery;

