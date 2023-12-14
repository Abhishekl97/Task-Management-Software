import React, { useState } from "react";
import "./LoginSignUp.css";
import { useNavigate } from "react-router-dom"; 
import { useRef } from "react";
import email_icon from "./Assets/email.png";
import password_icon from "./Assets/password.png";

const LoginSignup = () => {
    const emailRef  = useRef(null);
    const passwordRef = useRef(null);
    const navigate = useNavigate(); 
    const[action, setAction] = useState("Log in");


    function handleSignup(event) 
    {
        event.preventDefault();
        const userInput = emailRef.current.value;
        const userInput2 = passwordRef.current.value;
        if((userInput != "" )&& (userInput2 != "")){
            console.log(`email id : ${userInput}`)
            fetch('http://localhost:3300/api/v1/tm/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email_id: userInput, password: userInput2 }),
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    console.log(data.error);
                    alert(data.error);
                }
                else {
                    emailRef.current.value = "";
                    passwordRef.current.value = "";
                    console.log(data.message);
                    alert(data.message);
                }
            })
            .catch(error => {
                console.error(error);
                alert('Error registering user. Please try again.');
            });
        }
    };

    function handleLogin(event)
    {
        event.preventDefault();
        const userInput = emailRef.current.value;
        const userInput2 = passwordRef.current.value;
        if((userInput != "" )&& (userInput2 != "")){
            console.log(`email id : ${userInput}`)
            fetch('http://localhost:3300/api/v1/tm/users/email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email_id: userInput, password: userInput2 }),
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    console.log(data.error);
                    alert(data.error);
                }
                else {
                    console.log(data.message);
                    // alert(data.message);
                    navigate("/board");
                }
            })
            .catch(error => {
                console.error(error);
                alert('Error Logging in. Please try again.');
            });
        }
    };

    function handleActionChange(newAction) 
    {
        if (newAction === "Log in") {
            const event = new MouseEvent('click');
            if (action === "Sign Up"){
                //clearing fields when navigating from signup to login page
                emailRef.current.value = "";
                passwordRef.current.value = "";
            }
            handleLogin(event);
        } else if (newAction === "Sign Up") {
            const event = new MouseEvent('click');
            if (action === "Log in"){
                //clearing fields when navigating from login to signup page
                emailRef.current.value = "";
                passwordRef.current.value = "";
            }
            handleSignup(event);
        } else if (newAction === "Forgot Password") {
            const event = new MouseEvent('click');
            emailRef.current.value = "";
            passwordRef.current.value = "";
            navigate("/password");
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
            {action==="Log in"? (
                <div className="forgot-password" onClick={() => handleActionChange('Forgot Password')}>
                <span>Forgot Password?</span></div>
                ):(
                <div></div>)}
            <div className="submit-container">
                <div className={action === "Log in" ? "submit gray" : "submit"} onClick={() => handleActionChange("Sign Up")}>
                    Sign Up
                </div>
                <div className={action === "Sign Up" ? "submit gray" : "submit"} onClick={() => handleActionChange("Log in")}>
                    Log in
                </div>
            </div>

        </div>
    )
}

export default LoginSignup;