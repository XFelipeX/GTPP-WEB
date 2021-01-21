import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  addUsersOnline,
  getTask,
  getTaskFilter,
  getUsersOnline,
  getWebSocketMessage,
  updateStateAdmin,
  updateTask,
  updateTopic,
} from "../../redux";
import ButtonLogoff from "../ButtonLogoff";
import CreateTask from "../CreateTask";
import VisionMenu from "../VisionMenu";
import ButtonFilter from "../ButtonFilter";
import InfoUser from "../InfoUser";
import LoadTasks from "../LoadTasks";
import OrderTasks from "../OrderTasks";
import { store } from "react-notifications-component";

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

  // console.log(taskStates);

  function sumNotification(type, taskId) {
    if (type === "messages") {
      filterTask.filter.map((task) => {
        if (task.id === taskId) {
          task.notifications[0].amount += 1;
          let total = 0;
          for (let i = 0; i < task.notifications.length - 1; i++) {
            total += task.notifications[i].amount;
          }

          // console.log(total);
          task.notifications[6].amount = total;
          return;
        }
      });
    }

    if (type === "reload") {
      filterTask.filter.map((task) => {
        if (task.id === taskId) {
          let total = 0;
          for (let i = 0; i < task.notifications.length - 1; i++) {
            total += task.notifications[i].amount;
          }

          // console.log(total);
          task.notifications[6].amount = total;
          return;
        }
      });
    }
  }

  useEffect(() => {
    if (
      webSocket.message !== "" &&
      webSocket.message !== undefined &&
      webSocket.message.type === 1
    ) {
      let task = filterTask.filter.filter(
        (task) => task.id == webSocket.message.object.task_id
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
          permissions.id !== webSocket.message.user_id
        ) {
          showNotification(
            task[0].description,
            webSocket.message.user_name +
              ": " +
              webSocket.message.object.description,
            "info"
          );
          sumNotification("messages", task[0].id);
        } else if (permissions.id !== webSocket.message.user_id) {
          //verify if webchat is open
          if (webSocket.historic && webSocket.historic.length > 0) {
            //webchat open is not the same of modal
            if (webSocket.historic[0].task_id !== taskVisible.info.task_id) {
              showNotification(
                task[0].description,
                webSocket.message.user_name +
                  ": " +
                  webSocket.message.object.description,
                "info"
              );

              sumNotification("messages", task[0].id);
            }
          } else if (permissions.id !== webSocket.message.user_id) {
            showNotification(
              task[0].description,
              webSocket.message.user_name +
                ": " +
                webSocket.message.object.description,
              "info"
            );

            sumNotification("messages", task[0].id);
          }
        }

        // if the user what send de message is not the same receive
        // if(permissions.id!==Number(webSocket.message.user_id && sumOrNo===true)){

        // }

        // alert(webSocket.message.user_name + ": " + webSocket.message.object);
        dispatch(getWebSocketMessage(""));
      }
    } else if (
      webSocket.message !== "" &&
      webSocket.message !== undefined &&
      webSocket.message.type === 2
    ) {
      //type 2 == itens

      // let taskIsVisible = false;

      if (permissions.id !== webSocket.message.user_id) {
        let taskf = filterTask.filter.filter(
          (task) => task.id == webSocket.message.object.task_id
        );
        if (taskVisible && taskVisible.info.task_id) {
          if (webSocket.message.object.itemUp) {
            if (webSocket.message.object.remove) {
              taskVisible.task.task_item = taskVisible.task.task_item.filter(
                (item) => item.id !== webSocket.message.object.itemUp
              );
            } else {
              let newItem = true;
              taskVisible.task.task_item.map((item) => {
                console.log(webSocket.message.object.itemUp);
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
        }

        // console.log(webSocket.message);
        let tasksUp = [...filterTask.filter];

        tasksUp.map((task) => {
          if (task.id == webSocket.message.object.task_id) {
            task.percent = webSocket.message.object.percent;
            showNotification(
              taskf[0].description,
              webSocket.message.object.description +
                " por " +
                webSocket.message.user_name,
              "info"
            );
          }
        });

        dispatch(getTask([...tasksUp]));
      }
    } else if (
      webSocket.message !== "" &&
      webSocket.message !== undefined &&
      webSocket.message.type === -1
    ) {
      if (permissions.id !== webSocket.message.user_id) {
        const state = webSocket.message.state;
        const userName = webSocket.message.user_name;
        const userId = webSocket.message.user_id;

        if (state === "connected") {
          dispatch(addUsersOnline(userId));
          showNotification(userName, "Acabou de entrar", "info");
        } else {
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
          // console.log(users);
          dispatch(getUsersOnline([...users]));
          dispatch(removeUsersOnline(userId));
          showNotification(userName, "Acabou de sair", "info");
        }
      }

      // console.log(webSocket.message)
    } else if (
      webSocket.message !== "" &&
      webSocket.message !== undefined &&
      webSocket.message.type === -2
    ) {
      // console.log(webSocket);

      if (!webSocket.message.error) {
        dispatch(getUsersOnline([...webSocket.message.user]));
      }
    } else if (
      webSocket.message !== "" &&
      webSocket.message !== undefined &&
      webSocket.message.type === 3
    ) {
      // console.log(webSocket);
      //type 3 == descriptions

      if (
        webSocket.message.object &&
        permissions.id !== webSocket.message.user_id
      ) {
        let task = filterTask.filter.filter(
          (task) => task.id == webSocket.message.object.task_id
        );
        // console.log(tasks);
        const info = webSocket.message.object.update
          ? webSocket.message.object.update
          : webSocket.message.object.full_description;
        const taskId = webSocket.message.task_id;

        let tasksUp = [...filterTask.filter];
        if (webSocket.message.object.update) {
          tasksUp.map((task) => {
            if (task.id == taskId) {
              task.description = info;
            }
          });

          if (taskVisible && taskVisible.info.task_id===taskId) {
            taskVisible.info.description = info;
          }

          dispatch(getTask([...tasksUp]));
        } else {
        
          if (taskVisible && taskVisible.info.task_id===taskId) {
            taskVisible.task.full_description = info;
          }
        }

        showNotification(
          task[0].description,
          webSocket.message.object.description +
            " por " +
            webSocket.message.user_name,
          "info"
        );
      }
    } else if (
      webSocket.message !== "" &&
      webSocket.message !== undefined &&
      webSocket.message.type === 4
    ) {
      //type 4 == priority
      let task = filterTask.filter.filter(
        (task) => task.id == webSocket.message.object.task_id
      );

      if (webSocket.message.object.update) {
        // console.log(tasks);
        const info = Number(webSocket.message.object.update);
        const taskId = webSocket.message.task_id;

        // console.log(info)

        let tasksUp = [...filterTask.filter];

        tasksUp.map(
          (task) => task.id == taskId && (task.priority = info > 0 ? info : 0)
        );

        dispatch(getTask([...tasksUp]));

        //  task[0].priority = info;
      }

      if (permissions.id !== webSocket.message.user_id) {
        showNotification(
          task[0].description,
          webSocket.message.object.description +
            " por " +
            webSocket.message.user_name,
          "info"
        );
      }
    } else if (
      webSocket.message !== "" &&
      webSocket.message !== undefined &&
      webSocket.message.type === 5
    ) {
      // type 5 == users
      // *add update for visualisation of adm
      const changeUser = Number(webSocket.message.object.changeUser);
      const msg = webSocket.message.object.description;
      const task = webSocket.message.object.task;

      task.focus = true;

      let user = vinculatedUsers.filter((user) => user.id === changeUser);

      if (permissions.id !== webSocket.message.user_id) {
        if (permissions.id === changeUser) {
          showNotification(
            webSocket.message.object.task.description,
            "Você " + msg,
            "info"
          );

          if (msg.includes("vinculado")) {
            if (seeAdminSet === false) {
              dispatch(getTask([...filterTask.filter, task]));
            }
          } else {
            const tasksf = filterTask.filter.filter(
              (taskr) => taskr.id !== task.id
            );
            if (seeAdminSet === false) {
              dispatch(getTask([...tasksf]));
            }
          }
        } else {
          showNotification(
            webSocket.message.object.task.description,
            user[0].user + " " + msg,
            "info"
          );
        }
      } else if (permissions.id !== webSocket.message.user_id) {
        // showNotification(
        //   webSocket.message.object.task.description,
        //   "Você " + msg,
        //   "info"
        // );
      }

      // console.log(vinculatedUsers);

      //;console.log(webSocket.message);
    } else if (
      webSocket.message !== "" &&
      webSocket.message !== undefined &&
      webSocket.message.type === 6
    ) {
      //type 6 change state
      if (permissions.id !== webSocket.message.user_id) {
        if (taskVisible && taskVisible.info.task_id) {
          taskVisible.info.state_id = webSocket.message.object.task.state_id;
          // dispatch(updateTopic());
        }

        // console.log(webSocket.message);

        const info = webSocket.message.object.task;
        const task = filterTask.filter.filter(
          (task) => task.id === info.task_id
        );
        const lastState = taskStates.filter(
          (state) => Number(state.id) === Number(task[0].state_id)
        );
        const newState = taskStates.filter(
          (state) => Number(state.id) === Number(info.state_id)
        );

        // console.log(task,lastState,newState)

        let tasksUp = [...filterTask.filter];

        tasksUp.map((task) => {
          if (task.id === info.task_id) {
            task.state_id = info.state_id;
            task.percent = info.percent;
          }
        });

        dispatch(getTask([...tasksUp]));

        // console.log(info,lastState[0])

        showNotification(
          info.description,
          "Mudou de " +
            lastState[0].description +
            " para " +
            newState[0].description +
            " por " +
            webSocket.message.user_name,
          "info"
        );
      }

      // showNotification()
      // console.log(webSocket.message);
    } else {
    }

    // console.log(webSocket.message);
  }, [webSocket.message]);
  // console.log(webSocket)
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
