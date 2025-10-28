import React, { useEffect, useState, useRef } from 'react'
import "./home.css"
import "../../components/Demo.css"
import {  Link, useNavigate } from "react-router-dom"
import img1 from "../../assets/delivery-boy.png"
import orderimg from "../../assets/easy-to-order.png"
import delivalry from "../../assets/fast-delivery.png"
import qualityimg from "../../assets/best-quality.png"
import deleboyphimg from "../../assets/delivery-boy-with-phone.png"
import mobileappimg from "../../assets/mobile-app.png"
import profile1 from "../../assets/profile1.jpeg"
import profile2 from "../../assets/profile2.jpeg"
import profile3 from "../../assets/profile3.jpeg"
import Footer from '../../components/Footer/Footer'
import UserStore from '../../store/UserStore'
import axios from 'axios'

import { foodItems as products } from '../../utils/Utils'
import BookTableCard from '../../components/BookTable/BookTableCard'


import { motion, useScroll, useTransform } from "framer-motion";
import mainDish from "../../assets/banner.jpg";
import salad from "../../assets/salad.png";
import burger from "../../assets/burger.png";
import pizza from "../../assets/pizza.png";

const Home = () => {
    const navigate = useNavigate();
    console.log(import.meta.env.VITE_BASE_URL);
    
    // Context 
    const { user, fetchUser } = UserStore();
    const [totalItems, setTotalItems] = useState(0);
    const [nav, setNav] = useState("home");

    const [bar, setBar] = useState(false);
    const [loginbtnvisible, setloginbtnvisible] = useState(user ? true : false);


    const handleBooking = async (payload) => {
        // send payload to backend if needed
        console.log("Booking payload:", payload);
    };

    const handleBarToggle = () => {
        setBar(!bar);
    };

    // Add To Cart Function
    const handelAddToCart = async (id) => {

        const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/add-to-cart`, { userId: user.id, productId: id }, { withCredentials: true });
        console.log(res.data);
        const response = await axios.post(
            `${import.meta.env.VITE_BASE_URL}/total-items`, { userId: user.id },
            { withCredentials: true }
        );
        const totalItems = response.data;
        console.log("Total items in cart:", totalItems);
        setTotalItems(totalItems);
    }

    useEffect(() => {
        if (!user) {
            fetchUser();
        }
        const menuSection = document.getElementById("home");
        if (menuSection) {
            menuSection.scrollIntoView({ behavior: "smooth" });
        }
        setNav("home");
    }, [user]);

    useEffect(() => {
        const fetchCartItemsNumber = async () => {
            try {
                const response = await axios.post(
                    `${import.meta.env.VITE_BASE_URL}/total-items`, { userId: user.id },
                    { withCredentials: true }
                );
                const totalItems = response.data;
                console.log("Total items in cart:", totalItems);
                setTotalItems(totalItems);
            } catch (error) {
                console.error("Error fetching total items:", error);
            }
        };
        if (user?.id) fetchCartItemsNumber();
    }, []);



    // Animation for Hero Section============================

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



    // tESTIMONIAL===========================   

    const testimonials = [
        {
            name: "Sudip Basak",
            image: profile1,
            text: "“Amazing experience! The delivery was quick and the service was outstanding. Highly recommend!”",
        },
        {
            name: "Amit Sharma",
            image: profile2,
            text: "“Food arrived hot and fresh! The team really cares about their customers.”",
        },
        {
            name: "Priya Sen",
            image: profile3,
            text: "“I’ve used many services, but this one stands out for its speed and quality.”",
        },
    ];


    const [index, setIndex] = useState(0);

    const handleNext = () => {
        setIndex((prev) => (prev + 1) % testimonials.length);
    };

    const handlePrev = () => {
        setIndex((prev) =>
            prev === 0 ? testimonials.length - 1 : prev - 1
        );
    };

    const { name, image, text } = testimonials[index];


    return (
        <div className='home-main-wrapper'>

            {/* For NavBar Start */}
            <div className='home-nave-bar'>
                <h3>Foodie!.</h3>
                <div className={`navbar-menus ${bar ? "active" : ""}`}>
                    <Link className={nav === "home" ? "active" : ""}
                        onClick={() => {
                            const menuSection = document.getElementById("home");
                            if (menuSection) {
                                menuSection.scrollIntoView({ behavior: "smooth" });
                            }
                            setNav("home");
                             setBar(false);
                        }}
                    >
                        Home
                    </Link>
                    <Link
                        onClick={() => {
                            const menuSection = document.getElementById("menu-section");
                            if (menuSection) {
                                menuSection.scrollIntoView({ behavior: "smooth" });
                            }
                            setNav("menu");
                             setBar(false);
                        }}
                        className={nav === "menu" ? "active" : ""}>
                        Menu
                    </Link>
                    <Link className={nav === "service" ? "active" : ""}
                        onClick={() => {
                            const menuSection = document.getElementById("service");
                            if (menuSection) {
                                menuSection.scrollIntoView({ behavior: "smooth" });
                            }
                            setNav("service");
                             setBar(false);
                        }}
                    >
                        Service
                    </Link>
                    <Link className={nav === "about" ? "active" : ""}
                        onClick={() => {
                            const menuSection = document.getElementById("about");
                            if (menuSection) {
                                menuSection.scrollIntoView({ behavior: "smooth" });
                            }
                            setNav("about");
                             setBar(false);
                        }}
                    >
                        About Us
                    </Link>
                    <Link className={nav === "contact" ? "active" : ""}
                        onClick={() => {
                            const menuSection = document.getElementById("contact");
                            if (menuSection) {
                                menuSection.scrollIntoView({ behavior: "smooth" });
                            }
                            setNav("contact");
                            setBar(false);
                        }}
                    >
                        Contact
                    </Link>

                    <div className='navbar-buttons-wrap'>

                        <div className='bag-icon-con'>
                            <span>{totalItems}</span>
                            <Link to={"/cart"}>
                                <i className="fa-solid fa-bag-shopping bag-icon"></i>
                            </Link>
                            
                        </div>
                        {
                            !loginbtnvisible && <button className='signinbtn' onClick={() => navigate("/login")}>Sign-in</button>
                        }
                       <Link to={"/history"}>
                                <i class="fa-brands fa-first-order bag-icon"></i>
                            </Link>
                    </div>
                </div>


                <i
                    className={`fa-solid ${bar ? "fa-xmark close-icon" : "fa-bars bar-icon"}`}
                    onClick={handleBarToggle}
                ></i>

            </div>

            {/* Section Start 1--- */}
            <section className="hero-wrapper" ref={ref} id='home'>
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
                            onClick={() => {
                                const menuSection = document.getElementById("booktable");
                                if (menuSection) {
                                    menuSection.scrollIntoView({ behavior: "smooth" });
                                }

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
                            onClick={() => {
                                const menuSection = document.getElementById("menu-section");
                                if (menuSection) {
                                    menuSection.scrollIntoView({ behavior: "smooth" });
                                }
                                setNav("menu");
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

            {/* Section 2===== */}
            <section className='home-sec-two' id='service'>
                <p className='head'>Our Srevices</p>
                <h1 className='head1'>What We Provide</h1>
                <div className='home-sec-two-wrapper'>
                    <div className='home-sec-two-card'>
                        <img src={orderimg} alt="" />
                        <h3>Easy To Order</h3>
                        <p>You Can need a few steps to Order</p>
                    </div>
                    <div className='home-sec-two-card'>
                        <img src={delivalry} alt="" />
                        <h3>Easy To Delivery</h3>
                        <p>You Can need a few steps to Order</p>
                    </div>
                    <div className='home-sec-two-card'>
                        <img src={qualityimg} alt="" />
                        <h3>Easy To Book Table </h3>
                        <p>You Can need a few steps to Order</p>
                    </div>
                </div>
            </section>

            {/* section for Cart 3---- */}
            <section className="sec-three-wrapper" id='menu-section'>
                <p className='head'>Menu</p>
                <h1 className="head1">The Most Popular</h1>
                <div className="sec-three-card-container">

                    {
                        products.slice(0, 8).map((item, i) => (
                            <div className="item-card" key={i}>
                                <img src={item.image} alt="" />
                                <h3>{item.name} </h3>
                                <p>₹ {item.price}</p>
                                <button onClick={() => handelAddToCart(item.id)}>ADD TO CART</button>
                            </div>
                        ))
                    }

                </div>
            </section>

            {/* Tranding Items */}
            <section className="sec-three-wrapper" id='menu-section'>
                <h1 className="head1">Tranding Items</h1>
                <div className="sec-three-card-container">

                    {
                        products.slice(9, 16).map((item, i) => (
                            <div className="item-card" key={i}>
                                <img src={item.image} alt="" />
                                <h3>{item.name} </h3>
                                <p>₹ {item.price}</p>
                                <button onClick={() => handelAddToCart(item.id)}>ADD TO CART</button>
                            </div>
                        ))
                    }

                </div>
            </section>

            {/* Bengali Thali Speatials */}
            <section className="sec-three-wrapper" id='menu-section'>
                <h1 className="head1">Bengali Thali</h1>
                <div className="sec-three-card-container">

                    {
                        products.slice(17, 21).map((item, i) => (
                            <div className="item-card" key={i}>
                                <img src={item.image} alt="" />
                                <h3>{item.name} </h3>
                                <p>₹ {item.price}</p>
                                <button onClick={() => handelAddToCart(item.id)}>ADD TO CART</button>
                            </div>
                        ))
                    }

                </div>
            </section>

            {/* Soft Drinks */}
            <section className="sec-three-wrapper" id='menu-section'>
                <h1 className="head1">Soft Drinks</h1>
                <div className="sec-three-card-container">

                    {
                        products.slice(22, 27).map((item, i) => (
                            <div className="item-card" key={i}>
                                <img src={item.image} alt="" />
                                <h3>{item.name} </h3>
                                <p>₹ {item.price}</p>
                                <button onClick={() => handelAddToCart(item.id)}>ADD TO CART</button>
                            </div>
                        ))
                    }

                </div>
            </section>

            {/* Table Booking  */}
            <section className='sec-book-table' id='booktable'>

                <BookTableCard onSubmit={handleBooking} />
            </section>

            {/* Section for Service */}
            <div className="home-service-container" id="about">
                <img src={deleboyphimg} alt="Delivery" className="bannimg" />

                <div className="home-service-content">
                    <h2>Our Service</h2>
                    <h1>What They Say?</h1>

                    <div className="service-corsel">
                        <div className="profile-wrapper">
                            <img src={image} alt="Profile" className="profile-pic" />
                            <h3>{name}</h3>
                        </div>

                        <p className="testimonial">{text}</p>

                        <div className="arrow-handler-con">
                            <button onClick={handlePrev}>
                                <i className="fa-solid fa-arrow-left arrow"></i>
                            </button>
                            <button onClick={handleNext}>
                                <i className="fa-solid fa-arrow-right arrow"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* mobile phone img container */}
            <section className='home-mobile-con-sec'>
                <div className="mobile-sec-wrapper">
                    <img src={mobileappimg} alt="" />
                    <div className="mobile-sec-text-wrapper">
                        <h2>Download Our App</h2>
                        <h1>Get Food Delivery App</h1>
                        <p>Download App for Android and ios mobile phone.</p>
                        <button>Download Now</button>
                    </div>
                </div>
            </section>

            {/* NewsLetter Section */}
            <section className="sec-newsletter-con" id='contact'>
                <h2>Subscribe Our Newsletter</h2>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur id veniam inventore doloribus culpa sint tenetur laboriosam veritatis, laborum alias.</p>
                <div className="newsletter-input-con">
                    <input type="email" placeholder='Enter your email' />
                    <button>Subscribe</button>
                </div>
            </section>

            {/* Section Footer */}
            <section className="sec-footer">
                <Footer />
            </section>
        </div>
    )
}

export default Home