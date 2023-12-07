import '../styles/Notification.css'
import error from '../assets/error.svg'
import warning from '../assets/warning.svg'
import info from '../assets/info.svg'
import success from '../assets/success.svg'
import closeLogo from '../assets/close.svg'

function Notification({message, type, onClose}){

    function getImg(){
        switch(type){
            case 'error':
                return error;
            case 'warning':
                return warning;
            case 'success':
                return success
            default:
                return info;
        }
    }

    return(
        <div className={`notification-container  ${type}`}>
            <div className='notification-image-wrap'>
                <img src={getImg()} className='image-fit'></img>
            </div>
            <div className={`notification-text ${type}`}>
                {message}
            </div>
            <div className='notification-close-btn' onClick={onClose}>
                <img src={closeLogo} className='image-fit'></img>
            </div>
        </div>
    );
}

export default Notification;