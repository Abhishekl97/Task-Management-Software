import React, { useState } from "react";
import "./ForgotPassword.css";
import { useNavigate } from "react-router-dom"; 
import { useRef } from "react";
import email_icon from "./Assets/email.png";
import password_icon from "./Assets/password.png";

const ForgotPassword = () => {
    const emailRef  = useRef(null);
    const passwordRef = useRef(null);
    const navigate = useNavigate(); 
    const[action, setAction] = useState("Forgot Password?");

    function handleForgotPassword(event)
    {
        event.preventDefault();
        const userInput = emailRef.current.value;
        const userInput2 = passwordRef.current.value;
        if((userInput != "" )&& (userInput2 != "")){
            console.log(`email id : ${userInput}`)
            fetch('http://localhost:3300/api/v1/tm/users', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email_id: userInput, password: userInput2 }),
                })
                .then(response => response.json())
                .then(data => {
                    console.log('checking data after response',data);
                    if (data.error) {
                        console.log(data.error);
                        alert(data.error);
                    }
                    else {
                        console.log(data.message);
                        alert(data.message);
                    }
                })
                .catch(error => {
                    console.error(error);
                    alert('Error updating password. Please try again.');
                });
        }
    };

    function handleActionChange(newAction) 
    {
        console.log(newAction)
        if (newAction === "Log in") {
            console.log(action)
            const event = new MouseEvent('click');
            // if (action === "Forgot Password?"){
                //clearing fields when navigating from Forgot Password to login page
            emailRef.current.value = "";
            passwordRef.current.value = "";
            // }
            navigate("/");
            // handleLogin(event);
        } else if (newAction === "Forgot Password?") {
            console.log(action)
            const event = new MouseEvent('click');
            handleForgotPassword(event);
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
                <div className='input'>
                    <img src={email_icon} alt="" />
                    <input type="email" placeholder="Email Id" ref={emailRef}/>
                </div>
                <div className='input'>
                    <img src={password_icon} alt="" />
                    <input type="password" placeholder="Password" ref = {passwordRef}/>
                </div>
            </div>
            <div className="submit-container">
                <div className={action === "Log in" ? "submit gray" : "submit"} onClick={() => handleActionChange("Forgot Password?")}>
                    Reset Password
                </div>
                <div className={action === "Forgot Password?" ? "submit gray" : "submit"} onClick={() => handleActionChange("Log in")}>
                    Log in
                </div>
            </div>

        </div>
    )
}

export default ForgotPassword;