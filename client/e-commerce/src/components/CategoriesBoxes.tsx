import { useState } from "react";
import { FaMobileAlt, FaLaptop, FaHeadphones, FaCreativeCommonsPdAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./CategoriesBoxes.css";

const categories = [
  { name: "Phones", icon: <FaMobileAlt />, color: "#00f0ff" },
  { name: "Laptops", icon: <FaLaptop />, color: "#ff00f0" },
  { name: "Accessories", icon: <FaHeadphones />, color: "#00ff9f" },
  { name: "Hardwares", icon: <FaCreativeCommonsPdAlt />, color: "#00ff9f" },
];

export default function Categories() {
  const [bgColor, setBgColor] = useState("#111");

  return (
    <>

    <div className="categories-section">
     <div className="sentence-and-link-to-categories">
    <div> <p className="sentence1">Shop by Category</p>
    <p className="sentence">discover our wide range of products</p>
    </div>
      <Link  to="/categories" className="link-to-categories"> → ALL CATEGORIES </Link></div>
      <div
      className="categories-container"
      style={{
        background: bgColor,
        transition: "0.4s ease",
        padding: "40px",
      }}
      >
      {categories.map((cat, index) => (
  <Link to={`/categories/${cat.name.toLowerCase()}`} style={{ textDecoration: 'none' }}
    key={index}
    className="category"
    onMouseEnter={(e) =>
      (e.currentTarget.style.background =  `${cat.color}33`)
    }
    onMouseLeave={(e) =>
      (e.currentTarget.style.background = "rgb(17, 17, 17)")
    }
  >
    <div
      className="icon"
      style={{
        color: cat.color,
        filter: `drop-shadow(0 0 10px ${cat.color})`,
      }}
    >
      {cat.icon}
    </div>
    <span style={{fontSize:"larger",color:'white'}}>{cat.name}</span>
  </Link>
))}
    </div>
    </div>
            </>
  );
}
