import LoginForm from "../components/LoginForm";
import "../styles/Login.css"
import login from "../assets/login.jpg"
import Notification from "../components/Notification";
function Login() {

    return (
        <>
            <div className="login-page-wrap">
                <LoginForm></LoginForm>
                <div className="img-wrap">
                    <img src={login} alt="image"></img>
                </div>
            </div>
        </>
    )

}

export default Login;