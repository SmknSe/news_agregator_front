import axios from 'axios';
import '../styles/PostForm.css'
import { useState } from 'react';
import { login } from '../Functions.js'
import closeLogo from '../assets/close.svg'

function PostForm({ onClose, type }) {

    const [content, setContent] = useState('');
    const [file, setFile] = useState('');


    const addPost = (e) => {
        if (content === '' && file === '') return;
        if (file.type.split('/')[0]!=='image' || file.size > 1048576) return;
        e.preventDefault();
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        };
        const formData = new FormData();
        formData.append("file", file);
        formData.append("content", content);
        axios.post('http://localhost:8080/api/posts/add', formData, config)
            .then((response) => {
                const res = response.data;
                console.log(res);
                window.location.reload();
            })
            .catch(async (error) => {
                if (error.response.status === 403) {
                    await login(localStorage.getItem('username'), localStorage.getItem('password'));
                    addPost(e);
                }
            });
    }

    const addAvatar = (e) => {
        if (file === '' || file.type.split('/')[0]!=='image' || file.size > 1048576)
            return;
        e.preventDefault();
        const config = {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                "Content-Type": "multipart/form-data",
            }
        };
        const formData = new FormData();
        formData.append("image", file);
        axios.post('http://localhost:8080/api/users/addImg', formData, config)
            .then((response) => {
                const res = response.data;
                console.log(res);
                localStorage.setItem('userImg', res);
                window.location.reload();
            })
            .catch(async (error) => {
                if (error.response.status === 403) {
                    await login(localStorage.getItem('username'), localStorage.getItem('password'));
                    addPost(e);
                }
            });
    }

    return (
        <>
            <div className='post-form-wrap flex-center'>
                <form className="post-form-container bordered">
                    <div className='post-form-header'>{type === 'post' ? 'Add Post' : 'Add Photo'}</div>
                    <div className="post-form-input-wrap">
                        <div>
                            Enter image:
                        </div>
                        <label for="files" className='input-file bordered'>{!file ? 'Browse files' : file.name}</label>
                        <input id='files' type='file' accept="image/*"
                            style={{ display: 'none' }} onChange={(e) => { setFile(e.target.files[0]) }}></input>
                        {type === 'post' ?
                            <>
                                <div>
                                    Enter content:
                                </div>
                                <textarea
                                    placeholder='Enter content here...'
                                    value={content} onChange={(e) => { setContent(e.target.value) }}></textarea>
                            </>
                            : null}
                    </div>
                    <button type="submit" className='post-form-btn bordered'
                        onClick={(e) => { type === 'post' ? addPost(e) : addAvatar(e) }}>{type === 'post' ? 'Add Post' : 'Add Photo'}</button>
                    <div className='post-form-close-btn' onClick={onClose}>
                        <img src={closeLogo}></img>
                    </div>
                </form>
            </div>
        </>
    );
}

export default PostForm;