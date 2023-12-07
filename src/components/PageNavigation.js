import { useState } from "react";
import '../styles/PageNavigation.css'


function PageNavigation({ curPage, totalRes, navigate }) {
    const [lastPage, setLastPage] = useState(Math.ceil(totalRes / 20))

    return (
        <div className="page-navigation-wrap flex-center">
            {curPage !== 1 &&
                <>
                    <div className="clickable" onClick={()=>{navigate(curPage-1)}}>
                        {'<'}
                    </div>
                    <div className="clickable" onClick={()=>{navigate(1)}}>
                        1
                    </div>
                    {curPage !== 2 &&
                        <div>
                            ...
                        </div>
                    }
                </>
            }
            <div className="current-page-num">
                {curPage}
            </div>
            {curPage !== lastPage &&
                <>
                    {curPage !== lastPage - 1 &&
                        <div>
                            ...
                        </div>
                    }
                    <div className="clickable" onClick={()=>{navigate(lastPage)}}>
                        {lastPage}
                    </div>
                    <div className="clickable" onClick={()=>{navigate(curPage+1)}}>
                        {'>'}
                    </div>
                </>
            }
        </div>
    );
}

export default PageNavigation;