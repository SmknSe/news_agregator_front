import { useEffect, useState } from "react";
import { useLocation, useSearchParams } from 'react-router-dom'
import NavBar from "../components/NavBar";
import Post from "../components/Post";
import '../styles/News.css'
import axios from "axios";
import { Oval } from 'react-loader-spinner'
import { login, followUser } from '../Functions'
import PageNavigation from "../components/PageNavigation";
import UserBlock from "../components/UserBlock";
import followLogo from '../assets/follow.svg'
import Scroller from "../components/Scroller";
function UserNews() {

    const [news, setNews] = useState();
    const [users, setUsers] = useState();
    const [where, setWhere] = useState();
    const [request, setRequest] = useSearchParams();
    const [trigger, setTrigger] = useState(false);
    const [page, setPage] = useState(1);

    useEffect(() => {
        const s = request.get('search') ? request.get('search') : '';
        const w = request.get('where') ? request.get('where') : 'content';
        setWhere(w);
        fetchData(s, w, true);
    }, [])

    useEffect(() => {
        const s = request.get('search') ? request.get('search') : '';
        const w = request.get('where') ? request.get('where') : 'content';
        setWhere(w);
        fetchData(s, w, false);
    }, [trigger])

    const fetchData = (s, w, reset) => {
        if (w === 'content')
            fetchNews(s, w, reset);
        else fetchUsers(s, w);
    }

    const fetchNews = (s, w, reset) => {
        if (reset) setNews(null);
        setUsers(null);
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        };
        const formData = new FormData();
        formData.append("search", s);
        axios.post(`http://localhost:8080/api/posts/filter`, formData, config)
            .then((response) => {
                const res = response.data;
                console.log(res);
                setNews(res);
            })
            .catch(async (error) => {
                if (error.response.status === 403) {
                    await login(localStorage.getItem('username'), localStorage.getItem('password'));
                    fetchNews(s, w);
                }
            });
    }

    const fetchUsers = (s, w) => {
        setNews(null);
        setUsers(null);
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        };
        const formData = new FormData();
        formData.append("search", s);
        axios.post(`http://localhost:8080/api/users/filter`, formData, config)
            .then((response) => {
                const res = response.data;
                console.log(res);
                setUsers(res);
            })
            .catch(async (error) => {
                if (error.response.status === 403) {
                    await login(localStorage.getItem('username'), localStorage.getItem('password'));
                    fetchUsers(s, w);
                }
            });
    }

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

    function checkFollow(followers) {
        for (let user of followers) {
            if (user.username === localStorage.getItem('username')) return true;
        }
        return false;
    }


    return (
        <>
            {where && <NavBar onSearch={fetchData} defaultType={'users'} defaultWhere={where} />}
            {news || users ? (
                news ? (
                    news.length !== 0 ? (
                        <div style={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '20px',
                            marginTop: '150px',
                            marginBottom: '50px'
                        }}>
                            {news.length > 20 && <PageNavigation curPage={page} navigate={setPage} totalRes={news.length}></PageNavigation>}
                            <div className="post-section-wrap flex-center">
                                {
                                    news.map((article) => (
                                        <Post key={article.id} author={article.user.username}
                                            date={getAllDate(article.createdAt)} noDateFormat={true}
                                            likeCount={article.likes} commentCount={article.comments}
                                            content={article.description} withReacts={true} postId={article.id}
                                            curReacts={getCurReacts(article.reviews)} comments={article.reviews}
                                            reloadFunc={() => { setTrigger(!trigger) }} userImg={article.user.userImg}
                                            imgSrc={article.postImg}>
                                        </Post>
                                    ))
                                }
                            </div>
                            {news.length > 20 && <PageNavigation curPage={page} navigate={setPage} totalRes={news.length}></PageNavigation>}
                        </div>
                    ) : <div style={{
                        width: "100vw",
                        height: "100vh",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontSize: '3rem'
                    }}
                    >
                        No post available...
                    </div>
                ) : (
                    users.length !== 0 ? (
                        <div style={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginTop: '150px',
                            marginBottom: '50px',
                            padding: '0 10%'
                        }}>
                            {users.length > 20 && <PageNavigation curPage={page} navigate={setPage} totalRes={users.length}></PageNavigation>}
                            <div className="post-section-wrap flex-center" style={{ gap: "15px" }}>
                                {
                                    users.map((user, index) => (
                                        user.username !== localStorage.getItem('username') ? <div style={{
                                            width: "100%",
                                            maxWidth: "650px",
                                            position: "relative"
                                        }} key={index}>
                                            <UserBlock username={user.username} userImg={user.userImg}></UserBlock>
                                            {!checkFollow(user.followers) ?
                                                <div className="user-list-follow" onClick={(e) => {
                                                    followUser(user.username, false);
                                                    e.target.closest('div').style.display = 'none';
                                                }}>
                                                    <img src={followLogo} className="image-fit"></img>
                                                </div> : null}
                                        </div> : null
                                    ))
                                }
                            </div>
                            {users.length > 20 && <PageNavigation curPage={page} navigate={setPage} totalRes={users.length}></PageNavigation>}
                        </div>
                    ) : <div style={{
                        width: "100vw",
                        height: "100vh",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontSize: '3rem'
                    }}
                    >
                        No Users found...
                    </div>
                ))
                : <div style={{
                    width: "100vw",
                    height: "100vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}
                >
                    <Oval color="black" secondaryColor="#0000001a" height="150" width="150" ariaLabel="loading" />
                </div >}
                <Scroller></Scroller>
        </>
    )
}

export default UserNews;