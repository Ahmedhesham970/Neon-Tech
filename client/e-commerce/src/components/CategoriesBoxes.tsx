import { useState } from "react";
import { FaMobileAlt, FaLaptop, FaHeadphones, FaHackerNews, FaCreativeCommonsPdAlt } from "react-icons/fa";
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
     <div className="sentence-and-link-to-categories"> <h1 style={{color:'white',marginBottom:'20px'}}>Shop by Category</h1>
      <Link  to="/categories" className="link-to-categories">ALL CATEGORIES</Link></div>
      <div
      className="categories-container"
      style={{
        background: bgColor,
        transition: "0.4s ease",
        padding: "40px",
      }}
      >
      {categories.map((cat, index) => (
  <div
    key={index}
    className="category"
    onMouseEnter={(e) =>
      (e.currentTarget.style.background =  `${cat.color}33`)
    }
    onMouseLeave={(e) =>
      (e.currentTarget.style.background = "#1a1a1a")
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
  </div>
))}
    </div>
    </div>
            </>
  );
}
