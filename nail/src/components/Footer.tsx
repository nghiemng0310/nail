import './Footer.css';

function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-content container">
        <div className="footer-section">
          <h3 className="footer-heading">Ngọc Nail</h3>
          <p className="footer-text">Chuyên nghiệp - Uy tín - Chất lượng</p>
        </div>

        <div className="footer-section">
          <h4 className="footer-title">Thông tin liên hệ</h4>
          <div className="footer-info">
            <div className="info-item">
              <span className="info-icon">📞</span>
              <a href="tel:0123456789" className="info-link">0123 456 789</a>
            </div>
            <div className="info-item">
              <span className="info-icon">📍</span>
              <span className="info-text">123 Đường ABC, Quận XYZ, TP. HCM</span>
            </div>
            <div className="info-item">
              <span className="info-icon">⏰</span>
              <span className="info-text">Mở cửa: 8:00 - 20:00 hàng ngày</span>
            </div>
          </div>
        </div>

        <div className="footer-section">
          <h4 className="footer-title">Dịch vụ</h4>
          <ul className="footer-list">
            <li>Làm móng tay/chân</li>
            <li>Nail Art chuyên nghiệp</li>
            <li>Đắp gel, acrylic</li>
            <li>Thiết kế theo yêu cầu</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <p className="copyright">© 2024 Ngọc Nail. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

