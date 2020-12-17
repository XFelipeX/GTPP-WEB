import React,{useEffect} from "react";
import ButtonLogoff from "../ButtonLogoff";
import CreateTask from "../CreateTask";
import VisionMenu from "../VisionMenu";
import ButtonFilter from "../ButtonFilter";
import { useSelector, useDispatch } from 'react-redux';
import userEmpty from '../../assets/nullphoto.jpeg';
import api from '../../services/api';
import "./style.css";

let UserInfo = () => {
  let dispatch = useDispatch();
  const {userInfo} = useSelector(state => state);
  const {permissions} = useSelector(state => state);

  // console.log(userInfo)

  async function loadUserPhoto() {
    const AUTH = permissions.session;
    const idUser = permissions.id;

    try {
      let {data} = await api.get('CCPP/EmployeePhoto.php?AUTH='+AUTH+"&app_id=3&id="+idUser);

      // console.log(data);

      userInfo[0].photo = convertImage(data.photo);

    } catch (error) {
      
    }
    
  }

  function convertImage(src) {
    if (src != null) {
      var image = new Image();
      image.src = "data:image/jpeg;base64, " + src;
      return image.src;
    } else {
      return null;
    }
  }
  
  useEffect(() => {
    loadUserPhoto();
  },[])

  // console.log(userInfo);

  return (
    <div className="user-info-area" style={{display:"flex", alignItems:"center"}}>
        <div className="user-info" >
        {userInfo.photo != null ?(
          <img src={userInfo.photo} width="50" height="50" style={{borderRadius:"50%" , marginLeft:"20px"}}></img>
        ) : (
          <img src={userEmpty} width="50" height="50" style={{borderRadius:"50%" , marginLeft:"20px"}}></img>
        )}
         
        </div>
    </div>
  )
}

function Header() {
 
  return (
    <div className="header-area">
      <div className="container-custom">
        <div className="create-task">
            <UserInfo/>
        </div>
        <div className="right-area">

        
          <CreateTask />
       
          <VisionMenu />
          <ButtonFilter/>
    
            
          <ButtonLogoff />
       
       
      
        </div>
      </div>
    </div>
  );
}

export default Header;
