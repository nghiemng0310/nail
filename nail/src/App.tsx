import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import viVN from 'antd/locale/vi_VN';
import Layout from './components/Layout';
import Home from './pages/Home';
import ImageManagement from './pages/ImageManagement';
import './App.css';

function App() {
  return (
    <ConfigProvider locale={viVN}>
      <Router basename="/nail">
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/management" element={<ImageManagement />} />
          </Routes>
        </Layout>
      </Router>
    </ConfigProvider>
  );
}

export default App;
