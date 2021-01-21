import React, { useState, useEffect } from "react";
import "./style.css";
import { useSelector, useDispatch } from "react-redux";
import TaskState from "../TaskState";
import TaskPriority from "../TaskPriority";
import TaskDate from "../TaskDate";
import TaskUsers from "../TaskUsers";
import TaskModal from "../TaskModal";
import { taskInfoShow, sendInfoModal, taskInfoOwner, updateModal } from "../../redux";
import api from "../../services/api";
import { store } from "react-notifications-component";
import TaskWarning from "../TaskWarning";

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
      duration: 2000,
    },
    width: 400,
  });
}

const Task = ({ task }) => {
  const { visionMenu } = useSelector((state) => state);
  const { userPhotos } = useSelector((state) => state);
  const { taskVisible } = useSelector((state) => state);
  const { permissions } = useSelector((state) => state);
  const { vinculatedUsers } = useSelector((state) => state);
  const [showModal, setShowModal] = useState(false);
  const [taskModal, setTaskModal] = useState();

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
    notifications,
    warning
  ) {
    task.focus = false;
    const AUTH = permissions.session;
    // console.log(task)
    try {
      let { data } = await api.get(
        "GTPP/Task.php?AUTH=" + AUTH + "&app_id=3&id=" + taskId
      );
      // console.log(taskVisible);

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
            notifications,
            warning,
          )
        );
        dispatch(taskInfoShow(data.data));
        loadUserInfo();
      }
    } catch (error) {
      if(error.response){
        let msg = error.response.data.message;

      if (msg.includes("Authorization denied")) {
        showNotification("Erro", "Autorização negada", "danger");
      } else {
        showNotification("Erro", msg, "danger");
      }
      }else{
        showNotification("Erro",String(error.message),"danger");
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
      // console.log(data)

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

      // console.log(taskVisible)
    } catch (error) {
      showNotification("Erro", error.message, "danger");
    }
  }

  // useEffect(() => {
  //   loadUserInfo();
  // }, []);

  // console.log(task)
  const [notification, setNotification] = useState(0);

  useEffect(() => {
    if (task.notifications[6].amount > 99) {
      setNotification("+99");
    } else if (task.notifications[6].amount === 0) {
      setNotification(0);
    } else {
      setNotification(task.notifications[6].amount);
    }
  }, [task.notifications[6].amount]);


  // console.log(task.focus)
  return (
    <li className="containerTask" style={task.focus==true ? {backgroundColor:"#f29503"} : {}}>
      <div className="tableLeft">
        <div
          style={notification === 0 ? { backgroundColor: "transparent" } : null}
          className="tableNotification"
        >
          {notification > 0 && notification}
        </div>
        <div className="priority">
          {visionMenu.priority === true ? <TaskPriority task={task} /> : null}
        </div>
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
            dispatch(updateModal())
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
          
        <TaskWarning task={task}/>
        {/* {visionMenu.shop === true ? <TaskShop task={task}/> : null}
        {visionMenu.company === true ? <TaskCompany task={task}/> : null} */}
        {visionMenu.vinc === true ? <TaskUsers task={task} /> : null}
        {visionMenu.state === true ? <TaskState task={task} /> : null}
        {visionMenu.date === true ? <TaskDate task={task} /> : null}
        {<h2>{task.percent}%</h2>}
      </div>
    </li>
  );
};

export default Task;
