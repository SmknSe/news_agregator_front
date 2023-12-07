import "../styles/LoginForm.css"
import userLogo from "../assets/user.svg"
import lock from "../assets/lock.svg"
import emailImg from '../assets/email.svg'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Fade from "./Fade"
import ReactInput from "./ReactInput"
import { login, register, getCurUser } from '../Functions'
import Notification from "./Notification"

function LoginForm() {

    const [isReg, setIsReg] = useState(false);
    const [showNotification, setShowNotification] = useState(false);
    const [notificationText, setNotificationText] = useState("");
    const [notificationType, setNotificationType] = useState(false);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const [componentTimeout, setComponentTimeout] = useState();

    const toggleIsReg = () => {
        setIsReg(!isReg);
    };

    const isFormValid = () => {
        if (isReg) {
            if (username.split(' ').length > 2) return 'Username should be less than 3 words';
            for (let word of username.split()){
                if (word.length > 20) return 'Username is too long';
            }
            if (!email.match(emailRegex)) return 'Enter correct email';
            if (password.trim().length < 10) return 'Password requires 10 symbols';
            if (password.trim() !== passwordConfirm.trim()) return 'Passwords are not equal';
            return (username.trim() !== '' && email.trim() !== ''
                && password.trim() !== '' && passwordConfirm.trim() !== '')
        }
        return (username.trim() !== '' && password.trim() !== '');
    };

    const navigate = useNavigate();

    async function loginFunc(e) {
        e.preventDefault();
        if (componentTimeout) {
            setShowNotification(false);
            clearTimeout(componentTimeout);
            setComponentTimeout(null);
        }
        let res = await login(username, password);
        if (res === true) {
            navigate('/');
        }
        else {
            setShowNotification(true);
            setNotificationText(res);
            setNotificationType('error');
            setComponentTimeout(setTimeout(function () {
                setShowNotification(false);
                setComponentTimeout(null);
            }.bind(this), 1500));
        }
    }

    async function regFunc(e) {
        e.preventDefault();
        let valid = isFormValid();
        if (valid === true) {
            if (componentTimeout) {
                setShowNotification(false);
                clearTimeout(componentTimeout);
                setComponentTimeout(null);
            }
            let res = await register(username, email, password);
            if (res === true) {
                navigate('/');
            }
            else {
                setShowNotification(true);
                setNotificationText(res);
                setNotificationType('error');
                setComponentTimeout(setTimeout(function () {
                    setShowNotification(false);
                    setComponentTimeout(null);
                }.bind(this), 1500));
            };
        }
        else {
            setShowNotification(true);
            setNotificationText(valid);
            setNotificationType('warning');
            setComponentTimeout(setTimeout(function () {
                setShowNotification(false);
                setComponentTimeout(null);
            }.bind(this), 1500));
        }
    }


    return (
        <div className="login-form-wrap flex-center">
            <Fade show={isReg} isAbsolute={true} speed={.8}>
                <form className="login-form flex-center" onSubmit={(e) => regFunc(e)}>
                    <h1>Sign up</h1>
                    <ReactInput imgSrc={userLogo} type="text" placeholder="username" value={username} onChange={setUsername}></ReactInput>
                    <ReactInput imgSrc={emailImg} type="email" placeholder="email" value={email} onChange={setEmail}></ReactInput>
                    <ReactInput imgSrc={lock} type="password" placeholder="password" value={password} onChange={setPassword}></ReactInput>
                    <ReactInput imgSrc={lock} type="password" placeholder="password confirm" value={passwordConfirm} onChange={setPasswordConfirm}></ReactInput>
                    <a href='#' onClick={toggleIsReg}>Already signed up?</a>
                    <button className='bordered' type='submit'>Sign up</button>
                </form >
            </Fade>
            <Fade show={!isReg} isAbsolute={true} speed={.8}>
                <form className="login-form flex-center" onSubmit={(e) => loginFunc(e)}>
                    <h1>Login</h1>
                    <ReactInput imgSrc={userLogo} type="text" placeholder="username" value={username} onChange={setUsername}></ReactInput>
                    <ReactInput imgSrc={lock} type="password" placeholder="password" value={password} onChange={setPassword}></ReactInput>
                    <a href='#' onClick={toggleIsReg}>Still dont have an account?</a>
                    <button className='bordered' type='submit'>Login</button>
                </form>
            </Fade>
            <Fade show={showNotification} fadeStyle={'scale'}
                style={{
                    right: 25,
                    bottom: 25,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                }} isAbsolute={true} speed={.3}>
                <Notification message={notificationText} type={notificationType}
                    onClose={() => {
                        if (componentTimeout) {
                            clearTimeout(componentTimeout);
                            setComponentTimeout(null);
                        }
                        setShowNotification(false);
                    }}></Notification>
            </Fade>
        </div>
    )
}

export default LoginForm;