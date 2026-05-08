import './Footer.css'
const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top">

        <div className="footer-brand">
          <h2>NEON_TECH</h2>

          <p>
            THE INTERSECTION OF FUTURISTIC
            ENGINEERING AND LUXURY
            PERFORMANCE ELECTRONICS.
          </p>

          <div className="socials">
            <div className="social">🌐</div>
            <div className="social">@</div>
          </div>
        </div>

        <div className="footer-links">
          <h3>QUICK LINKS</h3>

          <a href="#">SUPPORT</a>
          <a href="#">WARRANTY</a>
          <a href="#">SHIPPING</a>
        </div>

        <div className="footer-links">
          <h3>POLICIES</h3>

          <a href="#">PRIVACY POLICY</a>
          <a href="#">TERMS OF SERVICE</a>
          <a href="#">COOKIE POLICY</a>
        </div>

        <div className="newsletter">
          <h3>NEWSLETTER</h3>

          <p>SUBSCRIBE FOR DROP ALERTS.</p>

          <div className="newsletter-box">
            <input
              type="email"
              placeholder="ENCRYPTED EMAIL"
            />

            <button>→</button>
          </div>
        </div>

      </div>

      <div className="footer-bottom">
        © 2026 NEON_TECH PRECISION. ENGINEERED FOR THE FUTURE.
      </div>
    </footer>
  );
};

export default Footer;
