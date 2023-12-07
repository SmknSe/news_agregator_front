import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import Post from "../components/Post";
import '../styles/News.css'
import axios from "axios";
import { Oval } from 'react-loader-spinner'
import { login } from '../Functions'
import PageNavigation from "../components/PageNavigation";
import Home from "../components/Home";
import Scroller from "../components/Scroller";

function NewsFollowing() {

    const [news, setNews] = useState();
    const [trigger, setTrigger] = useState(false);
    const [page, setPage] = useState(1);

    useEffect(() => {
        fetchNews();
    }, [trigger])

    const fetchNews = () => {
        const config = {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        };
        axios.get(`http://localhost:8080/api/posts/getFollowingNews`, config)
            .then((response) => {
                const res = response.data;
                setNews(res);
            })
            .catch(async (error) => {
                if (error.response.status === 403) {
                    await login(localStorage.getItem('username'), localStorage.getItem('password'));
                    fetchNews();
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


    return (
        <>
            <NavBar defaultType={'users'} />
            {news ? (
                news.length !== 0 ? (
                    <>
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
                        <Scroller></Scroller>
                    </>
                ) :
                    <Home></Home>
            )
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

export default NewsFollowing;