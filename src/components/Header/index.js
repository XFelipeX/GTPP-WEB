import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  addUsersOnline,
  getNotifications,
  getTask,
  getUsersOnline,
  getWebSocketMessage,
  taskInfoShow,
} from "../../redux";
import ButtonLogoff from "../ButtonLogoff";
import CreateTask from "../CreateTask";
import VisionMenu from "../VisionMenu";
import ButtonFilter from "../ButtonFilter";
import InfoUser from "../InfoUser";
import LoadTasks from "../LoadTasks";
import OrderTasks from "../OrderTasks";
import { store } from "react-notifications-component";
import api from "../../services/api";
import "./style.css";
import SearchTask from "../SearchTask";
import { removeUsersOnline } from "../../redux/webSocket/webSocketActions";

function showNotification(title, message, type) {
  store.addNotification({
    title: title,
    message: message,
    type: type,
    container: "top-center",
    insert: "top",
    animationIn: ["animate__animated animate__fadeIn"],
    animationOut: ["animate__animated animate__fadeOut"],
    dismiss: {
      duration: 4000,
    },
    width: 400,
  });
}

function Header() {
  const dispatch = useDispatch();
  const { webSocket } = useSelector((state) => state);
  const { filterTask } = useSelector((state) => state);
  const { taskVisible } = useSelector((state) => state);
  const { permissions } = useSelector((state) => state);
  const { vinculatedUsers } = useSelector((state) => state);
  const { seeAdminSet } = useSelector((state) => state);
  const { taskStates } = useSelector((state) => state);
  const { tasks } = useSelector((state) => state);
  const { notifications } = useSelector((state) => state);

  function sumNotification(type, taskId, object) {
    if (type === 1) {
      if (notifications.length > 0) {
        let taskNotification = [...notifications];
        let isNewNotification = true;

        taskNotification.map((notification) => {
          if (notification.task_id === taskId) {
            if (notification.content.object) {
              notification.content.message += 1;
              notification.content.amount += 1;
              notification.content.object = [
                ...notification.content.object,
                object,
              ];
              isNewNotification = false;
            }
          }
        });

        if (isNewNotification) {
          const notification = {
            task_id: taskId,
            content: { message: 1, amount: 1, object: [object] },
          };
          dispatch(getNotifications([...taskNotification, notification]));
        } else {
          dispatch(getNotifications([...taskNotification]));
        }
      } else {
        const notification = {
          task_id: taskId,
          content: { message: 1, amount: 1, object: [object] },
        };
        dispatch(getNotifications([notification]));
      }
    } else {
      if (notifications.length > 0) {
        let taskNotification = [...notifications];
        let isNewNotification = true;

        taskNotification.map((notification) => {
          if (notification.task_id === taskId) {
            if (notification.content && notification.content.object) {
              isNewNotification = false;
              notification.content.amount += 1;
              notification.content.object = [
                ...notification.content.object,
                object,
              ];
            }
          }
        });

        if (isNewNotification) {
          const notification = {
            task_id: taskId,
            content: { message: 0, amount: 1, object: [object] },
          };
          dispatch(getNotifications([...taskNotification, notification]));
        } else {
          dispatch(getNotifications([...taskNotification]));
        }
      } else {
        const notification = {
          task_id: taskId,
          content: { message: 0, amount: 1, object: [object] },
        };
        dispatch(getNotifications([notification]));
      }
    }
  }

  useEffect(() => {
    if (
      webSocket.message !== "" &&
      webSocket.message !== undefined &&
      webSocket.message.type === 1
    ) {
      //type 1 == Message
      let task = tasks.filter(
        (task) => Number(task.id) === Number(webSocket.message.task_id)
      );
      let user = vinculatedUsers.filter(
        (user) => Number(user.id) === Number(webSocket.message.send_user_id)
      );
      let taskIsVisible = false;

      if (task !== undefined && task[0]) {
        //verify if modal is open
        if (taskVisible.info && task[0]) {
          if (task[0].id === taskVisible.info.task_id) {
            taskIsVisible = true;
          }
        }

        // if modal is close show notification
        if (
          taskIsVisible === false &&
          permissions.id !== webSocket.message.send_user_id
        ) {
          console.log("notificacao");
          showNotification(
            task[0].description,
            user[0].name + ": " + webSocket.message.object.description,
            "info"
          );

          if (
            Notification.permission === "granted" &&
            document.hidden === true
          ) {
            const notification = new Notification(task[0].description, {
              body: user[0].name + ": " + webSocket.message.object.description,
            });

            window.focus();
            notification.close();
          }

          sumNotification(1, task[0].id, webSocket.message);
        } else if (permissions.id !== webSocket.message.send_user_id) {
          //verify if webchat is open
          if (webSocket.historic && webSocket.historic.length > 0) {
            //webchat open is not the same of modal
            if (webSocket.historic[0].task_id !== taskVisible.info.task_id) {
              showNotification(
                task[0].description,
                user[0].name + ": " + webSocket.message.object.description,
                "info"
              );

              if (
                Notification.permission === "granted" &&
                document.hidden === true
              ) {
                const notification = new Notification(task[0].description, {
                  body:
                    user[0].name + ": " + webSocket.message.object.description,
                });

                window.focus();
                notification.close();
              }

              sumNotification(1, task[0].id, { ...webSocket.message });
            }
          } else if (permissions.id !== webSocket.message.send_user_id) {
            showNotification(
              task[0].description,
              user[0].name + ": " + webSocket.message.object.description,
              "info"
            );

            if (
              Notification.permission === "granted" &&
              document.hidden === true
            ) {
              const notification = new Notification(task[0].description, {
                body:
                  user[0].name + ": " + webSocket.message.object.description,
              });

              window.focus();
              notification.close();
            }

            sumNotification(1, task[0].id, webSocket.message);
          }
        }

        dispatch(getWebSocketMessage(""));
      }
    } else if (
      webSocket.message !== "" &&
      webSocket.message !== undefined &&
      webSocket.message.type === 2
    ) {
      //type 2 == itens

      if (permissions.id !== webSocket.message.send_user_id) {
        let taskf = tasks.filter(
          (task) => task.id == webSocket.message.object.task_id
        );
        let user = vinculatedUsers.filter(
          (user) => Number(user.id) === Number(webSocket.message.send_user_id)
        );

        if (taskVisible.info && taskVisible.info.task_id === taskf[0].id) {
          if (webSocket.message.object.itemUp) {
            if (webSocket.message.object.remove) {
              taskVisible.task.task_item = taskVisible.task.task_item.filter(
                (item) => item.id !== webSocket.message.object.itemUp
              );
            } else {
              let newItem = true;
              taskVisible.task.task_item.map((item) => {
                // console.log(webSocket.message.object.itemUp);
                if (item.id === webSocket.message.object.itemUp.id) {
                  item.check = webSocket.message.object.itemUp.check;
                  item.description =
                    webSocket.message.object.itemUp.description;
                  item.yes_no = webSocket.message.object.itemUp.yes_no;
                  newItem = false;
                }
              });

              if (newItem) {
                taskVisible.task.task_item = [
                  ...taskVisible.task.task_item,
                  webSocket.message.object.itemUp,
                ];
              }
            }
          }
          taskVisible.info.percent = webSocket.message.object.percent;
        } else {
          if (taskf[0]) {
            sumNotification(2, taskf[0].id, webSocket.message);
          }
        }

        let tasksUp = [...tasks];

        tasksUp.map((task) => {
          if (task.id == webSocket.message.object.task_id) {
            task.percent = webSocket.message.object.percent;
            showNotification(
              taskf[0].description,
              webSocket.message.object.description + " por " + user[0].name,
              "info"
            );

            if (
              Notification.permission === "granted" &&
              document.hidden === true
            ) {
              const notification = new Notification(taskf[0].description, {
                body:
                  webSocket.message.object.description + " por " + user[0].name,
              });

              window.focus();
              notification.close();
            }
          }
        });

        dispatch(getTask([...tasksUp]));
      }
    } else if (
      webSocket.message !== "" &&
      webSocket.message !== undefined &&
      webSocket.message.type === -1
    ) {
      // type -1 = state of connection

      if (permissions.id !== webSocket.message.send_user_id) {
        const state = webSocket.message.state;
        let user = vinculatedUsers.filter(
          (user) => Number(user.id) === Number(webSocket.message.send_user_id)
        );
        const userId = webSocket.message.send_user_id;

        if (state === "connected" && user[0]) {
          dispatch(addUsersOnline(userId));
          showNotification(user[0].name, "Acabou de entrar", "info");
        } else if (user[0]) {
          let users = [...webSocket.users];
          let item;
          let indexRemove;

          users.forEach((id, index) => {
            if (id == userId) {
              item = id;
              indexRemove = index;
              id = -1;
            }
          });

          users.splice(item, indexRemove);
          dispatch(getUsersOnline([...users]));
          dispatch(removeUsersOnline(userId));
          showNotification(user[0].name, "Acabou de sair", "info");
        }
      }
    } else if (
      webSocket.message !== "" &&
      webSocket.message !== undefined &&
      webSocket.message.type === -2
    ) {
      // type -2 == users online;

      if (!webSocket.message.error) {
        dispatch(getUsersOnline([...webSocket.message.user]));
      }
    } else if (
      webSocket.message !== "" &&
      webSocket.message !== undefined &&
      webSocket.message.type === 3
    ) {
      //type 3 == descriptions

      if (
        webSocket.message.object &&
        permissions.id !== webSocket.message.send_user_id
      ) {
        let task = filterTask.filter.filter(
          (task) => task.id == webSocket.message.object.task_id
        );
        let user = vinculatedUsers.filter(
          (user) => Number(user.id) === Number(webSocket.message.send_user_id)
        );

        const info = webSocket.message.object.update
          ? webSocket.message.object.update
          : webSocket.message.object.full_description;
        const taskId = webSocket.message.task_id;

        let tasksUp = [...tasks];
        if (webSocket.message.object.update) {
          tasksUp.map((task) => {
            if (task.id == taskId) {
              task.description = info;
            }
          });

          dispatch(getTask([...tasksUp]));

          if (taskVisible.info && taskVisible.info.task_id === taskId) {
            // dispatch(sendInfoModal({...taskVisible.info,description:info}))
            taskVisible.info.description = info;
          } else {
            sumNotification(3, task[0].id, webSocket.message);
          }
        } else {
          if (taskVisible.info && taskVisible.info.task_id === taskId) {
            dispatch(
              taskInfoShow({ ...taskVisible.task, full_description: info })
            );
          } else {
            sumNotification(3, task[0].id, webSocket.message);
          }
        }

        showNotification(
          task[0].description,
          webSocket.message.object.description + " por " + user[0].name,
          "info"
        );

        if (Notification.permission === "granted" && document.hidden === true) {
          const notification = new Notification(task[0].description, {
            body: webSocket.message.object.description + " por " + user[0].name,
          });

          window.focus();
          notification.close();
        }
      }
    } else if (
      webSocket.message !== "" &&
      webSocket.message !== undefined &&
      webSocket.message.type === 4
    ) {
      //type 4 == priority

      if (permissions.id !== webSocket.message.send_user_id) {
        let task = filterTask.filter.filter(
          (task) => task.id == webSocket.message.object.task_id
        );
        let user = vinculatedUsers.filter(
          (user) => Number(user.id) === Number(webSocket.message.user_id)
        );

        if (webSocket.message.object.update) {
          const info = Number(webSocket.message.object.update);
          const taskId = webSocket.message.task_id;

          let tasksUp = [...tasks];

          tasksUp.map(
            (task) => task.id == taskId && (task.priority = info > 0 ? info : 0)
          );

          dispatch(getTask([...tasksUp]));
        }

        if (!(taskVisible.info && taskVisible.info.task_id === task[0].id)) {
          sumNotification(4, task[0].id, webSocket.message);
        }

        showNotification(
          task[0].description,
          webSocket.message.object.description + " por " + user[0].name,
          "info"
        );

        if (Notification.permission === "granted" && document.hidden === true) {
          const notification = new Notification(task[0].description, {
            body: webSocket.message.object.description + " por " + user[0].name,
          });

          window.focus();
          notification.close();
        }
      }
    } else if (
      webSocket.message !== "" &&
      webSocket.message !== undefined &&
      webSocket.message.type === 5
    ) {
      // type 5 == vinculated or remove user
      // *add update for visualisation of adm
      const changeUser = Number(webSocket.message.object.changeUser);
      let user = vinculatedUsers.filter(
        (user) => Number(user.id) === Number(changeUser)
      );
      // console.log(webSocket.message);
      if (permissions.id !== webSocket.message.send_user_id && user[0]) {
        // console.log(webSocket.message);

        const msg = webSocket.message.object.description;

        if (msg.includes("vinculado")) {
          takeTask(webSocket.message.task_id).then((response) => {
            if (response) {
              let task = response;

              // console.log(task);

              if (!(taskVisible.info && taskVisible.info.task_id === task.id)) {
                sumNotification(5, task.id, webSocket.message);
              }

              task[0].focus = true;

              if (permissions.id === changeUser) {
                showNotification(task[0].description, "Você " + msg, "info");

                if (
                  Notification.permission === "granted" &&
                  document.hidden === true
                ) {
                  const notification = new Notification(
                    webSocket.message.object.task.description,
                    {
                      body: "Você " + msg,
                    }
                  );

                  window.focus();
                  notification.close();
                }

                if (seeAdminSet === false) {
                  dispatch(getTask([...tasks, task[0]]));
                }
              } else {
                showNotification(
                  task[0].description,
                  user[0].name + " " + msg,
                  "info"
                );

                if (
                  Notification.permission === "granted" &&
                  document.hidden === true
                ) {
                  const notification = new Notification(task[0].description, {
                    body: user[0].name + " " + msg,
                  });

                  window.focus();
                  notification.close();
                }
              }
            }
          });
        } else if (permissions.id === changeUser) {
          const tasksf = tasks.filter(
            (taskr) => taskr.id !== webSocket.message.task_id
          );
          if (seeAdminSet === false) {
            dispatch(getTask([...tasksf]));
          }
        }
      }
    } else if (
      webSocket.message !== "" &&
      webSocket.message !== undefined &&
      webSocket.message.type === 6
    ) {
      //type 6 change state
      if (permissions.id !== webSocket.message.send_user_id) {
        const info = webSocket.message.object;
        let user = vinculatedUsers.filter(
          (user) => Number(user.id) === Number(webSocket.message.send_user_id)
        );

        if (taskVisible.info && taskVisible.info.task_id === info.task_id) {
          taskVisible.info.state_id = webSocket.message.object.state_id;
          if (webSocket.message.object.new_final_date) {
            taskVisible.info.final_date =
              webSocket.message.object.new_final_date;
          }
        } else {
          sumNotification(6, info.task_id, webSocket.message);
        }

        let isNewDate = false;

        const task = tasks.filter((task) => task.id === info.task_id);
        const lastState = taskStates.filter(
          (state) => Number(state.id) === Number(task[0].state_id)
        );
        const newState = taskStates.filter(
          (state) => Number(state.id) === Number(info.state_id)
        );

        let tasksUp = [...tasks];

        tasksUp.map((task) => {
          if (task.id === info.task_id) {
            task.state_id = info.state_id;
            task.percent = info.percent;
            if (webSocket.message.object.new_final_date) {
              task.final_date = webSocket.message.object.new_final_date;
              isNewDate = true;
            }
          }
        });

        dispatch(getTask([...tasksUp]));

        if (isNewDate) {
          const date = formatDate(webSocket.message.object.new_final_date);
          showNotification(
            info.description,
            "A tarefa foi adiada para " + date,
            "info"
          );

          if (
            Notification.permission === "granted" &&
            document.hidden === true
          ) {
            const notification = new Notification(info.description, {
              body: "A tarefa foi adiada para " + date,
            });

            window.focus();
            notification.close();
          }
        } else {
          showNotification(
            task[0].description,
            "Mudou de " +
              lastState[0].description +
              " para " +
              newState[0].description +
              " por " +
              user[0].name,
            "info"
          );
        }
      }
    } else {
    }
  }, [webSocket.message]);

  async function takeTask(taskId) {
    try {
      const { data } = await api.get(
        `GTPP/Task.php?AUTH=${permissions.session}&app_id=3&simple&id=${taskId}`
      );

      if (data.error === true) {
        return [{}];
      } else {
        return data.data;
      }
    } catch (error) {
      return [{}];
    }
  }

  function formatDate(props) {
    let data = props.split("-");
    var day = data[2];
    var month = data[1];
    var year = data[0];
    return day + "/" + month + "/" + year;
  }

  return (
    <div className="header-area">
      <div className="container-custom">
        <div className="left-area">
          <InfoUser />
          <SearchTask />
        </div>
        <div className="right-area">
          <CreateTask />
          <LoadTasks />
          <VisionMenu />
          <OrderTasks />
          <ButtonFilter />
          <ButtonLogoff />
        </div>
      </div>
    </div>
  );
}

export default Header;
