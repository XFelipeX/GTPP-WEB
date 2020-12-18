import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import './style.css';
import api from "../../services/api";
// import {AiOutlineUser} from 'react-icons/ai';
import userEmpty from '../../assets/nullphoto.jpeg';

import userImg from "../../assets/user@2x.png";
import { getUsersPhotos, getVinculatedUsers, updateTask } from "../../redux";

import useClickOutside from '../ClickOutside';

let TaskUsers = ({ task }) => {
  const { permissions } = useSelector((state) => state);
  const { userPhotos } = useSelector((state) => state);
  const { stateUpdate } = useSelector((state) => state); 
  const { taskUsersPhotos} = useSelector((state) => state);   
  const [takePhotos, setTakePhotos] = useState([]);
  // const [vinculatedUsers, setVinculatedUsers] = useState([]);
  const {vinculatedUsers} = useSelector(state => state);
  const [users,setUsers] = useState([]);
  const [showUsers, setShowUsers] = useState(false);
  const [open, setOpen] = useState(false);
  const [photos,setPhotos] = useState([]);
  const dispatch = useDispatch();



  async function loadVinculateUsers() {
    const { data } = await api.get("GTPP/Task_User.php", {
      params: {
        AUTH: permissions.session,
        task_id: task.id,
        list_user:0,
        app_id: 3,
      },
    });
    // console.log(data);
    try {
      // dispatch(getVinculatedUsers(data.data));
      setUsers(data.data);
    } catch (error) {
      
    }
 
    // console.log(users)
    // console.log(task.id)
  }

  useEffect(() => {
    loadVinculateUsers();
  },[])

  function convertImage(src) {
    if (src != null) {
      var image = new Image();
      image.src = "data:image/jpeg;base64, " + src;
      return image.src;
    } else {
      return null;
    }
  }


  const loadUserImages = async (idUser) => {
    const AUTH = sessionStorage.getItem("token");
    try {
      const { data } = await api.get(
        "http://192.168.0.99:71/GLOBAL/Controller/CCPP/EmployeePhoto.php?AUTH=" +
          AUTH +
          "&app_id=3&id=" +
          idUser
      );

   

      if (data) {
        // console.log(data);
        if(data.photo==null||data.photo==""){
          
          data.user_id = idUser;
          // console.log(data.user_id);
          data.photo = userEmpty;
          setTakePhotos((oldarray) => [...oldarray, data]);
    
         
        }else{
          data.photo = convertImage(data.photo);
          setTakePhotos((oldarray) => [...oldarray, data]);
     
        }
       
        
      }
      
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // let count=0;
    users.forEach((user) => {
      // let user = vinculatedUsers.users.filter(user => user.id == task.user_id);

      // if(user[0].photo==null){
      //   loadUserImages(task.user_id)
      // }
      
    loadUserImages(user.user_id)
    });

  

  }, []);

  useEffect(() => {
    dispatch(getUsersPhotos(takePhotos));
    
  }, [takePhotos]);

  let loadUsersAmount = () => {
      let count = 1;
      if(vinculatedUsers.users){
        vinculatedUsers.users.forEach(e => e.check === true ? count++ : 0);
      }
     

      return count;
  }

  async function changeUser(id) {
    await api
      .put(`GTPP/Task_User.php?AUTH=${permissions.session}&app_id=3`, {
        task_id: task.id,
        user_id: id,
      })
      .then(() => { setAllUsers(loadAllUsers()) });

      dispatch(updateTask())
  }




  // console.log(userPhotos);

  let domNode = useClickOutside(() =>{
    setOpen(false)
  })

  let domNode2 = useClickOutside(() =>{
    setShowUsers(false)
  })

  // console.log(vinculatedUsers);
  
  // console.log(users)

 
  if(users){
    users.map((user) => {
      let result = vinculatedUsers.filter(users => users.id == user.user_id);
      user.name = result[0].user;
      // console.log(user.name)
    })
  }
 

  function loadAllUsers(){
    let allUsers = [];

    // for(let i=0;i<vinculatedUsers.length;i++){
    //   let user = users.filter((user) => user.user_id!=vinculatedUsers[i].id);
    //   console.log(user)
    //   if(user.lenght>=0){

    //   }else{
    //     allUsers.push(vinculatedUsers[i]);
    //   }
   
    // }

    // let result = vinculatedUsers.filter(user => user.id!==)

    console.log(allUsers)
    return allUsers;
  }
  
  const [allUsers,setAllUsers] = useState();

  useEffect(() => {
    let users = loadAllUsers;
    setAllUsers(users);
  },[stateUpdate])


  useEffect(() => {
   
    setAllUsers(loadAllUsers);
  },[])

  // let allUsers = loadAllUsers();



  return (
    <div className="containerUsers">
      <div  ref={domNode} className="vinculatedUsers">
        <div onClick={() => setOpen(!open) }>
          {/* <p>{vinculatedUsers.length}</p> */}
          {users ? users.length : null}
        </div>
        { open  && loadUsersAmount() > 0 ? (
          <ul className="vinculatedList" >
          {users.map((user) => (
            
            <React.Fragment key={user.user_id}>
              {userPhotos.map((userPhoto) => (
               
                <React.Fragment key={userPhoto.user_id}>
                  {user.user_id == userPhoto.user_id 
                 ? (
                
                    <li>


                      <img
                      
                        src={userPhoto.photo}
                        width="35"
                        height="35"
                        alt=""
                      />
                      <p style={{color:'white',paddingLeft:'5px',fontSize:'16px'}}>{user.name}</p>
                      {task.user_id == permissions.id || permissions.administrator==1? <button onClick={() => changeUser(user.user_id)}>
                        Remover
                      </button> : null}
                      
                    </li>
                  ) : null}
                </React.Fragment>
              ))}
            </React.Fragment>
          ))}
        </ul>
        ) : null}
     
      </div>
      <div ref={domNode2} className="userList">
        <div onClick={() => {
          setShowUsers(!showUsers)
          
        }}>
          <img src={userImg} alt="" width="" />
        </div>
        {showUsers ? (
        <ul>
          {allUsers.map((user) => (
            <React.Fragment key={user.user_id}>
              

              {userPhotos.map((userPhoto) => (
                <a id={userPhoto.user_id}>
                  {user.id == userPhoto.user_id &&
                  user.user_id != permissions.id  ? (
                    <li>
                      <img
                        src={userPhoto.photo}
                        width="35"
                        height="35"
                        alt=""
                      />
                      <p style={{color:'white',paddingLeft:'5px',fontSize:'16px'}}>{user.user}</p>
                      <button onClick={() => {
                        changeUser(user.id)
          
                      }}>
                        Vincular
                      </button>
                    </li>
                  ) : null}
                </a>
              ))}
            </React.Fragment>
          ))}
        </ul> ) : null}
      </div>
     
    </div>
  );
};

export default TaskUsers;

