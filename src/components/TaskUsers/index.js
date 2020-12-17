import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import './style.css';
import api from "../../services/api";
// import {AiOutlineUser} from 'react-icons/ai';
import userEmpty from '../../assets/nullphoto.jpeg';

import userImg from "../../assets/user@2x.png";
import { getVinculatedUsers, updateTask } from "../../redux";

import useClickOutside from '../ClickOutside';

let TaskUsers = ({ task }) => {
  const { permissions } = useSelector((state) => state);
  const { userPhotos } = useSelector((state) => state);
  const { stateUpdate } = useSelector((state) => state);

  const [vinculatedUsers, setVinculatedUsers] = useState([]);
  const [showUsers, setShowUsers] = useState(false);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();


  async function loadVinculateUsers() {
    const { data } = await api.get("GTPP/Task_User.php", {
      params: {
        AUTH: permissions.session,
        task_id: task.id,
        list_user:1,
        app_id: 3,
      },
    });
    // console.log(data);
    try {
      dispatch(getVinculatedUsers(data.data));
      setVinculatedUsers(data.data);
    } catch (error) {
      
    }
 
    // console.log(vinculatedUsers)
  }

  let loadUsersAmount = () => {
      let count = 1;
      if(vinculatedUsers){
        vinculatedUsers.forEach(e => e.check === true ? count++ : 0);
      }
     

      return count;
  }

  async function changeUser(id) {
    await api
      .put(`GTPP/Task_User.php?AUTH=${permissions.session}&app_id=3`, {
        task_id: task.id,
        user_id: id,
      })
      .then();

      dispatch(updateTask())
  }

  useEffect(() => {
    loadVinculateUsers();
  }, [stateUpdate]);

  //    const domNode = useClickOutside(()=>{
  //       setShowUsers(false);
  //     });

  //     const doNode = useClickOutside(()=>{
  //       setIsOpen(false)
  //     })


  // console.log(userPhotos);

  let domNode = useClickOutside(() =>{
    setOpen(false)
  })

  let domNode2 = useClickOutside(() =>{
    setShowUsers(false)
  })

  // console.log(vinculatedUsers);
  
  // console.log(permissions)

  return (
    <div className="containerUsers">
      <div  ref={domNode} className="vinculatedUsers">
        <div onClick={() => setOpen(!open) }>
          {/* <p>{vinculatedUsers.length}</p> */}
          {loadUsersAmount()}
        </div>
        { open  && loadUsersAmount() > 0 ? (
          <ul className="vinculatedList" >
          {vinculatedUsers.map((user) => (
            
            <React.Fragment>
              {userPhotos.map((userPhoto) => (
                
                <>
                  {user.user_id === userPhoto.user_id &&
                  user.check === true && userPhoto.photo!=null
                 ? (
                
                    <li>


                      <img
                      
                        src={userPhoto.photo}
                        width="35"
                        height="35"
                        alt=""
                      />
                      <p>{user.name}</p>
                      {task.user_id == permissions.id ? <button onClick={() => changeUser(user.user_id)}>
                        Remover
                      </button> : null}
                      
                    </li>
                  ) : user.user_id == userPhoto.user_id &&
                  user.check == true &&
                  userPhoto.photo==null ?  (
                    <li>
                    <img
                        src={userEmpty}
                        width="35"
                        height="35"
                        alt=""
                      />
                      <p>{user.name}</p>
                      {task.user_id == permissions.id ? (<button onClick={() => changeUser(user.user_id)}>
                        Remover
                      </button>) : null}
                    </li>    
                            
                  ) : null}
                </>
              ))}
            </React.Fragment>
          ))}
        </ul>
        ) : null}
     
      </div>
      <div ref={domNode2} className="userList">
        <div onClick={() => setShowUsers(!showUsers)}>
          <img src={userImg} alt="" width="" />
        </div>
        {showUsers ? (
        <ul>
          {vinculatedUsers.map((user) => (
            <React.Fragment>
              {userPhotos.map((userPhoto) => (
                <a id={userPhoto.user_id}>
                  {user.user_id == userPhoto.user_id &&
                  user.check == false &&
                  user.user_id != permissions.id && userPhoto.photo!=null ? (
                    <li>
                      <img
                        src={userPhoto.photo}
                        width="35"
                        height="35"
                        alt=""
                      />
                      <p>{user.name}</p>
                      <button onClick={() => changeUser(user.user_id)}>
                        Vincular
                      </button>
                    </li>
                  ) : user.user_id == userPhoto.user_id &&
                  user.check == false &&
                  user.user_id != permissions.id && userPhoto.photo==null ?  (
                    <li>
                    <img
                        src={userEmpty}
                        width="35"
                        height="35"
                        alt=""
                      />
                      <p>{user.name}</p>
                      <button onClick={() => changeUser(user.user_id)}>
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

