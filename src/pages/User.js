import axios from "axios";
import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import { Oval } from 'react-loader-spinner';
import Post from "../components/Post";
import { login, defaultPath, followUser } from '../Functions'
import '../styles/User.css'
import headerPic from '../assets/login.jpg'
import userLogo from '../assets/user.svg'
import editPhoto from '../assets/editPhoto.svg'
import { useParams } from 'react-router-dom'
import PostForm from "../components/PostFrom";
import Fade from "../components/Fade";
import UsersList from "../components/UsersList";
import Scroller from "../components/Scroller";

function User() {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [posts, setPosts] = useState();
    const [showingPopup, setShowingPopup] = useState(false);
    const [showHover, setShowHover] = useState(false);
    const [showingAvatarForm, setShowingAvatarForm] = useState(false);
    const [trigger, setTrigger] = useState(false);
    const [userImg, setUserImg] = useState('');
    const [user, setUser] = useState();
    const [showFollowers, setShowFollowers] = useState(false);
    const [showFollowing, setShowFollowing] = useState(false);
    const [followed, setFollowed] = useState(false);
    const [followersCopy, setFollowersCopy] = useState();
    const params = useParams();
    const username = params.username;

    useEffect(() => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        };
        axios.get(defaultPath + `users/${username}`, config)
            .then((response) => {
                const res = response.data;
                console.log(res);
                setUserImg(res.userImg);
                setPosts(res.posts.reverse());
                setUser(res);
                setFollowed(checkFollow(res.followers));
                setFollowersCopy(res.followers.length);
            })
            .catch(async (error) => {
                if (error.response.status === 403) {
                    await login(localStorage.getItem('username'), localStorage.getItem('password'));
                    setToken(localStorage.getItem('token'));
                }
            });
    }, [token, username, trigger])

    function getAllDate(date) {
        const options = {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
        };
        return new Date(Date.UTC(date[0], date[1] - 1, date[2], date[3] - 3, date[4], date[5])).toLocaleString("en-GB", options);
    }

    function getCurReacts(reviews) {
        for (let review of reviews) {
            if (review.reviewPK.user.username === localStorage.getItem('username')) {
                return review;
            }
        }
        return null;
    }

    function showPopup() {
        document.body.style.overflow = 'hidden';
        setShowingPopup(true);
    }

    function showAvatarPopup() {
        if (username !== localStorage.getItem('username')) return;
        document.body.style.overflow = 'hidden';
        setShowingAvatarForm(true);
    }

    function checkFollow(followers) {
        for (let follower of followers) {
            if (follower.username === localStorage.getItem('username')) return true;
        }
        return false;
    }

    const follow = async () => {
        if (!followed) setFollowersCopy(followersCopy + 1);
        else setFollowersCopy(followersCopy - 1);
        setFollowed(!followed);
        followUser(username, followed, trigger).then(
            (res) => { setTrigger(!trigger); }
        );
    }


    return (
        <>
            <NavBar defaultType={"news"} />
            <div className="user-header">
                <div className="user-header-img-wrap">
                    {user ?
                        <img src={userImg ? defaultPath + 'images/' + userImg : headerPic} className="image-fit"></img>
                        : <div style={{
                            backgroundColor: 'var(--main-bg-color)',
                            filter: 'brightness(.9)'
                        }} className="image-fit"></div>}
                </div>
                <div className="user-profile">
                    {username !== localStorage.getItem('username') && user &&
                        <div className="follow-btn flex-center bordered" onClick={follow}>
                            {followed ? 'unfollow' : 'follow'}
                        </div>}
                    {user &&
                        <div className="user-profile-component bordered" onClick={() => { if (followersCopy > 0) setShowFollowers(true) }}>
                            <div>{followersCopy}</div>
                            <div>followers</div>
                        </div>
                    }
                    <div className="user-avatar-name-wrap flex-center">
                        <div className="avatar-wrap" onClick={showAvatarPopup}
                            onMouseEnter={() => { setShowHover(true) }}
                            onMouseLeave={() => { setShowHover(false) }}
                            style={username === localStorage.getItem('username') ? { cursor: 'pointer' } : null}>
                            {user ?
                                <img src={userImg ? defaultPath + 'images/' + userImg : userLogo} className="image-fit"></img>
                                : <div style={{
                                    backgroundColor: 'var(--main-bg-color)',
                                    filter: 'brightness(.9)'
                                }} className="image-fit"></div>}
                            {username === localStorage.getItem('username') &&
                                <Fade show={showHover} fadeStyle={'scale'}
                                    isAbsolute={true} style={{
                                        width: '100%',
                                        height: '100%',
                                        top: 0,
                                        zIndex: 1000,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: '50%',
                                        backdropFilter: 'brightness(.5) blur(2px)'
                                    }} speed={.3}>
                                    <img src={editPhoto}
                                        style={{
                                            width: '50%',
                                            height: '50%',
                                            filter: 'invert()'
                                        }}></img>
                                </Fade>}
                        </div>
                        <div className="user-header-username">
                            {username}
                        </div>
                    </div>
                    {user &&
                        <div className="user-profile-component bordered" onClick={() => { if (user.following.length > 0) setShowFollowing(true) }}>
                            <div>{user.following.length}</div>
                            <div>following</div>
                        </div>}
                </div>
                {username === localStorage.getItem('username') &&
                    <div className="add-post-wrap bordered" onClick={showPopup}>
                        + Add Post
                    </div>
                }
                <Fade show={showingAvatarForm}
                    style={{
                        width: '100%',
                        height: '100%',
                        position: 'fixed',
                        top: 0,
                        zIndex: 1000,
                    }} fadeStyle={'scale'} speed={.3}>
                    <PostForm type={'avatar'} onClose={() => { setShowingAvatarForm(false); document.body.style.overflow = 'visible'; }}></PostForm>
                </Fade>
                <Fade show={showingPopup}
                    style={{
                        width: '100%',
                        height: '100%',
                        position: 'fixed',
                        top: 0,
                        zIndex: 1000,
                    }} fadeStyle={'scale'} speed={.3}>
                    <PostForm type={'post'} onClose={() => { setShowingPopup(false); document.body.style.overflow = 'visible'; }}></PostForm>
                </Fade>
                {user &&
                    <Fade show={showFollowers} fadeStyle={'scale'} speed={.3}
                        style={{
                            width: '100%',
                            height: '100%',
                            position: 'fixed',
                            top: 0,
                            zIndex: 1000,
                        }}>
                        <UsersList header={'Followers'} onClose={() => { setShowFollowers(false) }} list={user.followers}></UsersList>
                    </Fade>}
                {user &&
                    <Fade show={showFollowing} fadeStyle={'scale'} speed={.3}
                        style={{
                            width: '100%',
                            height: '100%',
                            position: 'fixed',
                            top: 0,
                            zIndex: 1000,
                        }}>
                        <UsersList header={'Following'} onClose={() => { setShowFollowing(false) }} list={user.following}></UsersList>
                    </Fade>}
            </div >
            {
                posts ? (
                    posts.length !== 0 ? (<div className="post-section-wrap flex-center" style={{ marginBottom: '50px' }}>
                        {
                            posts.map((article) => (
                                <Post key={article.id} author={username}
                                    date={getAllDate(article.createdAt)} noDateFormat={true}
                                    likeCount={article.likes} commentCount={article.comments}
                                    content={article.description} withReacts={true} postId={article.id}
                                    curReacts={getCurReacts(article.reviews)} comments={article.reviews}
                                    reloadFunc={() => { setTrigger(!trigger) }} userImg={userImg}
                                    imgSrc={article.postImg}>
                                </Post>
                            ))
                        }
                    </div>
                    ) : <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "calc(100% - 580px)",
                        minHeight: '250px',
                        display: "flex",
                        marginTop: 580 + 'px',
                        justifyContent: "center",
                        alignItems: "start",
                        fontSize: '3rem',
                        zIndex: -1,
                    }}
                    >
                        No posts yet...
                    </div>
                )
                    : < div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "calc(100% - 200px)",
                        display: "flex",
                        marginTop: 200 + 'px',
                        justifyContent: "center",
                        alignItems: "center"
                    }
                    }
                    >
                        <Oval color="black" secondaryColor="#0000001a" height="150" width="150" ariaLabel="loading" />
                    </div >}
            <Scroller></Scroller>
        </>
    )
}

export default User;