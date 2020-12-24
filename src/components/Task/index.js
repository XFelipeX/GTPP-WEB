import React,{useState,useEffect} from "react";
import "./style.css";
import { useSelector, useDispatch } from "react-redux";
import TaskState from "../TaskState";
import TaskPriority from "../TaskPriority";
import TaskDate from "../TaskDate";
import TaskUsers from "../TaskUsers";
import TaskModal from "../TaskModal";
import { taskInfoShow, sendInfoModal } from "../../redux";
import api from "../../services/api";

const Task = ({ task }) => {
  // const [photo, setPhoto] = useState('');

  // const { userPhotos } = useSelector(state => state);
  const { visionMenu } = useSelector((state) => state);
  const { userPhotos } = useSelector((state) => state);
  const { taskVisible } = useSelector((state) => state);
  // const [taskShow,setTaskShow] = useState({});
  // const {stateUpdate} = useSelector(state => state);
  const { permissions } = useSelector((state) => state);
  const { vinculatedUsers } = useSelector((state) => state);
  const [showModal,setShowModal] = useState(false);

  useEffect(() => {
    setShowModal(false);
  },[])


  const dispatch = useDispatch();

  async function loadTaskVisible(
    taskId,
    percent,
    description,
    initial_date,
    final_date,
    state_id,
    userId,
    priority
  ) {
    let auth = permissions.session;
    // console.log(task)
    try {
      let { data } = await api.get(
        "GTPP/Task.php?AUTH=" + auth + "&app_id=3&id=" + taskId
      );
      // console.log(taskVisible);

      dispatch(
        sendInfoModal(
          taskId,
          percent,
          description,
          initial_date,
          final_date,
          state_id,
          userId,
          priority
        )
      );
      dispatch(taskInfoShow(data.data));
    } catch (error) {
      let msg = error.response.data.message;

      if(msg.includes("Authorization denied")){
        alert("Autorização negada!")
      }
    }
  }

  let photo = userPhotos.filter((user) => user.user_id == task.user_id);
  let user = vinculatedUsers.filter((user) => user.id == task.user_id);

  // console.log(task)
  return (
    <li className="containerTask">
      {visionMenu.priority === true ? <TaskPriority task={task} /> : null}
      <div className="taskName">
        <div className="tooltip">
          {photo[0] ? (
            <>
              <img src={photo[0].photo} alt="" width="30" height="30" />
              <span className="tooltiptext">{user[0].user}</span>
            </>
          ) : null}
        </div>
        <h2
          onClick={() => {
            loadTaskVisible(
              task.id,
              task.percent,
              task.description,
              task.initial_date,
              task.final_date,
              task.state_id,
              task.user_id,
              task.priority
            );
            setShowModal(true)
          }}
        >
          {task.description}
        </h2>
        {showModal && taskVisible.info && taskVisible.task ? (
          <TaskModal close={() => setShowModal(false)}/>
        ) : null}
      </div>
      <div className="taskContent">
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
