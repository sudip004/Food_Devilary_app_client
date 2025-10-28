import React, { useEffect, useRef } from "react";
import "./demo.css";
import { motion, useScroll, useTransform } from "framer-motion";
import mainDish from "../assets/delivery-boy.png";
import salad from "../assets/salad.png";
import burger from "../assets/burger.png";
import pizza from "../assets/pizza.png";
import deleboyphimg from "../assets/delivery-boy-with-phone.png";
import profile1 from "../assets/profile1.jpeg";

const HomeHero = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  // Parallax transform
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);

  useEffect(() => {
    const text = "Crafted with Passion • Served with Love ❤️";
    const el = document.getElementById("typewriter");
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        el.textContent += text.charAt(i);
        i++;
      } else clearInterval(interval);
    }, 70);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
    
    <section className="hero-wrapper" ref={ref}>
      {/* Glow Background */}
      <div className="hero-bg-glow"></div>

      {/* Text Content */}
      <motion.div
        className="hero-content"
        initial={{ opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1 className="shimmer-text">
          Indulge in <span>Gourmet Excellence</span>
        </h1>
        <p className="hero-subtext">
          Experience the art of fine dining — where every bite tells a story and every aroma feels
          like home.
        </p>

        <div className="hero-btns">
          <motion.button
            className="primary-btn"
            whileHover={{
              scale: 1.1,
              backgroundColor: "#ffb84d",
              boxShadow: "0 0 20px #ffb84d",
            }}
          >
            Book a Table 🍷
          </motion.button>
          <motion.button
            className="secondary-btn"
            whileHover={{
              scale: 1.05,
              backgroundColor: "#222",
              color: "#fff",
            }}
          >
            Explore Menu →
          </motion.button>
        </div>
        <p id="typewriter" className="typewriter"></p>
      </motion.div>

      {/* Floating Food Images */}
      <motion.div className="hero-images" style={{ y, scale }}>
        <motion.img
          src={mainDish}
          alt="Main Dish"
          className="main-dish"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1 }}
        />

        <motion.img
          src={pizza}
          alt="Pizza"
          className="float-item pizza"
          animate={{ y: [0, -25, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
        />
        <motion.img
          src={burger}
          alt="Burger"
          className="float-item burger"
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.img
          src={salad}
          alt="Salad"
          className="float-item salad"
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
      </motion.div>
    </section>
    <section>
        <div className="home-service-container" id="about">
  <div className="image-side">
    <img src={deleboyphimg} alt="Delivery Boy" className="floating-img" />
  </div>

  <div className="home-service-content">
    <h2>Our Service</h2>
    <h1>What They Say?</h1>

    <div className="service-corsel">
      <div className="profile-wrapper">
        <img src={profile1} alt="Profile" className="profile-pic" />
        <h3>Sudip Basak</h3>
      </div>

      <p className="testimonial">
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, deserunt. 
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, deserunt."
      </p>

      <div className="arrow-handler-con">
        <button><i className="fa-solid fa-arrow-left arrow"></i></button>
        <button><i className="fa-solid fa-arrow-right arrow"></i></button>
      </div>
    </div>
  </div>
</div>

    </section>
    </>
  );
};

export default HomeHero;
