import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Input, message } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, authenticate } = useAuth();
  const navigate = useNavigate();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setShowPasswordModal(true);
    }
  }, [isAuthenticated]);

  const handlePasswordSubmit = () => {
    if (!password.trim()) {
      message.error('Vui lòng nhập mật khẩu');
      return;
    }

    setLoading(true);
    
    // Giả lập delay để có UX tốt hơn
    setTimeout(() => {
      const success = authenticate(password);
      
      if (success) {
        message.success('Đăng nhập thành công');
        setShowPasswordModal(false);
        setPassword('');
      } else {
        message.error('Mật khẩu không đúng');
        setPassword('');
      }
      
      setLoading(false);
    }, 500);
  };

  const handleCancel = () => {
    setShowPasswordModal(false);
    setPassword('');
    navigate('/'); // Quay về trang chủ
  };

  // Nếu đã authenticated, hiển thị nội dung
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // Nếu chưa authenticated, hiển thị modal nhập mật khẩu
  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <LockOutlined style={{ fontSize: '20px', color: '#1890ff' }} />
          <span>Xác thực quản trị viên</span>
        </div>
      }
      open={showPasswordModal}
      onOk={handlePasswordSubmit}
      onCancel={handleCancel}
      okText="Đăng nhập"
      cancelText="Hủy"
      confirmLoading={loading}
      closable={false}
      maskClosable={false}
      keyboard={false}
      centered
    >
      <div style={{ padding: '20px 0' }}>
        <p style={{ marginBottom: '16px', color: '#595959' }}>
          Vui lòng nhập mật khẩu để truy cập trang quản lý
        </p>
        <Input.Password
          size="large"
          placeholder="Nhập mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onPressEnter={handlePasswordSubmit}
          prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
          autoFocus
        />
      </div>
    </Modal>
  );
};

export default ProtectedRoute;

