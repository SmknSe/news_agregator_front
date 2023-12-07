import NavBar from "./NavBar";
import ReactInput from "./ReactInput";
import '../styles/Home.css'
import searchLogo from '../assets/search.svg'
import {useState} from 'react'
import { createSearchParams, useLocation, useNavigate } from 'react-router-dom'


function Home() {

    let [search, setSearch] = useState("");

    const navigate = useNavigate();
    const location = useLocation();

    function makeSearch(event){
        if (event.key === 'Enter'){
           navigate({pathname: '/news', search: `?${createSearchParams([['request',search]])}`});
        }
    }

    return (
        <>
            <div className="home-wrap flex-center">
                <h1>What's new?</h1>
                <ReactInput style={{
                    width: '70%'
                }} 
                imgSrc={searchLogo} placeholder='search'
                value={search} onChange={setSearch} onKeyDown={makeSearch}></ReactInput>
            </div>
        </>
    )
}

export default Home;