import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaTrash } from "react-icons/fa";
import { BiCommentAdd } from "react-icons/bi";
import { AiOutlineClockCircle } from "react-icons/ai";
import api from "../../services/api";
import {changeItemChecked,addItem,deleteItem} from './functions';
import { taskInfoShow, taskProgress, getTask,updateTask } from "../../redux";
import "./style.css";

const TaskTopicList = () => {
  const { taskVisible } = useSelector((state) => state);
  const { stateUpdate } = useSelector((state) => state);
  const { tasks } = useSelector((state) => state);
  const [newItem, setNewItem] = useState("");
  const [taskItem, setTaskItem] = useState([{}]);
  const [infoTask,setInfoTask] = useState({});
  const dispatch = useDispatch();

  async function loadTaskItems() {
    const AUTH = sessionStorage.getItem("token");
    try {
      const { data } = await api.get("GTPP/TaskItem.php", {
        params: { AUTH: AUTH, app_id: 3, task_id: taskVisible.id },
      });
      // console.log(data)
      if (data.error === true) {
        //alert("error");
      } else {
        //console.log(response.data);
        // dispatch(setItemCheck(response.data));
        // console.log(taskVisible);
        setTaskItem(data.data);
        
        // tasks.map((task) =>
        //   task.id === taskVisible.id
        //     ? dispatch(taskInfoShow(task))
        //     : // console.log(task.progress)
        //       null
        // );

        // console.log(taskItemControl);

        //  console.log(taskVisible.progress)
      }

      return data;
    } catch (error) {
      alert("error items");
      return [{}];
    }
  }

  function changeInputCheck(e, taskId, itemId) {
    // console.log(e)
    let check = !e;

    changeItemChecked(taskId, itemId, check);
    // e.target.setAttribute("checked",check);

    dispatch(updateTask());
    // console.log(e)
  }

  useEffect(() => {
    loadTaskItems();
    // dispatch(setInfoTask(taskItem));
  }, [infoTask]);

  function addNewItem(taskId, description) {
    if (description !== "") {
      addItem(taskId, description);
      dispatch(updateTask());
      setNewItem("");
    }
  }

  function deleteItemTopic(e, taskId, itemId) {
    e.preventDefault();
    deleteItem(taskId, itemId);
    dispatch(updateTask());
  }

  useEffect(() => {
    async function loadTaskVisible(){
      let AUTH = sessionStorage.getItem('token');
      let {data} = await api.get('GTPP/Task.php?AUTH='+AUTH+'&app_id=3&mobile=1&task_id='+taskVisible.id);
      setInfoTask(data.data);
      console.log(data);
    }

    loadTaskVisible();
  },[stateUpdate])

  return (
    <div className="taskTopicList">
      <div className="taskTopicTop">
        <h1>Itens da tarefa em {infoTask.percent}%</h1>
        <AiOutlineClockCircle size="23" color="#353535" />
      </div>

      <div className="topicList">
        {taskItem.map((item) =>
          item.id != null ? (
            <>
              {/* {console.log(item)} */}

              <div className="topic" key={item.id}>
                {/* {console.log(item.check)} */}

                <input
                  type="checkbox"
                  onChange={(e) => {
                    changeInputCheck(item.check, taskVisible.id, item.id);
                  }}
                  checked={item.check}
                />
                {/* <input type="checkbox"  onChange={() => {changeChecked(taskVisible.id,item.id,item.check)}} checked={item.check}/> */}
                <label htmlFor="">{item.description}</label>
                <a
                  href=""
                  onClick={(e) => deleteItemTopic(e, taskVisible.id, item.id)}
                >
                  <FaTrash color="#ff5251" />
                </a>
              </div>
            </>
          ) : null
        )}
      </div>

      <div className="addTopic">
        <label>Add item</label>
        <input
          type="text"
          size="10"
          name="newItem"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
        />

        <button onClick={() => addNewItem(taskVisible.id, newItem)}>
          <BiCommentAdd size="27" color="#353535" />
        </button>
      </div>
    </div>
  );
};

export default TaskTopicList;
