import closeLogo from '../assets/close.svg'
import '../styles/UsersList.css'
import UserBlock from './UserBlock';

function UsersList({ onClose, header, list }) {

    return (
        <div className='users-list-popup-wrap flex-center'>
            <div className='users-list-wrap bordered flex-center'>
                <div className='users-list-header'>
                    {header}
                </div>
                <div className='users-list-container'>
                    {
                        list.map((user, index) => (
                            <UserBlock username = {user.username} userImg={user.userImg}
                            key={index} onClose={onClose}></UserBlock>
                        ))
                    }
                </div>
                <div className='users-list-close-btn' onClick={onClose}>
                    <img src={closeLogo} className='image-fit'></img>
                </div>
            </div>
        </div>
    );
}

export default UsersList;