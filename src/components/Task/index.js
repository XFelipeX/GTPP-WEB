import React, { useState, useEffect } from "react";
import "./style.css";
import { useSelector, useDispatch } from "react-redux";
import TaskState from "../TaskState";
import TaskPriority from "../TaskPriority";
import TaskDate from "../TaskDate";
import TaskUsers from "../TaskUsers";
import TaskModal from "../TaskModal";
import {
  taskInfoShow,
  sendInfoModal,
  taskInfoOwner,
  updateModal,
  getNotifications,
} from "../../redux";
import api from "../../services/api";
import { showNotification } from "../../Utils/Notify";
import TaskWarning from "../TaskWarning";
import ModalNotifications from "../ModalNotifications";
import useClickOutside from "../ClickOutside";
import ComShopDept from "../ComShopDept";

const Task = ({ task }) => {
  const { visionMenu } = useSelector((state) => state);
  const { userPhotos } = useSelector((state) => state);
  const { taskVisible } = useSelector((state) => state);
  const { webSocket } = useSelector((state) => state);
  const { permissions } = useSelector((state) => state);
  const { vinculatedUsers } = useSelector((state) => state);
  const { notifications } = useSelector((state) => state);
  const [showModal, setShowModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState();

  // console.log(task);
  const dispatch = useDispatch();

  async function loadTaskVisible(
    taskId,
    percent,
    description,
    initial_date,
    final_date,
    state_id,
    userId,
    priority,
    notificationsTask,
    warning
  ) {
    SendMessage();
    let newArray = [...notifications];

    newArray.map((notify) => {
      if (notify.task_id === task.id) {
        notify.content.amount = notify.content.message;
        notify.content.object = notify.content.object.filter(
          (object) => object.type === 1
        );
      }
    });

    dispatch(getNotifications([...newArray]));

    task.focus = false;
    const AUTH = permissions.session;
    try {
      let { data } = await api.get(
        "GTPP/Task.php?AUTH=" + AUTH + "&app_id=3&id=" + taskId
      );

      // console.log(data);

      if (data.error === true) {
        let msg = data.message;

        if (msg.includes("Authorization denied")) {
          showNotification("Erro", "Autorização negada", "danger");
        } else {
          showNotification("Erro", msg, "danger");
        }
      } else {
        dispatch(
          sendInfoModal(
            taskId,
            percent,
            description,
            initial_date,
            final_date,
            state_id,
            userId,
            priority,
            notificationsTask,
            warning
          )
        );
        dispatch(taskInfoShow(data.data));
        loadUserInfo();
      }
    } catch (error) {
      if (error.response) {
        let msg = error.response.data.message;

        if (msg.includes("Authorization denied")) {
          showNotification("Erro", "Autorização negada", "danger");
        } else {
          showNotification("Erro", msg, "danger");
        }
      } else {
        showNotification("Erro", String(error.message), "danger");
      }
    }
  }

  let photo = userPhotos.filter((user) => user.user_id == task.user_id);
  let user = vinculatedUsers.filter((user) => user.id == task.user_id);

  async function loadUserInfo() {
    let AUTH = permissions.session;
    let userId = task.user_id;
    try {
      let { data } = await api.get(
        "CCPP/Employee.php?AUTH=" + AUTH + "&app_id=3&id=" + userId
      );

      if (data.error === true) {
        let msg = data.message;

        if (msg.includes("Authorization denied")) {
          showNotification("Erro", "Autorização negada", "danger");
        } else {
          showNotification("Erro", msg, "danger");
        }
      } else {
        let photoUser = photo[0].photo;
        let info = data.data;
        info[0].photo = photoUser;

        dispatch(taskInfoOwner(info));
      }
    } catch (error) {
      showNotification("Erro", error.message, "danger");
    }
  }

  const [notification, setNotification] = useState(0);

  useEffect(() => {
    if (notifications.length > 0) {
      notifications.map((notification) => {
        if (notification.task_id === task.id) {
          let total = 0;

          total += notification.content.amount;

          if (total > 99) {
            setNotification("+99");
          } else if (total === 0) {
            setNotification(0);
          } else {
            setNotification(total);
          }
        }
      });
    }
  }, [notifications]);

  function SendMessage() {
    if (webSocket.websocketState === "connected") {
      try {
        let jsonString = {
          type: -2,
        };
        webSocket.websocket.send(JSON.stringify(jsonString));
      } catch (error) {
        alert(error);
      }
    }
  }

  let domNode = useClickOutside(() => {
    setShowNotifications(false);
  });

  return (
    <li
      className="containerTask"
      style={task.focus == true ? { backgroundColor: "#f29503" } : {}}
      ref={domNode}
    >
      <div className="tableLeft">
        <div
          style={
            notification === 0
              ? { backgroundColor: "transparent" }
              : { cursor: "pointer" }
          }
          className="tableNotification"
          onClick={() => notification > 0 && setShowNotifications(true)}
        >
          {notification > 0 && notification}
        </div>
        <div className="priority">
          {visionMenu.priority === true ? <TaskPriority task={task} /> : null}
        </div>
        {showNotifications && <ModalNotifications task={task} />}
      </div>

      <div className="taskName">
        <div className="tooltip">
          {photo[0] ? (
            <>
              <img src={photo[0].photo} alt="" width="30" height="30" />
              <span className="tooltiptext">{user[0].name}</span>
            </>
          ) : null}
        </div>
        <h2
          onClick={() => {
            dispatch(updateModal());
            loadTaskVisible(
              task.id,
              task.percent,
              task.description,
              task.initial_date,
              task.final_date,
              task.state_id,
              task.user_id,
              task.priority,
              task.notifications,
              task.warning
            );
            setShowModal(true);
          }}
        >
          {task.description}
        </h2>
        {showModal && taskVisible.info && taskVisible.task ? (
          <TaskModal
            close={() => setShowModal(false)}
            open={() => setShowModal(true)}
          />
        ) : null}
      </div>
      <div className="taskContent">
        <TaskWarning task={task} />
        {visionMenu.vinc === true ? <TaskUsers task={task} /> : null}
        {<ComShopDept task={task}/>}
        {visionMenu.state === true ? <TaskState task={task} /> : null}
        {visionMenu.date === true ? <TaskDate task={task} /> : null}
        {<h2>{task.percent}%</h2>}
      </div>
    </li>
  );
};

export default Task;
