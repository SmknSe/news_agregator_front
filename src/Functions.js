import axios from "axios";

export const defaultPath = 'http://localhost:8080/api/';

export const login = async (username, password) => {
    try {
        const response = await axios.post(defaultPath+'auth/login', {
            username,
            password
        });
        const token = response.data.token;
        localStorage.setItem('token', token);
        localStorage.setItem('username', username);
        localStorage.setItem('password', password);
        localStorage.setItem('userId', response.data.id);
        await getCurUser();
        return true;
    } catch (error) {
        return error.response.data;
    }
};

export const getCurUser = async () => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    };
    await axios.get(defaultPath + `users/${localStorage.getItem('username')}`, config)
        .then((response) => {
            const res = response.data.userImg;
            localStorage.setItem('userImg',res);
            return res;
        });
}

export const register = async (username, email, password) => {
    try {
        const response = await axios.post(defaultPath+'auth/register', {
            username,
            email,
            password
        });
        const token = response.data.token;
        localStorage.setItem('token', token);
        localStorage.setItem('username', username);
        localStorage.setItem('password', password);
        localStorage.setItem('userId', response.data.id);
        getCurUser();
        return true;
    } catch (error) {
        return error.response.data;
    }
};

export const followUser = async (username, followed) => {
    const config = {
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    };
    const formData = new FormData();
    formData.append("username", username);
    await axios.post(`http://localhost:8080/api/users/${followed ? 'unfollow' : 'follow'}`, formData, config)
        .then((response) => {
            return response;
        })
        .catch(async (error) => {
            if (error.response.status === 403) {
                await login(localStorage.getItem('username'), localStorage.getItem('password'));
                followUser(username,followed);
            }
        });
}