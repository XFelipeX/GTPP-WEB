import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./style.css";
import api from "../../services/api";
import { store } from "react-notifications-component";
import userImg from "../../assets/user@2x.png";
import {
  getUsersPhotos,
  orderTasks,
  removeUsersList,
  removeUsersOnline,
  updateStateAdmin,
  updateTask,
} from "../../redux";
import useClickOutside from "../ClickOutside";
import Loading from "../Loading";
import { showNotification } from "../TaskTable/functions";
// import { BiRepost } from "react-icons/bi";

let TaskUsers = ({ task }) => {
  const { permissions } = useSelector((state) => state);
  const AUTH = permissions.session;
  const { userPhotos } = useSelector((state) => state);
  const { stateUpdate } = useSelector((state) => state);
  const { stateAdmin } = useSelector((state) => state);
  const { seeAdminSet } = useSelector((state) => state);
  const { webSocket } = useSelector((state) => state);
  const { tasks } = useSelector((state) => state);
  const [loading, setLoading] = useState(false);
  const [takePhotos, setTakePhotos] = useState([]);
  const { vinculatedUsers } = useSelector((state) => state);
  const [users, setUsers] = useState([]);
  const [showUsers, setShowUsers] = useState(false);
  const [open, setOpen] = useState(false);
  // const [photos, setPhotos] = useState([]);

  const [allUsers, setAllUsers] = useState([]);
  const dispatch = useDispatch();

  // console.log(webSocket);

  useEffect(() => {
    async function loadVinculateUsers() {
      const { data } = await api.get("GTPP/Task_User.php", {
        params: {
          AUTH: AUTH,
          task_id: task.id,
          list_user: 0,
          app_id: 3,
        },
      });

      if (data.error === true) {
        let msg = data.message;

        if (msg.includes("No data")) {
          // showNotification('Aviso','Você ainda não possui tarefas','warning');
        } else if (msg.includes("Authorization denied")) {
          showNotification("Erro", "Autorização negada", "danger");
        } else {
          showNotification("Erro", msg, "danger");
        }
      }

      try {
        // dispatch(getVinculatedUsers(data.data));
        setUsers(data.data);
      } catch (error) {
        showNotification("Erro", error, "danger");
      }

      // console.log(task.id)
    }

    loadVinculateUsers();
  }, [stateUpdate, stateAdmin]);

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

      if (data.error === true) {
        let msg = data.message;

        if (msg.includes("No data")) {
          // showNotification('Aviso','Você ainda não possui tarefas','warning');
        } else if (msg.includes("Authorization denied")) {
          showNotification("Erro", "Autorização negada", "danger");
        } else {
          showNotification("Erro", msg, "danger");
        }
      }
      return data;
    } catch (error) {
      showNotification("Erro", error.message, "danger");

      return { error: true };
    }
  }

  useEffect(() => {
    loadAllUsers().then((response) => {
      if (response.error === false) {
        // console.log(response.data)
        setAllUsers(response.data);
      }
    });
  }, [stateUpdate, stateAdmin]);

  // useEffect(() => {
  //   allUsers.map((user) => {
  //     user.status = false;
  //   });
  // }, [allUsers]);

  // if (webSocket.users !== undefined) {
  //   // if (seeAdminSet === true) {
  //   //   dispatch(updateStateAdmin());
  //   // } else {
  //   //   dispatch(updateTask());
  //   // }

  //   allUsers.map((user) => {
  //     webSocket.users.forEach((item, index) => {
  //       if (user.user_id == item) {
  //         // console.log("online");
  //         user.status = true;
  //         // console.log(user)
  //       }
  //     });
  //   });
  // }

  // if (webSocket.users !== undefined) {

  //   allUsers.map((user) => {
  //     webSocket.users.forEach((item, index) => {
  //       if (user.user_id == item) {
  //         // console.log("online");
  //         user.status = true;
  //         // console.log(user)
  //       }
  //     });
  //   });
  // }

  // useEffect(() => {
  //   if (webSocket.users !== undefined) {
  //     allUsers.map((user) => {
  //       webSocket.users.map((item) => {
  //         if (user.user_id == item) {
  //           // console.log("online");
  //           user.status = true;
  //           // console.log(user)
  //         }
  //       });
  //     });
  //   }

  // }, [webSocket]);

  function SendMessage() {
    if (webSocket.websocketState === "connected") {
      try {
        let jsonString = {
          type: -2,
        };
        webSocket.websocket.send(JSON.stringify(jsonString));

        // console.log(jsonString);
      } catch (error) {
        alert(error);
      }
    }
  }

  // console.log(webSocket.users)

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

  useEffect(() => {
    dispatch(getUsersPhotos(takePhotos));
  }, [takePhotos]);

  function SendInfo(msg, changeUser) {
    let taskf = tasks.filter((taskf) => taskf.id === task.id);
    taskf.focus = true;

    if (msg !== "" && webSocket.websocketState === "connected") {
      try {
        let jsonString = {
          task_id: task.id,
          message: {
            description: msg,
            task_id: task.id,
            task: taskf[0],
            changeUser: changeUser,
          },
          date_time: null,
          user_id: Number(permissions.id),
          type: 5,
        };
        webSocket.websocket.send(JSON.stringify(jsonString));

        // console.log(jsonString);
      } catch (error) {
        alert(error);
      }
    }
  }

  async function changeUser(id, vinculated) {
    // alert(vinculated)
    if (vinculated == true) {
      SendInfo("foi removido da tarefa", id);
    }

    try {
      const { data } = await api.put(
        `GTPP/Task_User.php?AUTH=${AUTH}&app_id=3`,
        {
          task_id: task.id,
          user_id: id,
        }
      );

      // console.log(data);

      if (data.error === true) {
        showNotification("Erro", data.message, "danger");
      } else {
        SendInfo("foi vinculado a tarefa", id);
        store.addNotification({
          title: "Sucesso",
          message: "A lista de usuários vinculados foi atualizada",
          type: "success",
          container: "top-center",
          insert: "top",
          animationIn: ["animate__animated animate__fadeIn"],
          animationOut: ["animate__animated animate__fadeOut"],
          dismiss: {
            duration: 2000,
          },
          width: 400,
        });

        dispatch(orderTasks());
        setLoading(true);
        setTimeout(() => {
          setLoading(false);
        }, 1200);

        let userReply;
        allUsers.map((user) => {
          if (user.user_id == id) {
            user.check = !vinculated;
            userReply = user;
          }
        });

        if (vinculated == true) {
          // console.log(userReply)
          let vinculatedUser = [];

          users.map((user) => {
            if (Number(user.user_id) != Number(userReply.user_id)) {
              // console.log(user);
              vinculatedUser.push(user);
            }
            // console.log(user);
          });

          setUsers([...vinculatedUser]);
          // users = [...vinculatedUser];
        } else {
          if (users.length > 0) {
            setUsers((oldarray) => [...oldarray, userReply]);
          } else {
            setUsers([userReply]);
          }

          // users.push(userReply);
        }
      }
    } catch (error) {
      // console.log(error)
      let msg = "";

      if (error.response) {
        msg = error.response.data.message;

        if (msg.includes("Task with this state cannot be modified")) {
          store.addNotification({
            title: "Aviso",
            message: "Tarefa neste estado não pode ser modificada",
            type: "warning",
            container: "top-center",
            insert: "top",
            animationIn: ["animate__animated animate__fadeIn"],
            animationOut: ["animate__animated animate__fadeOut"],
            dismiss: {
              duration: 2000,
            },
            width: 400,
          });
        } else if (
          msg.includes("Only the task creator or administrator can do this")
        ) {
          store.addNotification({
            title: "Aviso",
            message:
              "Somente o criador da tarefa ou administrador pode fazer isto!",
            type: "warning",
            container: "top-center",
            insert: "top",
            animationIn: ["animate__animated animate__fadeIn"],
            animationOut: ["animate__animated animate__fadeOut"],
            dismiss: {
              duration: 2000,
            },
            width: 400,
          });
        }
      } else {
        msg = error.message;

        if (msg.includes("Network Error")) {
          store.addNotification({
            title: "Aviso",
            message: "Autorização negada",
            type: "warning",
            container: "top-center",
            insert: "top",
            animationIn: ["animate__animated animate__fadeIn"],
            animationOut: ["animate__animated animate__fadeOut"],
            dismiss: {
              duration: 2000,
            },
            width: 400,
          });
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
    setUser("");
  });

  // console.log(vinculatedUsers);

  // console.log(allUsers)

  useEffect(() => {
    if (users.length > 0) {
      users.map((user) => {
        let result = vinculatedUsers.filter(
          (users) => users.id == user.user_id
        );
        user.name = result[0].user;
        // console.log(user.name)
      });
    }
  }, [users]);

  function verifyPosition(e) {
    const client = e.clientY;
    const windowY = window.innerHeight / 2;
    let menu = document.querySelector(".menu-users-top");
    let searchUser = document.querySelector(".search-user-top");

    if (menu !== null) {
      if (client > windowY) {
        // console.log(menu);
        menu.classList.remove("menu-users-top");
        searchUser.classList.remove("search-user-top");
        menu.classList.add("menu-users-bottom");
        searchUser.classList.add("search-user-middle");
      } else {
        menu.classList.remove("menu-users-bottom");
        searchUser.classList.remove("search-user-middle");
        menu.classList.add("menu-users-top");
        searchUser.classList.add("search-user-top");
      }
    }

    // console.log(e);

    // console.log(client)
    // console.log(windowY)
  }

  function verifyStatus(userId) {
    // webSocket.users && webSocket.users.map((id) => user.user_id == id && return "online")

    const filter = webSocket.users.filter((id) => id == userId);

    if (filter[0]) {
      return "online";
    } else {
      return "";
    }
  }

  return (
    <div className="containerUsers">
      {loading == true ? <Loading /> : null}
      <div ref={domNode} className="vinculatedUsers">
        <div onClick={() => setOpen(!open)}>
          {/* <p>{vinculatedUsers.length}</p> */}
          {users ? users.length : 0}
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
                        {/* {task.user_id == permissions.id ||
                        (permissions.administrator == 1 &&
                          user.user_id != permissions.id) ? (
                          <button onClick={() => changeUser(user.user_id)}>
                            Remover
                          </button>
                        ) : null} */}
                      </li>
                    ) : null}
                  </React.Fragment>
                ))}
              </React.Fragment>
            ))}
          </ul>
        ) : null}
      </div>
      <div ref={domNode2} className="userList" onClick={(e) => {}}>
        <div
          onClick={(e) => {
            setShowUsers(!showUsers);
            setTimeout(() => {
              verifyPosition(e);
            }, 100);

            SendMessage();
          }}
          className="box"
        >
          <img src={userImg} alt="" width="" />
        </div>

        {showUsers ? (
          <>
            <div className="search-user-top">
              <label>Pesquisar</label>
              <input
                type="text"
                value={user}
                onChange={(e) => setUser(e.target.value)}
              />
            </div>
            <ul className="menu-users-top">
              {filterUser != null
                ? filterUser.map((user) => (
                    <React.Fragment key={user.user_id}>
                      {userPhotos.map((userPhoto) => (
                        <React.Fragment key={userPhoto.user_id}>
                          <a
                            id={userPhoto.user_id}
                            key={userPhoto.user_id}
                            className="user"
                          >
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
                                    width: "80%",
                                  }}
                                >
                                  {user.name}
                                </p>
                                <input
                                  type="checkbox"
                                  checked={user.check}
                                  onChange={() => changeUser(user.user_id)}
                                />
                              </li>
                            ) : null}
                          </a>
                        </React.Fragment>
                      ))}
                    </React.Fragment>
                  ))
                : allUsers.map((user) => (
                    <React.Fragment key={user.user_id}>
                      {userPhotos.map((userPhoto) => (
                        <React.Fragment key={userPhoto.user_id}>
                          <a
                            id={userPhoto.user_id}
                            key={userPhoto.user_id}
                            className="user"
                          >
                            {user.user_id == userPhoto.user_id &&
                            user.user_id != permissions.id ? (
                              <li>
                                <img
                                  className={verifyStatus(user.user_id)}
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
                                    marginRight: 20,
                                  }}
                                >
                                  {user.name}
                                </p>
                                {/* 
                              {webSocket.users
                                && webSocket.users.map((id) =>
                                    user.user_id == id && (
                                      <span className="online"></span>
                                    ) 
                                  )
                                } */}

                                <input
                                  type="checkbox"
                                  checked={user.check}
                                  onChange={(e) =>
                                    changeUser(user.user_id, user.check)
                                  }
                                />
                                {/* <button
                                onClick={() => {
                                  changeUser(user.user_id);
                                }}
                              >
                                Vincular
                              </button> */}
                              </li>
                            ) : null}
                          </a>
                        </React.Fragment>
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
