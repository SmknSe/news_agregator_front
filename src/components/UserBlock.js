import '../styles/UserBlock.css'
import userLogo from '../assets/user.svg'
import { useNavigate } from 'react-router-dom';
import { defaultPath } from '../Functions';

function UserBlock({ username, userImg, onClose }) {

    const navigate = useNavigate();

    function navigateToUser(username) {
        if (onClose) onClose();
        setTimeout(() => {
            navigate(`/user/${username}`);
        }, 300);
    }

    return (
        <div className='user-block-wrap bordered' onClick={() => { navigateToUser(username) }}>
            <div className='user-block-image-wrap'>
                <img src={userImg ? defaultPath + 'images/' + userImg : userLogo} className='image-fit'></img>
            </div>
            <div className='user-block-username'>
                {username}
            </div>
        </div>
    );
}

export default UserBlock;