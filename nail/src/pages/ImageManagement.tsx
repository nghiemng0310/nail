import React, { useState, useEffect, useRef } from 'react';
import { 
  Button, 
  Table, 
  Modal, 
  Form, 
  Input, 
  Upload, 
  message, 
  Image, 
  Space,
  Popconfirm,
  Progress
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  UploadOutlined 
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { ImageModel, ImageFormData } from '../types/image';
import {
  getAllImages,
  createImage,
  updateImage,
  deleteImage
} from '../services/imageService';
import './ImageManagement.css';

const ImageManagement: React.FC = () => {
  const [images, setImages] = useState<ImageModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingImage, setEditingImage] = useState<ImageModel | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<any[]>([]);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Load images on component mount
  useEffect(() => {
    loadImages();
  }, []);

  // Add swipe functionality for image preview
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e: TouchEvent) => {
      touchEndX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
      if (touchStartX.current - touchEndX.current > 50) {
        // Swipe left - next image
        const nextButton = document.querySelector('.ant-image-preview-switch-right') as HTMLElement;
        if (nextButton) nextButton.click();
      }
      if (touchEndX.current - touchStartX.current > 50) {
        // Swipe right - previous image
        const prevButton = document.querySelector('.ant-image-preview-switch-left') as HTMLElement;
        if (prevButton) prevButton.click();
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
  }, [images]);

  const loadImages = async () => {
    setLoading(true);
    try {
      const data = await getAllImages();
      setImages(data);
    } catch (error) {
      message.error('Không thể tải danh sách hình ảnh');
    } finally {
      setLoading(false);
    }
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
      name: record.name
    });
    setFileList([]);
    setUploadProgress(0);
    setModalVisible(true);
  };

  const handleDelete = async (record: ImageModel) => {
    try {
      await deleteImage(record.id, record.image);
      message.success('Xóa hình ảnh thành công');
      loadImages();
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
        name: values.name
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
          (progress) => setUploadProgress(progress)
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
          (progress) => setUploadProgress(progress)
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
      loadImages();
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      message.error('Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  const columns: ColumnsType<ImageModel> = [
    {
      title: 'Hình ảnh',
      dataIndex: 'image',
      key: 'image',
      width: 120,
      render: (url: string) => (
        <Image
          src={url}
          alt="image"
          width={80}
          height={80}
          style={{ objectFit: 'cover' }}
        />
      ),
    },
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: Date) => date ? new Date(date).toLocaleString('vi-VN') : '-',
    },
    {
      title: 'Hành động',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa?"
            onConfirm={() => handleDelete(record)}
            okText="Có"
            cancelText="Không"
          >
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              size="small"
            >
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

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

      <Image.PreviewGroup
        preview={{
          countRender: (current, total) => `${current} / ${total}`,
        }}
      >
        <Table
          columns={columns}
          dataSource={images}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} hình ảnh`,
          }}
        />
      </Image.PreviewGroup>

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

