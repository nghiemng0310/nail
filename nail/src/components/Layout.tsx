import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Layout as AntLayout } from 'antd';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import './Layout.css';

const { Content } = AntLayout;

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <Navbar
        expand="lg"
        className={`navigation-bar shadow-sm ${scrolled ? 'navbar-scrolled' : 'navbar-top'}`}
      >
        <Container>
          <Navbar.Brand as={Link} to="/" style={{ fontWeight: 600 }}>
            Ngọc Nail
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto" activeKey={location.pathname}>
              <Nav.Link as={Link} to="/" eventKey="/">
                Trang chủ
              </Nav.Link>
              <Nav.Link as={Link} to="/management" eventKey="/management">
                Quản lý
              </Nav.Link>
              <Nav.Link as={Link} to="/customer" eventKey="/customer">
                Khách hàng
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Content style={{ paddingTop: '80px', padding: '16px' }}>{children}</Content>
    </>
  );
};

export default Layout;
