import { Navigate } from 'react-router-dom';

const PrivateRoute = ({Component}) => {

    const isAuth = () => {
        const token = localStorage.getItem('token');
        return token;
    }

    const auth = isAuth();

    return auth ? <Component /> : <Navigate to="/login" />
}

export default PrivateRoute;