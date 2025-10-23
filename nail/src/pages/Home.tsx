import React, { useState, useEffect, useRef } from 'react';
import { Image, Spin, Empty, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { getAllImages } from '../services/imageService';
import type { ImageModel } from '../types/image';
import './Home.css';



const Home: React.FC = () => {
  const [images, setImages] = useState<ImageModel[]>([]);
  const [filteredImages, setFilteredImages] = useState<ImageModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);


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
  
    // Lưu vào wrapper để xoá dễ dàng
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
  

  useEffect(() => {
    loadImages();
  }, []);

  useEffect(() => {
    // Add swipe listener when preview is open
    const handleTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e: TouchEvent) => {
      touchEndX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
      if (touchStartX.current - touchEndX.current > 50) {
        // Swipe left - next image
        handleSwipeLeft();
      }
      if (touchEndX.current - touchStartX.current > 50) {
        // Swipe right - previous image
        handleSwipeRight();
      }
    };

    const previewWrapper = document.querySelector('.ant-image-preview-wrap');
    if (previewWrapper) {
      previewWrapper.addEventListener('touchstart', handleTouchStart as any);
      previewWrapper.addEventListener('touchmove', handleTouchMove as any);
      previewWrapper.addEventListener('touchend', handleTouchEnd as any);
    }

    return () => {
      if (previewWrapper) {
        previewWrapper.removeEventListener('touchstart', handleTouchStart as any);
        previewWrapper.removeEventListener('touchmove', handleTouchMove as any);
        previewWrapper.removeEventListener('touchend', handleTouchEnd as any);
      }
    };
  }, [filteredImages]);

  const handleSwipeLeft = () => {
    // Trigger next image
    const nextButton = document.querySelector('.ant-image-preview-switch-right') as HTMLElement;
    if (nextButton) {
      nextButton.click();
    }
  };

  const handleSwipeRight = () => {
    // Trigger previous image
    const prevButton = document.querySelector('.ant-image-preview-switch-left') as HTMLElement;
    if (prevButton) {
      prevButton.click();
    }
  };

  

  useEffect(() => {
    if (searchText) {
      const filtered = images.filter(img =>
        img.name.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredImages(filtered);
    } else {
      setFilteredImages(images);
    }
  }, [searchText, images]);

  const loadImages = async () => {
    setLoading(true);
    try {
      const data = await getAllImages();
      setImages(data);
      setFilteredImages(data);
    } catch (error) {
      console.error('Error loading images:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="home-container">
        <div className="loading-container">
          <Spin size="large" />
          <p style={{ marginTop: '16px', color: '#8c8c8c' }}>Đang tải hình ảnh...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="home-container">
      <div className="home-header">
        <h1 className="home-title">Thư viện hình ảnh</h1>
        <div className="search-container">
          <Input
            placeholder="Tìm kiếm hình ảnh..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
            size="large"
          />
        </div>
      </div>

      {filteredImages.length === 0 ? (
        <Empty
          description={searchText ? 'Không tìm thấy hình ảnh' : 'Chưa có hình ảnh nào'}
          style={{ marginTop: '60px' }}
        />
      ) : (
        <>
          <div className="images-count">
            {filteredImages.length} hình ảnh
          </div>
          <Image.PreviewGroup
  preview={{
    countRender: (current, total) => `${current} / ${total}`,
    onVisibleChange: (visible) => {
      if (visible) attachSwipeListeners();
      else detachSwipeListeners();
    },
  }}
>

            <div className="gallery-grid">
              {filteredImages.map((image) => (
                <div key={image.id} className="gallery-item">
                  <Image
                    src={image.image}
                    alt={image.name}
                    className="gallery-image"
                    placeholder={
                      <div className="image-placeholder">
                        <Spin />
                      </div>
                    }
                  />
                  <div className="image-overlay">
                    <div className="image-name">{image.name}</div>
                  </div>
                </div>
              ))}
            </div>
          </Image.PreviewGroup>
        </>
      )}
    </div>
  );
};

export default Home;

