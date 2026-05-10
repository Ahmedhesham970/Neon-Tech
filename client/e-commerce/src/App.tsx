import './App.css'
import MagicRings from './components/MagicRings';
import NavBar from './components/NavBar';
import laptopIcon from "./assets/ChatGPT Image Apr 30, 2026, 02_52_03 PM.png";
// import { Link } from 'react-router-dom';
import Categories from './components/CategoriesBoxes';
import Footer from "./components/Footer";
import Deals from './components/Deals';


function App() {
  return (

   <>
     <div className="App">
 <NavBar />
    <div style={{position:"relative"}} className="relative w-screen h-screen overflow-hidden hero-section
">

 <h1 className="word-inside-hero" >Welcome to Neon-Tech</h1>

      <div className="absolute inset-0 -z-10">
        <MagicRings
          color="#A855F7"
          colorTwo="#6366F1"
          ringCount={6}
          speed={.75}

          attenuation={10}
          lineThickness={2}
          baseRadius={0.35}
          radiusStep={0.1}
          scaleRate={0.1}
          opacity={1}
          blur={0}
          noiseAmount={0.1}
          rotation={0}
          ringGap={1.5}
          fadeIn={0.7}
          fadeOut={0.5}
          followMouse={false}
          mouseInfluence={0.2}
          hoverScale={1.2}
          parallax={0.05}
          clickBurst={false}
        />
    <img src={laptopIcon} alt="laptop" className="laptop"  />

      </div>
<div className="beside-heading">
  <h2 className="subheading">NEXT-GEN ARCHITECTURE</h2>

  <span className="subheading highlight">
    QUANTUM SERIES 2024
  </span>

  <h3 className="subheading desc">
    Engineered for ultimate precision. Experience the breakthrough in neural processing and cinematic visuals.
  </h3>
</div>
    </div>
<Categories />
</div>
<Deals />
 <Footer />
</>
  );
}

export default App
