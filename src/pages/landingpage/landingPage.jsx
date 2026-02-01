import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./landingPage.css";

import heroImg from "../../assets/banner.jpg";
import deliveryImg from "../../assets/delivery-boy.png";
import orderImg from "../../assets/easy-to-order.png";
import fastImg from "../../assets/fast-delivery.png";
import qualityImg from "../../assets/best-quality.png";
import mobileApp from "../../assets/mobile-app.png";
import pizza from "../../assets/pizza.png";
import burger from "../../assets/burger.png";
import salad from "../../assets/salad.png";

const LandingPage = () => {
	const navigate = useNavigate();

	const goLogin = () => navigate("/login?mode=login");
	const goSignup = () => navigate("/login?mode=signup");
	const goAdmin = () => navigate("/admin");

	const partnerLogos = [
		"Zomato", "Swiggy", "UberEats", "Foodpanda", "Domino's", "KFC"
	];

	const timeline = [
		{ title: "Order Placed", desc: "We confirm your order instantly." },
		{ title: "Chef Cooking", desc: "Fresh preparation starts right away." },
		{ title: "Out for Delivery", desc: "Rider picks up with live tracking." },
		{ title: "Delivered", desc: "Enjoy your meal, hot and fast." }
	];

	const testimonials = [
		{
			name: "Ananya Roy",
			role: "Foodie Plus Member",
			text: "Hands down the smoothest ordering experience. The ETA is always accurate."
		},
		{
			name: "Sourav Das",
			role: "Power User",
			text: "The UI is premium, the delivery is quick, and the food is always fresh."
		},
		{
			name: "Meera Gupta",
			role: "Weekend Explorer",
			text: "The curated specials are top notch. I order weekly without a second thought."
		}
	];

	const faqs = [
		{
			q: "How fast is delivery?",
			a: "Most orders arrive within 25 minutes depending on distance and demand."
		},
		{
			q: "Is there a minimum order value?",
			a: "No minimum order for most restaurants. Some partners may have limits."
		},
		{
			q: "Can I track my rider?",
			a: "Yes, live tracking is available from kitchen to doorstep."
		},
		{
			q: "Do you have premium membership?",
			a: "Foodie Plus offers zero delivery fee and exclusive offers."
		}
	];

	return (
		<div className="foodie-landing">
			<div className="landing-glow" />
			<div className="landing-glow second" />

			{/* Nav */}
			<nav className="landing-nav">
				<div className="brand">
					<span className="brand-dot" />
					<h1>
						Foodie<span>!</span>
					</h1>
				</div>
				<div className="nav-actions">
					<button className="btn ghost" onClick={goLogin}>Login</button>
					<button className="btn solid" onClick={goSignup}>Sign Up</button>
					<button className="btn admin" onClick={goAdmin}>Admin Panel</button>
				</div>
			</nav>

			{/* Hero */}
			<section className="hero">
				<motion.div
					className="hero-text"
					initial={{ opacity: 0, y: 24 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.7 }}
				>
					<div className="pill">Premium food delivery experience</div>
					<h2>
						Savor <span>delicious</span> moments,
						<br /> delivered in minutes.
					</h2>
					<p>
						Foodie brings restaurant-quality meals to your doorstep with lightning-fast
						delivery, curated menus, and real-time order tracking.
					</p>
					<div className="hero-cta">
						<button className="btn solid" onClick={goSignup}>Get Started</button>
						<button className="btn ghost" onClick={goLogin}>I already have an account</button>
					</div>
					<div className="hero-stats">
						<div>
							<h4>4.9★</h4>
							<p>Average Rating</p>
						</div>
						<div>
							<h4>25k+</h4>
							<p>Monthly Orders</p>
						</div>
						<div>
							<h4>12 min</h4>
							<p>Avg. Delivery</p>
						</div>
					</div>
				</motion.div>

				<motion.div
					className="hero-card"
					initial={{ opacity: 0, scale: 0.96 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.7, delay: 0.1 }}
				>
					<img src={heroImg} alt="Foodie hero" />
					<div className="hero-card-info">
						<div>
							<h3>Today’s Specials</h3>
							<p>Chef-curated flavors picked just for you.</p>
						</div>
						<button className="btn small" onClick={() => navigate("/")}>Explore Menu</button>
					</div>
					<div className="hero-floating">
						<div>
							<span>Live Riders</span>
							<strong>128</strong>
						</div>
						<div>
							<span>Avg. ETA</span>
							<strong>18 min</strong>
						</div>
					</div>
				</motion.div>
			</section>

			{/* Partners */}
			<section className="partners">
				<p>Trusted by premium brands</p>
				<div className="partner-strip">
					{partnerLogos.map((logo) => (
						<span key={logo}>{logo}</span>
					))}
				</div>
			</section>

			{/* Quick Actions */}
			<section className="actions">
				<motion.div className="action-card" whileHover={{ y: -6 }}>
					<h4>Login</h4>
					<p>Access your orders, cart, and rewards instantly.</p>
					<button className="btn solid" onClick={goLogin}>Login</button>
				</motion.div>
				<motion.div className="action-card highlight" whileHover={{ y: -6 }}>
					<h4>Sign Up</h4>
					<p>Create your Foodie account in under a minute.</p>
					<button className="btn solid" onClick={goSignup}>Create Account</button>
				</motion.div>
				<motion.div className="action-card" whileHover={{ y: -6 }}>
					<h4>Admin Panel</h4>
					<p>Manage orders, menus, and customer insights.</p>
					<button className="btn solid" onClick={goAdmin}>Open Admin</button>
				</motion.div>
			</section>

			{/* Features */}
			<section className="features">
				<div className="section-title">
					<p>Why Foodie</p>
					<h3>Modern, fast & reliable</h3>
				</div>
				<div className="feature-grid">
					<div className="feature-item">
						<img src={orderImg} alt="Easy to order" />
						<h4>Seamless Ordering</h4>
						<p>One-tap checkout with smart recommendations.</p>
					</div>
					<div className="feature-item">
						<img src={fastImg} alt="Fast delivery" />
						<h4>Lightning Delivery</h4>
						<p>Live tracking and trusted delivery partners.</p>
					</div>
					<div className="feature-item">
						<img src={qualityImg} alt="Best quality" />
						<h4>Top Quality</h4>
						<p>Fresh, hygienic, and chef-approved every time.</p>
					</div>
				</div>
			</section>

			{/* Timeline */}
			<section className="timeline">
				<div className="timeline-background">
					<div className="timeline-orb timeline-orb-1"></div>
					<div className="timeline-orb timeline-orb-2"></div>
					<svg className="timeline-line" viewBox="0 0 1200 4">
						<line x1="0" y1="2" x2="1200" y2="2" strokeLinecap="round" />
					</svg>
				</div>
				<motion.div
					className="section-title"
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					viewport={{ once: true }}
				>
					<p className="section-subtitle">Order Journey</p>
					<h3>From kitchen to doorstep</h3>
				</motion.div>
				<div className="timeline-grid">
					{timeline.map((item, index) => (
						<motion.div
							key={item.title}
							className="timeline-card"
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: index * 0.1 }}
							viewport={{ once: true }}
							whileHover={{ y: -10, scale: 1.02 }}
						>
							<div className="timeline-connector">
								<div className="timeline-dot"></div>
								{index < timeline.length - 1 && <div className="timeline-arrow">→</div>}
							</div>
							<div className="timeline-content">
								<div className="timeline-index">{String(index + 1).padStart(2, "0")}</div>
								<h4>{item.title}</h4>
								<p>{item.desc}</p>
							</div>
						</motion.div>
					))}
				</div>
			</section>

			{/* Showcase */}
			<section className="showcase">
				<div className="showcase-background">
					<div className="showcase-orb showcase-orb-1"></div>
					<div className="showcase-orb showcase-orb-2"></div>
				</div>
				<motion.div
					className="showcase-text"
					initial={{ opacity: 0, x: -30 }}
					whileInView={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.6 }}
					viewport={{ once: true }}
				>
					<motion.p
						className="section-subtitle"
						initial={{ opacity: 0 }}
						whileInView={{ opacity: 1 }}
						transition={{ delay: 0.1 }}
						viewport={{ once: true }}
					>
						✨ Featured Selection
					</motion.p>
					<motion.h3
						initial={{ opacity: 0 }}
						whileInView={{ opacity: 1 }}
						transition={{ delay: 0.2 }}
						viewport={{ once: true }}
					>
						Curated favorites you'll love
					</motion.h3>
					<motion.p
						initial={{ opacity: 0 }}
						whileInView={{ opacity: 1 }}
						transition={{ delay: 0.3 }}
						viewport={{ once: true }}
					>
						From artisan pizzas to fresh salads, Foodie serves the best.
					</motion.p>
					<motion.button
						className="btn ghost"
						onClick={() => navigate("/")}
						whileHover={{ scale: 1.05, x: 5 }}
						whileTap={{ scale: 0.95 }}
					>
						📜 Browse Menu
					</motion.button>
				</motion.div>
				<div className="showcase-grid">
					{[
						{ img: pizza, label: "Truffle Pizza", emoji: "🍕" },
						{ img: burger, label: "Signature Burger", emoji: "🍔" },
						{ img: salad, label: "Garden Salad", emoji: "🥗" }
					].map((item, index) => (
						<motion.div
							key={item.label}
							className="showcase-item"
							initial={{ opacity: 0, scale: 0.8 }}
							whileInView={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.5, delay: index * 0.1 }}
							viewport={{ once: true }}
							whileHover={{ y: -15, scale: 1.08 }}
						>
							<div className="showcase-image-wrapper">
								<img src={item.img} alt={item.label} className="showcase-image" />
								<div className="showcase-overlay">
									<span className="item-emoji">{item.emoji}</span>
								</div>
								<div className="showcase-shine"></div>
							</div>
							<div className="showcase-info">
								<span className="showcase-label">{item.label}</span>
								<button className="showcase-btn">Order Now</button>
							</div>
						</motion.div>
					))}
				</div>
			</section>

			{/* App Promo */}
			<section className="app-section">
				<div className="app-background">
					<div className="app-orb app-orb-1"></div>
					<div className="app-orb app-orb-2"></div>
				</div>
				<motion.div
					className="app-card"
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					viewport={{ once: true }}
				>
					<div className="app-text">
						<motion.div
							className="app-badge"
							initial={{ opacity: 0, x: -20 }}
							whileInView={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.2 }}
							viewport={{ once: true }}
						>
							⚡ Mobile First
						</motion.div>
						<motion.h3
							initial={{ opacity: 0 }}
							whileInView={{ opacity: 1 }}
							transition={{ delay: 0.3 }}
							viewport={{ once: true }}
						>
							Get the Foodie app
						</motion.h3>
						<motion.p
							initial={{ opacity: 0 }}
							whileInView={{ opacity: 1 }}
							transition={{ delay: 0.4 }}
							viewport={{ once: true }}
						>
							Order faster, track in real-time, and unlock exclusive offers.
						</motion.p>
						<motion.div
							className="app-features"
							initial={{ opacity: 0 }}
							whileInView={{ opacity: 1 }}
							transition={{ delay: 0.5 }}
							viewport={{ once: true }}
						>
							<div className="feature-item">
								<span className="feature-icon">⚡</span>
								<span>Lightning Fast</span>
							</div>
							<div className="feature-item">
								<span className="feature-icon">🎯</span>
								<span>Real-time Track</span>
							</div>
							<div className="feature-item">
								<span className="feature-icon">🎁</span>
								<span>Exclusive Deals</span>
							</div>
						</motion.div>
						<motion.button
							className="btn solid download-btn"
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
						>
							<span>📱 Download App</span>
						</motion.button>
					</div>
					<motion.div
						className="app-image-container"
						initial={{ opacity: 0, x: 30 }}
						whileInView={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.6, delay: 0.2 }}
						viewport={{ once: true }}
						whileHover={{ y: -10 }}
					>
						<div className="phone-frame">
							<img src={mobileApp} alt="Foodie app" className="phone-image" />
							<div className="phone-glow"></div>
						</div>
					</motion.div>
				</motion.div>
				<motion.img
					className="delivery-float"
					src={deliveryImg}
					alt="Delivery rider"
					initial={{ opacity: 0, x: 50 }}
					whileInView={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.7, delay: 0.4 }}
					viewport={{ once: true }}
					whileHover={{ scale: 1.1 }}
				/>
			</section>

			{/* Testimonials */}
			<section className="testimonials">
				<div className="section-title">
					<p>Customer Love</p>
					<h3>What people say about Foodie</h3>
				</div>
				<div className="testimonial-grid">
					{testimonials.map((item) => (
						<motion.div
							key={item.name}
							className="testimonial-card"
							whileHover={{ y: -6 }}
						>
							<p>“{item.text}”</p>
							<div>
								<h4>{item.name}</h4>
								<span>{item.role}</span>
							</div>
						</motion.div>
					))}
				</div>
			</section>

			{/* FAQ */}
			<section className="faq">
				<div className="section-title">
					<p>FAQ</p>
					<h3>Everything you need to know</h3>
				</div>
				<div className="faq-grid">
					{faqs.map((item) => (
						<div key={item.q} className="faq-item">
							<h4>{item.q}</h4>
							<p>{item.a}</p>
						</div>
					))}
				</div>
			</section>

			{/* CTA */}
			<section className="cta">
				<div>
					<h3>Ready to taste the difference?</h3>
					<p>Join Foodie and experience premium food delivery today.</p>
				</div>
				<div className="cta-actions">
					<button className="btn solid" onClick={goSignup}>Start Now</button>
					<button className="btn ghost" onClick={goLogin}>Login</button>
				</div>
			</section>

			<footer className="landing-footer">
				<span>© {new Date().getFullYear()} Foodie. All rights reserved.</span>
			</footer>
		</div>
	);
};

export default LandingPage;
