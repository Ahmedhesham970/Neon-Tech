import {Link} from "react-router-dom"
import personIcon from "../assets/profile-round-1346-svgrepo-com.svg";
import cartIcon from "../assets/cart-shopping-fast-svgrepo-com.svg";
import heartIcon from "../assets/heart-svgrepo-com.svg";


const NavBar = () => {
  return (
    <nav className="nav">


          <div className="neon-tech">NEON-TECH</div>
        <div className="links">
            <Link to="/deals" className="link">Deals</Link>
            <Link to="/phones" className="link">Phones</Link>
            <Link to="/laptops" className="link">Laptops</Link>
            <Link to="/home-electronics" className="link">Home Electronics</Link>
            <Link to="/news" className="link">News</Link>
        </div>


        <div className="search-input">
          <input type="text" className="search" placeholder="search" />
          {/* <img src="https://img.icons8.com/ios-glyphs/30/000000/search--v1.png" alt="search" className="search-icon image" /> */}
     <lord-icon className="search-icon"
  src="https://cdn.lordicon.com/swqyihda.json"
  trigger="hover"
  stroke="bold"
  colors="primary:#ffffff,secondary:#ffffff"
></lord-icon>
        </div>
        <div className="icons">
               <Link to="/profile" className=" profile-link icon">
                  <img src={personIcon} alt="profile" className="image"/>
               </Link>
               <Link to="/wishlist" className="icon">
                  <img src={heartIcon} className="image" alt="wishlist"/>
               </Link>
               <Link to="/cart" className="icon">
                  <img src={cartIcon} className="image" alt="cart"/>
               </Link>
            </div>

    </nav>
  );
};

export default NavBar;
