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
  const { tasks } = useSelector((state) => state);
  const { taskVisible } = useSelector((state) => state);
  const { permissions } = useSelector((state) => state);
  const { vinculatedUsers } = useSelector((state) => state);
  const { seeAdminSet } = useSelector((state) => state);

  function sumNotification(type, taskId) {
    if (type === "messages") {
      tasks.map((task) => {
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
      tasks.map((task) => {
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

  // useEffect(() => {
  //   sumNotification("reload",taskVisible.info.task_id);
  // },[webSocket.historic])

  // function ownVerify(sendId,receiveId){
  //   if(sendId===receiveId){
  //     return false;
  //   }else{
  //     return true;
  //   }
  // }

  useEffect(() => {
    // console.log(webSocket.message)

    if (
      webSocket.message !== "" &&
      webSocket.message !== undefined &&
      webSocket.message.type === 1
    ) {
      // console.log(webSocket.message.task_id)
      // console.log(webSocket.message);
      let task = tasks.filter(
        (task) => task.id == webSocket.message.message.task_id
      );

      let taskIsVisible = false;
      // let sumOrNo = false;

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
              webSocket.message.message.description,
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
                  webSocket.message.message.description,
                "info"
              );

              sumNotification("messages", task[0].id);
            }
          } else if (permissions.id !== webSocket.message.user_id) {
            showNotification(
              task[0].description,
              webSocket.message.user_name +
                ": " +
                webSocket.message.message.description,
              "info"
            );

            sumNotification("messages", task[0].id);
          }
        }

        // if the user what send de message is not the same receive
        // if(permissions.id!==Number(webSocket.message.user_id && sumOrNo===true)){

        // }

        // alert(webSocket.message.user_name + ": " + webSocket.message.message);
        dispatch(getWebSocketMessage(""));
      }
    } else if (
      webSocket.message !== "" &&
      webSocket.message !== undefined &&
      webSocket.message.type === 2
    ) {
      let task = tasks.filter(
        (task) => task.id == webSocket.message.message.task_id
      );

      // console.log(webSocket.message);
      //type 2 == itens

      if (permissions.id !== webSocket.message.user_id) {
        showNotification(
          task[0].description,
          webSocket.message.message.description +
            " por " +
            webSocket.message.user_name,
          "info"
        );
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
      let task = tasks.filter(
        (task) => task.id == webSocket.message.message.task_id
      );

      if (webSocket.message.message.update) {
        // console.log(tasks);
        const info = webSocket.message.message.update;
        const taskId = webSocket.message.task_id;

        tasks.map((task) => {
          if (task.id == taskId) {
            task.description = info;
          }
        });
      }

      if (permissions.id !== webSocket.message.user_id && task[0]) {
        showNotification(
          task[0].description,
          webSocket.message.message.description +
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
      let task = tasks.filter(
        (task) => task.id == webSocket.message.message.task_id
      );

      if (webSocket.message.message.update) {
        // console.log(tasks);
        const info = Number(webSocket.message.message.update);
        const taskId = webSocket.message.task_id;

        // console.log(info)

        tasks.map(
          (task) => task.id == taskId && (task.priority = info > 0 ? info : 0)
        );

        //  task[0].priority = info;
      }

      setTimeout(() => {
        if (permissions.id !== webSocket.message.user_id) {
          showNotification(
            task[0].description,
            webSocket.message.message.description +
              " por " +
              webSocket.message.user_name,
            "info"
          );
        }
      }, 4300);
    } else if (
      webSocket.message !== "" &&
      webSocket.message !== undefined &&
      webSocket.message.type === 5
    ) {
      // type 5 == users
      // if (seeAdminSet === true) {
      //   dispatch(updateStateAdmin());
      // } else {
      //   dispatch(updateTask());
      // }

      const changeUser = Number(webSocket.message.message.changeUser);
      const msg = webSocket.message.message.description;
      const task = webSocket.message.message.task;
      // let task = tasks.filter(
      //   (task) => task.id == Number(webSocket.message.task_id)
      // );

      task.focus = true;

      // console.log(task)
      let user = vinculatedUsers.filter((user) => user.id === changeUser);

      if (permissions.id !== webSocket.message.user_id) {
        if (permissions.id === changeUser) {
          showNotification(
            webSocket.message.message.task.description,
            "Você " + msg,
            "info"
          );

          if (msg.includes("vinculado")) {
            if (seeAdminSet === false) {
              dispatch(getTask([...tasks, task]));
            }
          } else {
            const tasksf = tasks.filter((taskr) => taskr.id !== task.id);
            if (seeAdminSet === false) {
              dispatch(getTask([...tasksf]));
            }
          }
        } else {
          showNotification(
            webSocket.message.message.task.description,
            user[0].user + " " + msg,
            "info"
          );
        }
      } else if (permissions.id !== webSocket.message.user_id) {
        // showNotification(
        //   webSocket.message.message.task.description,
        //   "Você " + msg,
        //   "info"
        // );
      }

      // console.log(vinculatedUsers);

      //;console.log(webSocket.message);
    }

    console.log(webSocket.message);
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
