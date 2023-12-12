import React, { useState } from "react";
import "./LoginSignUp.css";
import { useNavigate } from "react-router-dom"; 
import { useRef } from "react";
import email_icon from "./Assets/email.png";
import password_icon from "./Assets/password.png";


const LoginSignup = () => {
    const emailRef  = useRef(null);
    const navigate = useNavigate(); 
    const[action, setAction] = useState("Login");

    function handleSignup(event) 
    {
        event.preventDefault();
        const userInput = emailRef.current.value;
        console.log(userInput);
        // alert("Sign up functionality");
    };

    function handleLogin()
    {
        event.preventDefault();
        const userInput = emailRef.current.value;
        if(userInput != ""){
            console.log(userInput);
            navigate("/board");
        }
        

        // alert("Login functionality");
    };

    function handleActionChange(newAction) 
    {
        if (newAction === "Login") {
            const event = new MouseEvent('click');
            handleLogin(event);
        } else {
            const event = new MouseEvent('click');
            handleSignup(event);
        }
        setAction(newAction);
    };

    return (
            <div className = 'container'>
                <div className = 'header'>
                <div className = 'text'>{action}</div>
                    <div className = 'underline'></div>
                    </div>
                    <div className='inputs'>
                        {/* {action==="Login"?<div></div>:<div className='input'>
                        <img src={user_icon} alt="" />
                        <input type="text" placeholder="Name"/>
                    </div>} */}

                    <div className='input'>
                        <img src={email_icon} alt="" />
                        <input type="email" placeholder="Email Id" ref={emailRef}/>
                    </div>
                    <div className='input'>
                        <img src={password_icon} alt="" />
                        <input type="password" placeholder="Password"/>
                    </div>
                    </div>
                    {action==="Sign Up"?<div></div>:<div className="forgot-password"><span>Forgot Password?</span></div>}
                    <div className="submit-container">
                        <div className={action === "Login" ? "submit gray" : "submit"} onClick={() => handleActionChange("Sign Up")}>Sign Up</div>
                        <div className={action === "Sign Up" ? "submit gray" : "submit"} onClick={() => handleActionChange("Login")}>Login</div>
                    </div>
                </div>
    )
}

export default LoginSignup;