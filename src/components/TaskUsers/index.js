import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./style.css";
import api from "../../services/api";
// import {AiOutlineUser} from 'react-icons/ai';
import userEmpty from "../../assets/nullphoto.jpeg";

import userImg from "../../assets/user@2x.png";
import {
  getUsersPhotos,
  getVinculatedUsers,
  orderTasks,
  updateTask,
} from "../../redux";

import useClickOutside from "../ClickOutside";
import Loading from "../Loading";

let TaskUsers = ({ task }) => {
  const { permissions } = useSelector((state) => state);
  const AUTH = permissions.session;
  const { userPhotos } = useSelector((state) => state);
  const { stateUpdate } = useSelector((state) => state);
  const { taskUsersPhotos } = useSelector((state) => state);
  const [loading, setLoading] = useState(false);
  const [takePhotos, setTakePhotos] = useState([]);
  // const [vinculatedUsers, setVinculatedUsers] = useState([]);
  const { vinculatedUsers } = useSelector((state) => state);
  const [users, setUsers] = useState([]);
  const [showUsers, setShowUsers] = useState(false);
  const [open, setOpen] = useState(false);
  const [photos, setPhotos] = useState([]);

  const [allUsers, setAllUsers] = useState([]);
  const dispatch = useDispatch();

  async function loadVinculateUsers() {
    const { data } = await api.get("GTPP/Task_User.php", {
      params: {
        AUTH: AUTH,
        task_id: task.id,
        list_user: 0,
        app_id: 3,
      },
    });
    // console.log(data);
    try {
      // dispatch(getVinculatedUsers(data.data));
      setUsers(data.data);
    } catch (error) {}

    // console.log(users)
    // console.log(task.id)
  }

  useEffect(() => {
    loadVinculateUsers();
  }, [stateUpdate]);

  async function loadAllUsers() {
    try {
      const { data } = await api.get("GTPP/Task_User.php", {
        params: {
          AUTH: AUTH,
          task_id: task.id,
          list_user: 1,
          app_id: 3,
        },
      });
      return data;
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    loadAllUsers().then((response) => {
      if (response.error === false) {
        setAllUsers(response.data);
      }
    });
  }, [stateUpdate]);

  // console.log(allUsers)

  // let teste = "teste";

  const [filterUser, setFilterUser] = useState(null);

  const [user, setUser] = useState("");

  function searchUser(e) {
    let userName = e.toLowerCase();
    if (userName != "") {
      setFilterUser(
        allUsers.filter((user) => user.name.toLowerCase().includes(userName))
      );
    } else {
      setFilterUser(null);
    }
  }

  useEffect(() => {
    searchUser(user);
  }, [user]);

  // const [allUsers]

  // function convertImage(src) {
  //   if (src != null) {
  //     var image = new Image();
  //     image.src = "data:image/jpeg;base64, " + src;
  //     return image.src;
  //   } else {
  //     return null;
  //   }
  // }

  // const loadUserImages = async (idUser) => {
  //   const AUTH = sessionStorage.getItem("token");
  //   try {
  //     const { data } = await api.get(
  //       "http://192.168.0.99:71/GLOBAL/Controller/CCPP/EmployeePhoto.php?AUTH=" +
  //         AUTH +
  //         "&app_id=3&id=" +
  //         idUser
  //     );

  //     if (data) {
  //       // console.log(data);
  //       if(data.photo==null||data.photo==""){

  //         data.user_id = idUser;
  //         // console.log(data.user_id);
  //         data.photo = userEmpty;
  //         setTakePhotos((oldarray) => [...oldarray, data]);

  //       }else{
  //         data.photo = convertImage(data.photo);
  //         setTakePhotos((oldarray) => [...oldarray, data]);

  //       }

  //     }

  //     return data;
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // useEffect(() => {
  //   // let count=0;
  //   users.forEach((user) => {
  //     // let user = vinculatedUsers.users.filter(user => user.id == task.user_id);

  //     // if(user[0].photo==null){
  //     //   loadUserImages(task.user_id)
  //     // }

  //   loadUserImages(user.user_id)
  //   });

  // }, []);

  useEffect(() => {
    dispatch(getUsersPhotos(takePhotos));
  }, [takePhotos]);

  // let loadUsersAmount = () => {
  //     let count = 1;
  //     if(vinculatedUsers.users){
  //       vinculatedUsers.users.forEach(e => e.check === true ? count++ : 0);
  //     }

  //     return count;
  // }

  async function changeUser(id) {
    try {
      await api.put(`GTPP/Task_User.php?AUTH=${AUTH}&app_id=3`, {
        task_id: task.id,
        user_id: id,
      });

      dispatch(updateTask());
      dispatch(orderTasks());
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 1200);
    } catch (error) {
      // console.log(error)
      let msg = "";

      if (error.response) {
        msg = error.response.data.message;

        if (msg.includes("Task with this state cannot be modified")) {
          alert("Tarefa neste estado não pode ser modificada!");
        } else if (
          msg.includes("Only the task creator or administrator can do this")
        ) {
          alert(
            "Somente o criador da tarefa ou administrador pode fazer isto!"
          );
        }
      } else {
        msg = error.message;

        if (msg.includes("Network Error")) {
          alert("Autorização negada!");
        }
      }
    } finally {
      setFilterUser(null);
      setUser("");
    }
  }

  // console.log(userPhotos);

  let domNode = useClickOutside(() => {
    setOpen(false);
  });

  let domNode2 = useClickOutside(() => {
    setShowUsers(false);
    setFilterUser(null);
  });

  // console.log(vinculatedUsers);

  // console.log(users)

  if (users.length > 0) {
    users.map((user) => {
      let result = vinculatedUsers.filter((users) => users.id == user.user_id);
      user.name = result[0].user;
      // console.log(user.name)
    });
  }

  // function loadAllUsers(){
  //   let allUsers = [];

  //   // for(let i=0;i<vinculatedUsers.length;i++){
  //   //   let user = users.filter((user) => user.user_id!=vinculatedUsers[i].id);
  //   //   console.log(user)
  //   //   if(user.lenght>=0){

  //   //   }else{
  //   //     allUsers.push(vinculatedUsers[i]);
  //   //   }

  //   // }

  //   // let result = vinculatedUsers.filter(user => user.id!==)

  //   // console.log(allUsers)
  //   return allUsers;
  // }

  // useEffect(() => {
  //   let users = loadAllUsers;
  //   setAllUsers(users);
  // },[stateUpdate])

  // useEffect(() => {

  //   setAllUsers(loadAllUsers);
  // },[])

  // let allUsers = loadAllUsers();

  return (
    <div className="containerUsers">
      {loading == true ? <Loading /> : null}
      <div ref={domNode} className="vinculatedUsers">
        <div onClick={() => setOpen(!open)}>
          {/* <p>{vinculatedUsers.length}</p> */}
          {users ? users.length : null}
        </div>
        {open && users.length > 0 ? (
          <ul className="vinculatedList">
            {users.map((user) => (
              <React.Fragment key={user.user_id}>
                {userPhotos.map((userPhoto) => (
                  <React.Fragment key={userPhoto.user_id}>
                    {user.user_id == userPhoto.user_id ? (
                      <li>
                        <img
                          src={userPhoto.photo}
                          width="35"
                          height="35"
                          alt=""
                        />
                        <p
                          style={{
                            color: "white",
                            paddingLeft: "5px",
                            fontSize: "16px",
                          }}
                        >
                          {user.name}
                        </p>
                        {task.user_id == permissions.id ||
                        (permissions.administrator == 1 &&
                          user.user_id != permissions.id) ? (
                          <button onClick={() => changeUser(user.user_id)}>
                            Remover
                          </button>
                        ) : null}
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
        <div
          onClick={() => {
            setShowUsers(!showUsers);
          }}
        >
          <img src={userImg} alt="" width="" />
        </div>

        {showUsers ? (
          <>
            <div className="search-user">
              <label>Pesquisar</label>
              <input
                type="text"
                value={user}
                onChange={(e) => setUser(e.target.value)}
              />
            </div>
            <ul>
              {filterUser != null
                ? filterUser.map((user) => (
                    <React.Fragment key={user.user_id}>
                      {userPhotos.map((userPhoto) => (
                        <a id={userPhoto.user_id} key={userPhoto.user_id}>
                          {user.user_id == userPhoto.user_id &&
                          user.user_id != permissions.id &&
                          user.check == false ? (
                            <li>
                              <img
                                src={userPhoto.photo}
                                width="35"
                                height="35"
                                alt=""
                              />
                              <p
                                style={{
                                  color: "white",
                                  paddingLeft: "5px",
                                  fontSize: "16px",
                                  width: "240px",
                                }}
                              >
                                {user.name}
                              </p>
                              <button
                                onClick={() => {
                                  changeUser(user.user_id);
                                }}
                              >
                                Vincular
                              </button>
                            </li>
                          ) : null}
                        </a>
                      ))}
                    </React.Fragment>
                  ))
                : allUsers.map((user) => (
                    <React.Fragment key={user.user_id}>
                      {userPhotos.map((userPhoto) => (
                        <a id={userPhoto.user_id} key={userPhoto.user_id}>
                          {user.user_id == userPhoto.user_id &&
                          user.user_id != permissions.id &&
                          user.check == false ? (
                            <li>
                              <img
                                src={userPhoto.photo}
                                width="35"
                                height="35"
                                alt=""
                              />
                              <p
                                style={{
                                  color: "white",
                                  paddingLeft: "5px",
                                  fontSize: "16px",
                                  width: "240px",
                                }}
                              >
                                {user.name}
                              </p>
                              <button
                                onClick={() => {
                                  changeUser(user.user_id);
                                }}
                              >
                                Vincular
                              </button>
                            </li>
                          ) : null}
                        </a>
                      ))}
                    </React.Fragment>
                  ))}
            </ul>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default TaskUsers;
