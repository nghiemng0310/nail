import React, { useState, useEffect, useRef } from 'react';
import { 
  Button, 
  Modal, 
  Form, 
  Input, 
  Upload, 
  message, 
  Image,
  Popconfirm,
  Progress,
  Select,
  Tag,
  Spin
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  UploadOutlined 
} from '@ant-design/icons';
import type { ImageModel, ImageFormData } from '../types/image';
import { IMAGE_CATEGORIES } from '../types/image';
import {
  getImages,
  createImage,
  updateImage,
  deleteImage
} from '../services/imageService';
import type { GetImagesResult } from '../services/imageService';
import type { QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import './ImageManagement.css';

const { Option } = Select;

const ImageManagement: React.FC = () => {
  const [images, setImages] = useState<ImageModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingImage, setEditingImage] = useState<ImageModel | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<any[]>([]);
  const observerTarget = useRef<HTMLDivElement>(null);

  // Cấu hình chất lượng ảnh (0.1 - 1.0)
  // 0.5 = 50%, 0.7 = 70%, 0.9 = 90%
  const IMAGE_QUALITY = 0.9;

  // Load images on component mount
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
        pageSize: 10
      });
      
      setImages(result.images);
      setLastDoc(result.lastDoc);
      setHasMore(result.hasMore);
    } catch (error) {
      console.error('Error loading images:', error);
      message.error('Không thể tải danh sách hình ảnh');
    } finally {
      setLoading(false);
    }
  };

  const loadMoreImages = async () => {
    if (!lastDoc || !hasMore || loadingMore) return;

    setLoadingMore(true);
    try {
      const result: GetImagesResult = await getImages({
        pageSize: 10,
        lastDoc: lastDoc
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

  const reloadImages = () => {
    setImages([]);
    setLastDoc(null);
    setHasMore(true);
    loadInitialImages();
  };

  const handleCreate = () => {
    setEditingImage(null);
    form.resetFields();
    setFileList([]);
    setUploadProgress(0);
    setModalVisible(true);
  };

  const handleEdit = (record: ImageModel) => {
    setEditingImage(record);
    form.setFieldsValue({
      name: record.name,
      categories: record.categories || []
    });
    setFileList([]);
    setUploadProgress(0);
    setModalVisible(true);
  };

  const handleDelete = async (record: ImageModel) => {
    try {
      await deleteImage(record.id, record.image);
      message.success('Xóa hình ảnh thành công');
      reloadImages();
    } catch (error) {
      message.error('Không thể xóa hình ảnh');
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      if (!editingImage && fileList.length === 0) {
        message.error('Vui lòng chọn hình ảnh');
        return;
      }

      setLoading(true);
      const formData: ImageFormData = {
        name: values.name,
        categories: values.categories || []
      };

      if (editingImage) {
        // Update existing image
        const file = fileList.length > 0 
          ? (fileList[0].originFileObj || fileList[0] as File)
          : undefined;
        await updateImage(
          editingImage.id,
          formData,
          file,
          editingImage.image,
          (progress) => setUploadProgress(progress),
          IMAGE_QUALITY
        );
        message.success('Cập nhật hình ảnh thành công');
      } else {
        // Create new image
        const file = fileList[0].originFileObj || fileList[0] as File;
        
        if (!file) {
          message.error('Không thể lấy file hình ảnh');
          return;
        }
        
        await createImage(
          formData,
          file,
          (progress) => setUploadProgress(progress),
          IMAGE_QUALITY
        );
        message.success('Tạo hình ảnh thành công');
      }

      // Cleanup object URLs
      fileList.forEach(file => {
        if (file.url && file.url.startsWith('blob:')) {
          URL.revokeObjectURL(file.url);
        }
      });
      
      setModalVisible(false);
      setUploadProgress(0);
      reloadImages();
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      message.error('Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="management-container">
      <div className="management-header">
        <h1 className="management-title">Quản lý hình ảnh</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreate}
          size="large"
        >
          Thêm hình ảnh
        </Button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <Spin size="large" />
          <p style={{ marginTop: '16px', color: '#8c8c8c' }}>Đang tải...</p>
        </div>
      ) : images.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#8c8c8c' }}>
          Chưa có hình ảnh nào
        </div>
      ) : (
        <>
          <div className="images-stats">
            {images.length} hình ảnh {hasMore && '(còn nữa)'}
          </div>
          
          <Image.PreviewGroup
            preview={{
              countRender: (current, total) => `${current} / ${total}`,
            }}
          >
            <div className="management-grid">
              {images.map((image) => (
                <div key={image.id} className="management-card">
                  <div className="card-image-wrapper">
                    <Image
                      src={image.image}
                      alt={image.name}
                      preview={true}
                      style={{
                        width: '100%',
                        display: 'block'
                      }}
                    />
                  </div>
                  
                  <div className="card-content">
                    <h3 className="card-title">{image.name}</h3>
                    
                    <div className="card-info">
                      <div className="info-row">
                        <span className="info-label">Loại:</span>
                        <div className="info-value">
                          {image.categories && image.categories.length > 0 ? (
                            image.categories.map(cat => (
                              <Tag key={cat} color="blue" style={{ fontSize: '12px', marginBottom: '4px' }}>
                                {cat}
                              </Tag>
                            ))
                          ) : (
                            <span style={{ color: '#8c8c8c' }}>Chưa phân loại</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="info-row">
                        <span className="info-label">Lượt thích:</span>
                        <span className="info-value">{image.likes || 0}</span>
                      </div>
                      
                      <div className="info-row">
                        <span className="info-label">Ngày tạo:</span>
                        <span className="info-value">
                          {image.createdAt ? new Date(image.createdAt).toLocaleString('vi-VN') : '-'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="card-actions">
                      <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(image)}
                        block
                      >
                        Chỉnh sửa
                      </Button>
                      <Popconfirm
                        title="Bạn có chắc chắn muốn xóa?"
                        onConfirm={() => handleDelete(image)}
                        okText="Có"
                        cancelText="Không"
                        placement="top"
                      >
                        <Button
                          danger
                          icon={<DeleteOutlined />}
                          block
                        >
                          Xóa
                        </Button>
                      </Popconfirm>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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

      <Modal
        title={editingImage ? 'Chỉnh sửa hình ảnh' : 'Thêm hình ảnh mới'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => {
          // Cleanup object URLs to prevent memory leak
          fileList.forEach(file => {
            if (file.url && file.url.startsWith('blob:')) {
              URL.revokeObjectURL(file.url);
            }
          });
          setModalVisible(false);
          setUploadProgress(0);
        }}
        okText={editingImage ? 'Cập nhật' : 'Tạo'}
        cancelText="Hủy"
        confirmLoading={loading}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          style={{ marginTop: '24px' }}
        >
          <Form.Item
            name="name"
            label="Tên hình ảnh"
            rules={[{ required: true, message: 'Vui lòng nhập tên hình ảnh' }]}
          >
            <Input placeholder="Nhập tên hình ảnh" />
          </Form.Item>

          <Form.Item
            name="categories"
            label="Loại hình ảnh"
            rules={[{ required: true, message: 'Vui lòng chọn ít nhất một loại' }]}
          >
            <Select
              mode="multiple"
              placeholder="Chọn loại hình ảnh"
              allowClear
              maxTagCount="responsive"
            >
              {IMAGE_CATEGORIES.map(category => (
                <Option key={category} value={category}>
                  {category}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Hình ảnh"
          >
            <Upload
              listType="picture-card"
              fileList={fileList}
              beforeUpload={(file) => {
                // Validate file type
                const isImage = file.type.startsWith('image/');
                if (!isImage) {
                  message.error('Bạn chỉ có thể tải lên file hình ảnh!');
                  return false;
                }
                
                // Validate file size (max 5MB)
                const isLt5M = file.size / 1024 / 1024 < 5;
                if (!isLt5M) {
                  message.error('Hình ảnh phải nhỏ hơn 5MB!');
                  return false;
                }

                // Store file with proper structure for Ant Design Upload
                setFileList([{
                  uid: file.uid || '-1',
                  name: file.name,
                  status: 'done',
                  url: URL.createObjectURL(file),
                  originFileObj: file
                }]);
                return false; // Prevent auto upload
              }}
              onRemove={() => {
                // Cleanup object URL to prevent memory leak
                if (fileList.length > 0 && fileList[0].url) {
                  URL.revokeObjectURL(fileList[0].url);
                }
                setFileList([]);
              }}
              maxCount={1}
            >
              {fileList.length === 0 && (
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>Tải lên</div>
                </div>
              )}
            </Upload>
            
            {editingImage && fileList.length === 0 && (
              <div style={{ marginTop: '8px' }}>
                <p>Hình ảnh hiện tại:</p>
                <Image
                  src={editingImage.image}
                  alt={editingImage.name}
                  width={200}
                  style={{ objectFit: 'cover' }}
                />
              </div>
            )}
          </Form.Item>

          {uploadProgress > 0 && uploadProgress < 100 && (
            <Progress percent={Math.round(uploadProgress)} />
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default ImageManagement;

