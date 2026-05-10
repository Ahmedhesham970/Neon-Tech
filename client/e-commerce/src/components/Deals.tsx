import "./Deals.css";
import useProducts from "../apis/productsApi";
import { Link } from "react-router";

export default function Deals() {
  const { products, loading } = useProducts();

  if (loading) {
    return <div style={{backgroundColor:"white"}}>Loading deals...</div>;
  }

  return (
    <div style={{background:'var(--back-ground-color)',color:'white',padding:'40px'}} className="deals-section">
      <div className="deals-box"><p style={{marginBottom:'20px'}}>Deals & Offers </p></div>
      <p className="sentence">Don't miss out on our exclusive deals! Shop now and save big on your favorite products. Limited time offer, so act fast!</p>


<div className="new-arrivals">
      {products.slice(0, 4).map((product) => (
        <Link to={`/products/${product._id}`} key={product._id} className="new-arrival-item">
          <img className="new-pic" src={product.images[0]} alt={product.name} />
          <h3>{product.name}</h3>
          <div>{product.description}</div>
          <div>${product.price}</div>
        </Link>
      ))}
    </div>
    </div>
  );
}
