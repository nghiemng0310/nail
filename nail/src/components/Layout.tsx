import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Layout as AntLayout } from 'antd';
import { HomeOutlined, AppstoreAddOutlined } from '@ant-design/icons';
import './Layout.css';

const { Content } = AntLayout;

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: 'Trang chủ',
      path: '/'
    },
    {
      key: '/management',
      icon: <AppstoreAddOutlined />,
      label: 'Quản lý',
      path: '/management'
    }
  ];

  return (
    <AntLayout className="app-layout">
      <Content className="app-content">
        {children}
      </Content>
      
      <div className="bottom-navigation">
        {menuItems.map(item => (
          <div
            key={item.key}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
          >
            <div className="nav-icon">{item.icon}</div>
            <div className="nav-label">{item.label}</div>
          </div>
        ))}
      </div>
    </AntLayout>
  );
};

export default Layout;



