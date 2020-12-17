import react from 'react';
import {BiLoaderAlt} from 'react-icons/bi';
import './style.css';


let Loading = () => {
    return (
        <div className="loading-screen">   
            <div className="loading-area">
            <BiLoaderAlt size={50} color="white"/>
            </div>
        
        </div>
    )
}

export default Loading;