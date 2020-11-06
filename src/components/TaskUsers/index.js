import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import api from '../../services/api';

import userImg from '../../assets/user@2x.png';
import { updateTask } from '../../redux'

// import useClickOutside from '../Button/index'



let TaskUsers = ({ task }) => {
  
  const { permissions } = useSelector(state => state);
  const { userPhotos } = useSelector(state => state);
  const { stateUpdate } = useSelector(state => state);
  
  const [vinculatedUsers, setVinculatedUsers] = useState([]);
  const [showUsers, setShowUsers] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  
  async function loadVinculateUsers() {
    const { data } = await api.get('Task_User.php', {
      params: {
        "AUTH": permissions.session,
        "task_id": task.id,
        "list_user": ''
      }
    })
    // console.log(data);
    setVinculatedUsers(data.data)
  }

  
  
  async function changeUser(id) {
    await api.put(`Task_User.php?AUTH=${permissions.session}`, {
      "task_id": task.id,
      "user_id": id
    }).then(dispatch(updateTask()))
  }
  
  useEffect(() => {
    loadVinculateUsers()
  }, [stateUpdate]);
  
//    const domNode = useClickOutside(()=>{
//       setShowUsers(false);
//     });

//     const doNode = useClickOutside(()=>{
//       setIsOpen(false)
//     })

  return (
    <div className="containerUsers">
      <div className="vinculatedUsers" >
        <div  onClick={() => setIsOpen(!isOpen) } >
          <p>{vinculatedUsers.length}</p>
        </div>
        <ul className="vinculatedList" show={isOpen}>
          {vinculatedUsers.map(user => (
            <React.Fragment>
              {userPhotos.map(userPhoto => (
                <>
                  { 
                    user.user_id == userPhoto.user_id && user.check === true && user.user_id != permissions.id ?
                    <li>
                        <img src={userPhoto.photo} width="35" height="35" alt="" />
                        <p>{user.name}</p>
                        <button onClick={() => changeUser(user.user_id)}>Remover</button>
                      </li>
                      : null
                    }
                </>
              ))}
            </React.Fragment>
          ))}
        </ul>
      </div>
      <div className="userList"  show={showUsers}>
        <div onClick={() => setShowUsers(!showUsers)}>
          <img src={userImg} alt="" width="" />
        </div>
        <ul>
          {vinculatedUsers.map(user => (
            <React.Fragment>
              {userPhotos.map(userPhoto => (
                <>
                  {
                    user.user_id == userPhoto.user_id && user.check === false && user.user_id != permissions.id ?
                      <li>
                        <img src={userPhoto.photo} width="35" height="35" alt="" />
                        <p>{user.name}</p>
                        <button onClick={() => changeUser(user.user_id)}>Vincular</button>
                      </li>
                    : null
                  }
                </>
              ))}
            </React.Fragment>
          ))}
        </ul>
      </div>
    </div>
  );
}




export default TaskUsers;
