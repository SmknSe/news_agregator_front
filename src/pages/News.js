import { useEffect, useState } from "react";
import { useLocation, useSearchParams } from 'react-router-dom'
import NavBar from "../components/NavBar";
import Post from "../components/Post";
import '../styles/News.css'
import axios from "axios";
import { Oval } from 'react-loader-spinner'
import { login } from '../Functions'
import PageNavigation from "../components/PageNavigation";
import Scroller from "../components/Scroller";

function News() {

    const [news, setNews] = useState();
    const [search, setSearch] = useState();
    const [lang, setLang] = useState();
    const [request, setRequest] = useSearchParams();
    const [page, setPage] = useState(1);

    useEffect(() => {
        setNews(null);
        let r = request.get('request') ? request.get('request') : search;
        let l = request.get('language') ? request.get('language') : 'en';
        let sb = request.get('sortBy') ? request.get('sortBy') : 'publishedAt';
        setLang(l);
        fetchNews(r,l,sb);
    }, [page])

    const fetchNews = (r, l, sb) => {
        setNews(null);
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        };
        let searchKey = r;
        let lang = l;
        let sort = sb;
        setSearch(searchKey);
        let body = {
            type: 'EVERYTHING',
            language: lang,
            sortBy: sort,
            keyphrase: searchKey,
            page: page,
        };
        if (!searchKey || searchKey === '') {
            delete body.keyphrase;
            body.type = 'TOP'
        }
        axios.post('http://localhost:8080/api/news', body, config)
            .then((response) => {
                const res = response.data;
                console.log(res);
                if (res.totalResults > 100) res.totalResults = 100;
                setNews(res);
            })
            .catch(async (error) => {
                if (error.response.status === 403) {
                    await login(localStorage.getItem('username'), localStorage.getItem('password'));
                    fetchNews(searchKey, lang, sort);
                }
            });
    }

    return (
        <>
            {lang &&<NavBar onSearch={fetchNews} defaultType={'news'} defaultLang={lang}/>}
            {news ? (
                news.totalResults !== 0 ? (
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
                        {news.totalResults > 20 && <PageNavigation curPage={page} navigate={setPage} totalRes={news.totalResults}></PageNavigation>}
                        <div className="post-section-wrap flex-center">
                            {
                                news.articles.map((article, index) => (
                                    <Post key={index} author={article.source.name} date={article.publishedAt}
                                        content={article.description} imgSrc={article.urlToImage} url={article.url}
                                    ></Post>
                                ))
                            }
                        </div>
                        {news.totalResults > 20 && <PageNavigation curPage={page} navigate={setPage} totalRes={news.totalResults}></PageNavigation>}
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
                    No posts available...
                </div>
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

export default News;