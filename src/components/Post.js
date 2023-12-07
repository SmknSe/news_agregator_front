import '../styles/Post.css'
import userLogo from '../assets/user.svg'
import commentLogo from '../assets/comment.svg'
import commentTypeLogo from '../assets/comment-type.svg'
import paperPlane from '../assets/paperPlane.svg'
import likeLogo from '../assets/like.svg'
import deleteImg from '../assets/delete.svg'
import confirmImg from '../assets/confirm.svg'
import closeImg from '../assets/cancel.svg'
import { useState } from 'react'
import ReactInput from './ReactInput'
import Fade from './Fade'
import noPhoto from '../assets/noPhoto.png'
import axios from "axios";
import { login, defaultPath } from '../Functions'
import { useLocation, useNavigate } from 'react-router-dom'

function Post({ withReacts, author, date,
    content, imgSrc, url, noDateFormat,
    likeCount, commentCount, postId, curReacts, comments, reloadFunc, userImg }) {

    const [isLike, setIsLike] = useState(curReacts ? (curReacts.isLiked ? curReacts.isLiked : false) : false);
    const [likeCountClone, setLikeCountClone] = useState(likeCount);
    const [commentCountClone, setCommentCountClone] = useState(commentCount);
    const [commentText, setCommentText] = useState('');
    const [commentTextBack, setCommentTextBack] = useState(curReacts ? (curReacts.comment ? curReacts.comment : null) : null);
    const [isCommenting, setIsCommenting] = useState(false);
    const [confirmDeleting, setConfirmDeleting] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();



    const onAnimationEnd = () => {
        setIsCommenting(true);
    };

    const replaceImg = (error) => {
        error.target.src = noPhoto;
        error.target.style.scale = '.7';
        error.target.onerror = null;
    }

    function formatDate() {
        if (noDateFormat) return date;
        return date.substring(0, 10) + ' : ' + date.substring(11, 16);
    }

    function growUp() {
        let elWrap = document.getElementById('post-wrap-' + postId);
        let wrect = elWrap.getBoundingClientRect();
        let prevHeight = wrect.height;
        elWrap.style.height = prevHeight + 'px';
        let btn = document.getElementById('btn-comm');
        btn.style.pointerEvents = 'none';
        setTimeout(() => {
            btn.style.pointerEvents = 'all';
        }, 800);
        setTimeout(() => {
            onAnimationEnd();
        }, 500)
        requestAnimationFrame(() => {
            elWrap.style.transitionDelay = '0s';
            elWrap.style.height = prevHeight + 70 + commentCount * 120 + 'px';
        })
    }

    function growDown() {
        let elWrap = document.getElementById('post-wrap-' + postId);
        let wrect = elWrap.getBoundingClientRect();
        let prevHeight = wrect.height;
        setIsCommenting(false);
        let btn = document.getElementById('btn-comm');
        btn.style.pointerEvents = 'none';
        setTimeout(() => {
            btn.style.pointerEvents = 'all';
        }, 1500);
        requestAnimationFrame(() => {
            elWrap.style.transitionDelay = '.7s';
            elWrap.style.height = prevHeight - 70 - commentCount * 120 + 'px';
        })
    }

    const makeComment = async () => {
        if (commentText === '') {
            return;
        }
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        };
        let body = {
            comment: commentText,
        };
        setCommentTextBack(commentText);
        setCommentText('');
        const incr = commentTextBack ? 0 : 1;
        setCommentCountClone(commentCountClone + incr);
        growDown();
        setTimeout(reloadFunc, 1500);
        axios.post(`http://localhost:8080/api/posts/${postId}/review/comment`, body, config)
            .then((response) => {
                return response;
            })
            .catch(async (error) => {
                if (!error.response) console.log(error);
                else if (error.response.status === 403) {
                    await login(localStorage.getItem('username'), localStorage.getItem('password'));
                }
            });
    }

    const deleteComment = async () => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        };
        growDown();
        setTimeout(reloadFunc, 1500);
        axios.delete(`http://localhost:8080/api/posts/${postId}/review/comment`, config)
            .then((response) => {
                setCommentCountClone(commentCountClone - 1)
                return response;
            })
            .catch(async (error) => {
                if (!error.response) console.log(error);
                else if (error.response.status === 403) {
                    await login(localStorage.getItem('username'), localStorage.getItem('password'));
                }
            });
    }

    const deletePost = async () => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        };
        axios.delete(`http://localhost:8080/api/posts/${postId}`, config)
            .then((response) => {
                reloadFunc();
                return response;
            })
            .catch(async (error) => {
                if (!error.response) console.log(error);
                else if (error.response.status === 403) {
                    await login(localStorage.getItem('username'), localStorage.getItem('password'));
                }
            });
    }

    const makeLike = async () => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        };
        const incr = !isLike ? 1 : -1;
        setIsLike(!isLike);
        setLikeCountClone(likeCountClone + incr);
        axios.get(`http://localhost:8080/api/posts/${postId}/review/like`, config)
            .then((response) => {
                return response;
            })
            .catch(async (error) => {
                console.log(error);
                if (!error.response) console.log(error);
                else if (error.response.status === 403) {
                    await login(localStorage.getItem('username'), localStorage.getItem('password'));
                }
            });
    }

    function navigateToUser(username) {
        if (location.pathname !== '/news') navigate(`/user/${username}`)
    }

    function toggleDelete() {
        setConfirmDeleting(!confirmDeleting);
    }

    return (
        <div id={'post-wrap-' + postId} className={"post-wrap bordered"}>
            <div className="post-header">
                <div className='post-author-img-wrap'
                    style={location.pathname !== '/news' ? { cursor: 'pointer' } : {}}
                    onClick={() => { navigateToUser(author) }}>
                    <img src={userImg ? defaultPath+'images/'+userImg : userLogo} className='image-fit'></img>
                </div>
                <div className="post-author-descr">
                    <div className='post-author-name'>
                        {author}
                    </div>
                    <div className="post-date">
                        {formatDate()}
                    </div>
                </div>
            </div>
            <div className="post-content">
                {!withReacts && <a href={url} className="post-url">
                    {url}
                </a>}
                <div className="post-text">
                    {content}
                </div>
                {imgSrc && 
                <div className="post-img-wrap bordered flex-center" 
                style={ withReacts ? { backgroundImage: 'url('+defaultPath+'images/'+imgSrc+')' } : {backgroundImage: 'url(' + imgSrc + ')'}}>
                    <img src={withReacts ? defaultPath + 'images/' + imgSrc : imgSrc} onError={replaceImg} alt='news-image'></img>
                </div>}
            </div>
            {withReacts &&
                <>
                    <div className="post-reacts">
                        <div className={'post-react bordered ' + (isLike ? 'like-active' : '')} onClick={makeLike}>
                            <div className='react-img-wrap'>
                                <img src={likeLogo} className='image-fit'></img>
                            </div>
                            <div className='count'>
                                {likeCountClone}
                            </div>
                        </div>
                        <div id='btn-comm' className="post-react bordered" onClick={isCommenting ? growDown : growUp}>
                            <div className='react-img-wrap'>
                                <img src={commentLogo} className='image-fit'></img>
                            </div>
                            <div className='count'>
                                {commentCountClone}
                            </div>
                        </div>
                    </div>
                    <Fade show={isCommenting} isAbsolute={true}
                        style={{
                            bottom: 20 + 'px',
                            left: '20px',
                            right: '20px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px'
                        }}
                        speed={.8}>
                        <div className='post-comment-input-wrap'>
                            <ReactInput imgSrc={commentTypeLogo} placeholder='type here...'
                                value={commentText} onChange={setCommentText} style={{ width: 100 + '%' }}></ReactInput>
                            <div className='send-btn react-img-wrap' onClick={makeComment}>
                                <img src={paperPlane} className='image-fit'></img>
                            </div>
                        </div>
                        <div className='comments-section-wrap'>
                            {
                                comments.map((comment, index) => (
                                    comment.comment &&
                                    <div key={index} className='comment-wrap bordered'>
                                        <div className='comment-author-wrap'>
                                            <div className='comment-author-img-wrap bordered' onClick={() => { navigateToUser(comment.reviewPK.user.username) }}>
                                                <img src={comment.reviewPK.user.userImg ? defaultPath+'images/'+comment.reviewPK.user.userImg : userLogo} className='image-fit'></img>
                                            </div>
                                            <div className='comment-author-name'>
                                                {comment.reviewPK.user.username}
                                            </div>
                                            {comment.reviewPK.user.username === localStorage.getItem('username') ? (
                                                <div className='delete-comment-btn' onClick={deleteComment}>
                                                    <img src={deleteImg} className='image-fit'></img>
                                                </div>
                                            ) : null}
                                        </div>
                                        <div className='comment-text'>
                                            {comment.comment.substring(0,53)+'...'}
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </Fade>
                </>}
            {author === localStorage.getItem('username') ? (
                <>
                    <Fade show={!confirmDeleting} isAbsolute={true} style={{
                        top: '40px',
                        right: '30px'
                    }} fadeStyle={'down'} speed={.8}>
                        <div className='delete-post-btn' onClick={toggleDelete}>
                            <img src={deleteImg} className='image-fit'></img>
                        </div>
                    </Fade>
                    <Fade show={confirmDeleting} isAbsolute={true} style={{
                        top: '40px',
                        right: '20px'
                    }} fadeStyle={'down'}>
                        <div className='delete-post-confirm-container'>
                            <div className='delete-post-btn-confirm'>
                                <img src={confirmImg} className='image-fit' onClick={deletePost}></img>
                            </div>
                            <div className='delete-post-btn-confirm' onClick={toggleDelete}>
                                <img src={closeImg} className='image-fit'></img>
                            </div>
                        </div>
                    </Fade>
                </>
            ) : null}
        </div>
    )
}

export default Post;