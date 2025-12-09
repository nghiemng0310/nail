import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import viVN from 'antd/locale/vi_VN';
import Layout from './components/Layout';
import Home from './pages/Home';
import ImageManagement from './pages/ImageManagement';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import './App.css';
import CustomerHome from './pages/CustomerHome';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  return (
    <ConfigProvider locale={viVN}>
      <AuthProvider>
        <Router basename="/nail">
          <Layout>
            <Routes>
              <Route path="/" element={<CustomerHome />} />
              <Route 
                path="/management" 
                element={
                  <ProtectedRoute>
                    <ImageManagement />
                  </ProtectedRoute>
                } 
              />
              <Route path="/home" element={<Home />} />
            </Routes>
          </Layout>
        </Router>
      </AuthProvider>
    </ConfigProvider>
  );
}

export default App;
