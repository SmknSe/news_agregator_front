import { useEffect, useState } from 'react'
import searchLogo from '../assets/search.svg'
import userLogo from '../assets/user.svg'
import more from '../assets/more.svg'
import logoutLogo from '../assets/logout.svg'
import "../styles/NavBar.css"
import ReactInput from './ReactInput.js'
import '../styles/NavBar.css'
import '../styles/Burger.css'
import { useNavigate, useLocation, createSearchParams, Link } from 'react-router-dom'
import Fade from './Fade'
import { defaultPath } from '../Functions.js'

function NavBar({ onSearch, defaultType, defaultWhere, defaultLang }) {

    let [search, setSearch] = useState("");
    let [language, setLanguage] = useState(defaultLang ? defaultLang : "en");
    let [where, setWhere] = useState(defaultWhere ? defaultWhere : "content");
    let [type, setType] = useState(defaultType);
    let [sortBy, setSortBy] = useState("publishedAt");
    let [advanced, setAdvanced] = useState(false);
    let [isOpenBurger, setIsOpenBurger] = useState(false);
    let [showFilters, setShowFilters] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    function navigateToUser() {
        navigate(`/user/${localStorage.getItem('username')}`)
    }

    function logout() {
        navigate('/login');
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('password');
        localStorage.removeItem('following');
        localStorage.removeItem('userImg');
    }

    function makeSearch(event) {
        if (event.key === 'Enter') {
            if (type === 'news') {
                if (location.pathname !== '/news') navigate(
                    { pathname: '/news', search: `?${createSearchParams([['request', search], ['language', language], ['sortBy', sortBy]])}` });
                else {
                    if (advanced) toggle();
                    if (isOpenBurger) toggleMenu();
                    onSearch(search, language, sortBy);
                }
            }
            else {
                if (location.pathname !== '/usersNews') navigate(
                    { pathname: '/usersNews', search: `?${createSearchParams([['search', search], ['where', where]])}` });
                else {
                    if (advanced) toggle();
                    if (isOpenBurger) toggleMenu();
                    navigate(
                        { pathname: '/usersNews', search: `?${createSearchParams([['search', search], ['where', where]])}` });
                    onSearch(search, where, true);
                }
            }
        }
    }

    function toggle() {
        let elWrap = document.getElementById('nav-wrap');
        let wrect = elWrap.getBoundingClientRect();
        let prevHeight = wrect.height;
        elWrap.style.height = prevHeight + 'px';
        let btn = document.getElementById('more-btn');
        btn.style.pointerEvents = 'none';
        setTimeout(() => {
            btn.style.pointerEvents = 'all';
        }, 500);
        if (!advanced) {
            requestAnimationFrame(() => {
                elWrap.style.height = prevHeight + 120 + 'px';
            })
        }
        else {
            requestAnimationFrame(() => {
                elWrap.style.height = prevHeight - 120 + 'px';
            })
        }
        setAdvanced(!advanced);
        setShowFilters(!showFilters);
    }

    function toggleMenu() {
        setIsOpenBurger(!isOpenBurger);
        const menu = document.getElementsByClassName('bm-menu-wrap');
        menu[0].classList.toggle('active');
    }

    return (
        <div id='nav-wrap' className="navbar-wrap bordered" >
            <div className="bm-burger-button" onClick={toggleMenu}>
                <span className='bm-burger-bar'></span>
            </div>
            <div className="bm-menu-wrap">
                <nav className="bm-item-list" >
                    <div className='nav-search-input-wrap'>
                        <ReactInput imgSrc={searchLogo} type="text" placeholder="search"
                            value={search} onChange={setSearch}
                            onKeyDown={makeSearch}></ReactInput>
                    </div>
                    <form className='filters-wrap'>
                        <div className="select-wrap">
                            <div className='select-label'>
                                select type :
                            </div>
                            <select defaultValue={type} className='bordered' onChange={(e) => { setType(e.target.value); }}>
                                <option>news</option>
                                <option>users</option>
                            </select>
                        </div>
                        {type === 'news' ? (
                            <div className="select-wrap">
                                <div className='select-label'>
                                    select language :
                                </div>
                                <select defaultValue={language} className='bordered' onChange={(e) => { setLanguage(e.target.value); }}>
                                    <option>en</option>
                                    <option>ru</option>
                                </select>
                            </div>
                        ) : (
                            <div className="select-wrap">
                                <div className='select-label'>
                                    account / content :
                                </div>
                                <select defaultValue={where} className='bordered' onChange={(e) => { setWhere(e.target.value); }}>
                                    <option>content</option>
                                    <option>account</option>
                                </select>
                            </div>
                        )}
                        <div className="select-wrap">
                            <div className='select-label'>
                                select order :
                            </div>
                            <select className='bordered' onChange={(e) => { setSortBy(e.target.value) }}>
                                <option>publishedAt</option>
                                {type === 'news' ? (
                                    <>
                                        <option>relevancy</option>
                                        <option>popularity</option>
                                    </>
                                ) : null}
                            </select>
                        </div>
                    </form>
                </nav>
                <div>
                    <div className="bm-cross-wrap flex-center" onClick={toggleMenu}>
                        <div className='bm-cross-button'></div>
                    </div>
                </div>
            </div>
            <a className='navbar-img-wrap bordered' style={localStorage.getItem('userImg') !== 'null' ? { padding: 0 } : null} href="#" onClick={navigateToUser}>
                <img src={localStorage.getItem('userImg') !== 'null' ? defaultPath + 'images/' + localStorage.getItem('userImg') : userLogo} className='image-fit'></img>
            </a>
            <div className='search-input-wrap'>
                <div className='nav-search-input-wrap'>
                    <ReactInput imgSrc={searchLogo} type="text" placeholder="search"
                        value={search} onChange={setSearch}
                        onKeyDown={makeSearch}></ReactInput>
                    <a id='more-btn' className='navbar-img-wrap-btn' style={{ width: '50px' }} href="#" onClick={toggle}>
                        <img src={more}></img>
                    </a>
                </div>
                <Fade show={showFilters} isAbsolute={false} speed={.5}
                    style={{ bottom: 30 + 'px' }} fadeStyle='down'>
                    <form className='filters-wrap'>
                        <div className="select-wrap">
                            <div className='select-label'>
                                select type :
                            </div>
                            <select defaultValue={type} className='bordered' onChange={(e) => { setType(e.target.value); }}>
                                <option>news</option>
                                <option>users</option>
                            </select>
                        </div>
                        {type === 'news' ? (
                            <div className="select-wrap">
                                <div className='select-label'>
                                    select language :
                                </div>
                                <select defaultValue={language} className='bordered' onChange={(e) => { setLanguage(e.target.value); }}>
                                    <option>en</option>
                                    <option>ru</option>
                                </select>
                            </div>
                        ) : (
                            <div className="select-wrap">
                                <div className='select-label'>
                                    account / content :
                                </div>
                                <select defaultValue={where} className='bordered' onChange={(e) => { setWhere(e.target.value); }}>
                                    <option>content</option>
                                    <option>account</option>
                                </select>
                            </div>
                        )}
                        <div className="select-wrap">
                            <div className='select-label'>
                                select order :
                            </div>
                            <select className='bordered' onChange={(e) => { setSortBy(e.target.value) }}>
                                <option>publishedAt</option>
                                {type === 'news' ? (
                                    <>
                                        <option>relevancy</option>
                                        <option>popularity</option>
                                    </>
                                ) : null}
                            </select>
                        </div>
                    </form>
                </Fade>
            </div>
            <a className='navbar-img-wrap bordered' href="#" onClick={logout}>
                <img src={logoutLogo}></img>
            </a>
        </div>
    )
}

export default NavBar;