import React, { useEffect, useState } from "react";
import "./Signup.css";
import axios from "axios";
import UserStore from "../../store/UserStore";
import { useNavigate, useSearchParams } from "react-router-dom";

const Signup = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showServerNotice, setShowServerNotice] = useState(false);

    //State to hold form data
    const {user,fetchUser,setuser} = UserStore();
    
    const [userData, setUserData] = useState({
        username: "",
        email: "",
        password: "",
    });

    const handelSignUp = async(e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        setShowServerNotice(true);
        
        try {
            if (!userData.username.trim()) {
                setError("Username is required");
                setShowServerNotice(false);
                return;
            }
            // if (!userData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
            //     setError("Please enter a valid email");
            //     return;
            // }
            if (!userData.password.trim() || userData.password.length < 3) {
                setError("Password must be at least 3 characters");
                setShowServerNotice(false);
                return;
            }

            const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/signup`, {
                username: userData.username,
                email: userData.email,
                password: userData.password
            }, { withCredentials: true })
            
            console.log(res.data);
            // Only clear username, keep email and password for login
            setUserData((prev) => ({ ...prev, username: "" }));
            setIsLogin(true);
            setShowServerNotice(false);
        } catch(err) {
            setError(err.response?.data?.message || "Signup failed. Please try again.");
            console.error("Signup error:", err);
            setShowServerNotice(false);
        } finally {
            setLoading(false);
        }
    }
   

    const handelLogin = async(e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        setShowServerNotice(true);
        
        try {
            // if (!userData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
            //     setError("Please enter a valid email");
            //     return;
            // }
            // if (!userData.password.trim()) {
            //     setError("Password is required");
            //     return;
            // }

            const token = await axios.post(`${import.meta.env.VITE_BASE_URL}/login`, {
                email: userData.email,
                password: userData.password
            }, { withCredentials: true })
            
            const curUser = await axios.get(`${import.meta.env.VITE_BASE_URL}/me`, { withCredentials: true })
            setuser(curUser.data);
            setUserData({ username: "", email: "", password: "" });
            setShowServerNotice(false);
            navigate('/home')
        } catch(err) {
            setError(err.response?.data?.message || "Invalid credentials. Please try again.");
            console.error("Login error:", err);
            setShowServerNotice(false);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const mode = searchParams.get("mode");
        if (mode === "signup") {
            setIsLogin(false);
        }
        if (mode === "login") {
            setIsLogin(true);
        }
    }, [searchParams]);

    useEffect(() => {
        console.log("call use");
        
        if(!user){
            console.log("call underrr");
            
            fetchUser();
        }
    }, [user]);
    

    return (
        <div className="auth-container">
            <div className="animated-background"></div>
            <div className="auth-box">
                <div className="left-side">
                    <div className="left-bg-animation">
                        <div className="orb orb-1"></div>
                        <div className="orb orb-2"></div>
                        <div className="orb orb-3"></div>
                    </div>
                    <div className="grid-pattern"></div>
                    <div className="left-content">
                        <div className="floating-card card-1">
                            <div className="card-icon">📱</div>
                            <p>Easy Ordering</p>
                        </div>
                        <div className="floating-card card-2">
                            <div className="card-icon">🚚</div>
                            <p>Fast Delivery</p>
                        </div>
                        <div className="floating-card card-3">
                            <div className="card-icon">💰</div>
                            <p>Great Deals</p>
                        </div>
                        <div className="center-content">
                            <div className="main-illustration">
                                <div className="food-bowl">
                                    <div className="bowl-item item-1">🍕</div>
                                    <div className="bowl-item item-2">🍔</div>
                                    <div className="bowl-item item-3">🍜</div>
                                    <div className="bowl-shine"></div>
                                </div>
                            </div>
                            <h1 className="left-title">
                                {isLogin ? "Welcome Back!" : "Join Us Today!"}
                            </h1>
                            <p className="left-subtitle">
                                {isLogin 
                                    ? "Experience the best food delivery service" 
                                    : "Order delicious food from your favorite restaurants"}
                            </p>
                            <div className="feature-list">
                                <div className="feature-item">
                                    <div className="feature-badge">✓</div>
                                    <span>Fastest Delivery</span>
                                </div>
                                <div className="feature-item">
                                    <div className="feature-badge">✓</div>
                                    <span>Secure Payments</span>
                                </div>
                                <div className="feature-item">
                                    <div className="feature-badge">✓</div>
                                    <span>Best Prices</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="right-side">
                    <div className="form-container">
                        <div className="form-header">
                            <h2 className="title">
                                {isLogin ? "Welcome Back 👋" : "Create Account ✨"}
                            </h2>
                            <p className="subtitle">
                                {isLogin ? "Sign in to your account" : "Set up your profile"}
                            </p>
                        </div>

                        <form className="form">
                            {!isLogin && (
                                <div className="form-group">
                                    <label htmlFor="username">Username</label>
                                    <input
                                        id="username"
                                        type="text"
                                        placeholder="Enter your username"
                                        className="input-field"
                                        onChange={
                                            (e)=>setUserData((pre)=>({...pre, username:e.target.value}))
                                        }
                                    />
                                    <div className="input-border"></div>
                                </div>
                            )}
                            <div className="form-group">
                                <label htmlFor="email">Email Address</label>
                                <input 
                                    id="email"
                                    type="email" 
                                    placeholder="Enter your email" 
                                    className="input-field"
                                    onChange={
                                        (e)=>setUserData((pre)=>({...pre, email:e.target.value}))
                                    }
                                />
                                <div className="input-border"></div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <input
                                    id="password"
                                    type="password"
                                    placeholder="Enter your password"
                                    className="input-field"
                                    onChange={
                                        (e)=>setUserData((pre)=>({...pre, password:e.target.value}))
                                    }
                                />
                                <div className="input-border"></div>
                            </div>

                            {error && (
                                <div className="error-box">
                                    <span className="error-icon">⚠</span>
                                    <div>
                                        <p className="error-title">Authentication Failed</p>
                                        <p className="error-message">{error}</p>
                                    </div>
                                </div>
                            )}

                            {showServerNotice && loading && (
                                <div className="server-notice-box">
                                    <span className="notice-icon">⏳</span>
                                    <div>
                                        <p className="notice-title">Please Wait</p>
                                        <p className="notice-message">Onrender server is starting up. This may take 30-50 seconds...</p>
                                    </div>
                                </div>
                            )}

                            {
                                isLogin ? (
                                    <button type="submit" className="btn btn-primary" onClick={handelLogin} disabled={loading}>
                                        <span>{loading ? "Signing in..." : "Sign In"}</span>
                                        {loading ? (
                                            <span className="btn-spinner">⟳</span>
                                        ) : (
                                            <span className="btn-icon">→</span>
                                        )}
                                    </button>
                                ) : (
                                    <button type="submit" className="btn btn-primary" onClick={handelSignUp} disabled={loading}>
                                        <span>{loading ? "Creating account..." : "Create Account"}</span>
                                        {loading ? (
                                            <span className="btn-spinner">⟳</span>
                                        ) : (
                                            <span className="btn-icon">→</span>
                                        )}
                                    </button>
                                )
                            }
                        </form>

                        <p className="toggle-text">
                            {isLogin ? "Don't have an account?" : "Already have an account?"}
                            <span
                                className="toggle-link"
                                onClick={() => setIsLogin(!isLogin)}
                            >
                                {isLogin ? " Sign up" : " Login"}
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
