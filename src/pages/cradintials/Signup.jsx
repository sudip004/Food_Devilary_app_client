import React, { useEffect, useState } from "react";
import "./Signup.css";
import axios from "axios";
import UserStore from "../../store/UserStore";
import { useNavigate } from "react-router-dom";

const Signup = () => {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);

    //State to hold form data
    const {user,fetchUser,setuser} = UserStore();
    // const user = UserStore((state) => state.user);
    // const fetchUser = UserStore((state) => state.fetchUser);
    // const setuser = UserStore((state) => state.setuser);
    
    

    const [userData, setUserData] = useState({
        username: "",
        email: "",
        password: "",
    });

    const handelSignUp = async(e) => {
        e.preventDefault();
        // Handle signup logic here
        const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/signup`, {
            username: userData.username,
            email: userData.email,
            password: userData.password
        }, { withCredentials: true })
        console.log(res.data);
        setIsLogin(pre=>!pre);
        
    }
   

    const handelLogin = async(e) => {
        e.preventDefault();
        // Handle login logic here
        const token = await axios.post(`${import.meta.env.VITE_BASE_URL}/login`, {
            email: userData.email,
            password: userData.password
        }, { withCredentials: true })
        
       const curUser = await axios.get(`${import.meta.env.VITE_BASE_URL}/me`, { withCredentials: true })
       setuser(curUser.data);
       navigate('/')
        
    }

    useEffect(() => {
        console.log("call use");
        
        if(!user){
            console.log("call underrr");
            
            fetchUser();
        }
    }, [user]);
    

    return (
        <div className="auth-container">
            <div className="auth-box">
                <div className="left-side">

                    {/* Example usage in React */}
                    <img
                        alt="blinking eyes"
                        src={
                            "data:image/svg+xml;utf8," +
                            "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 100'>" +
                            "<circle cx='50' cy='50' r='30' fill='%23ffffff'/>" +
                            "<circle cx='150' cy='50' r='30' fill='%23ffffff'/>" +
                            "<circle cx='50' cy='50' r='12' fill='%23b080ff'/>" +
                            "<circle cx='150' cy='50' r='12' fill='%23b080ff'/>" +
                            // left eyelid (animates height to create blink)
                            "<rect x='20' y='20' width='60' height='60' rx='30' fill='%230a0610'>" +
                            "<animate attributeName='height' values='60;0;60' dur='3s' repeatCount='indefinite' />" +
                            "</rect>" +
                            // right eyelid (slightly offset)
                            "<rect x='120' y='20' width='60' height='60' rx='30' fill='%230a0610'>" +
                            "<animate attributeName='height' values='60;0;60' dur='3s' begin='0.15s' repeatCount='indefinite' />" +
                            "</rect>" +
                            "</svg>"
                        }
                    />



                </div>

                <div className="right-side">
                    <h2 className="title">
                        {isLogin ? "Welcome Back 👋" : "Create Account ✨"}
                    </h2>

                    <form className="form">
                        {!isLogin && (
                            <input
                                type="text"
                                placeholder="UserName"
                                className="input-field"
                                onChange={
                                    (e)=>setUserData((pre)=>({...pre, username:e.target.value}))
                                }
                            />
                        )}
                        <input type="email" placeholder="Email" 
                        className="input-field"
                        onChange={
                                    (e)=>setUserData((pre)=>({...pre, email:e.target.value}))
                                }
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            className="input-field"
                            onChange={
                                (e)=>setUserData((pre)=>({...pre, password:e.target.value}))
                            }
                        />

                        {
                            isLogin ? (
                                <button type="submit" className="btn" onClick={handelLogin}>
                                    Login
                                </button>
                            ) : (
                                <button type="submit" className="btn" onClick={handelSignUp}>
                                    Sign Up
                                </button>
                            )
                        }
                    </form>

                    <p className="toggle-text">
                        {isLogin ? "Don’t have an account?" : "Already have an account?"}
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
    );
};

export default Signup;
