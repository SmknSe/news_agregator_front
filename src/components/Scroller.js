import { useEffect, useState } from 'react';
import arrowUp from '../assets/arrowUp.svg'
import '../styles/Scroller.css'

function Scroller(){
    const [visible, setVisible] = useState(false);

    useEffect(()=>{
        window.addEventListener('scroll',listenToScroll);
        return () =>
        window.removeEventListener("scroll", listenToScroll);
    },[])

    function listenToScroll(){
        let minHeight = 500;
        const scroll = document.body.scrollTop ||
        document.documentElement.scrollTop;
        if (scroll > minHeight && !visible) setVisible(true);
        else setVisible(false);
    }

    function ScrollTop(){
        window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
    }

    return(
        <div className={`scroller-container bordered ${visible ? 'visible' : ''}`} onClick={ScrollTop}>
            <img src={arrowUp} className="image-fit"></img>
        </div>
    );
}

export default Scroller;