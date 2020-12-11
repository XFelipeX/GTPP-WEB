import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaTrash } from "react-icons/fa";
import { BiCommentAdd } from "react-icons/bi";
import { AiOutlineClockCircle, AiOutlineEdit } from "react-icons/ai";
import api from "../../services/api";
import {
  changeItemChecked,
  addItem,
  deleteItem,
  updateTopicDescription,
  takeHistoricTask
} from "./functions";
import { updateModal, updateTopic } from "../../redux";
import "./style.css";


const TaskTopicList = ({ id = "modalEdit" }) => {
  const {topicUpdate} = useSelector(state => state);
  const { taskVisible } = useSelector((state) => state);
  const { modalUpdate } = useSelector((state) => state);
  const [newItem, setNewItem] = useState("");
  const [taskItem, setTaskItem] = useState([{}]);
  const [showEdit, setShowEdit] = useState(false);
  const [showHistoric, setShowHistoric] = useState(false);

  const [editDescription, setEditDescription] = useState();
  const [idItem, setIdItem] = useState();
  const [taskHistoric,setTaskHistoric] = useState([]);
  const dispatch = useDispatch();


  const[loadItems,setLoadItems] = useState(false);

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
        setTaskItem(data.data);
      }

      return data;
    } catch (error) {
      console.log(error);
      return [{}];
    }
  }

  function changeInputCheck(e, taskId, itemId) {
    // tarefa bloqueada
    if (taskVisible.state_id == 5 || taskVisible.state_id == 4) {
      alert("A tarefa foi bloqueada!");
    } else if(taskVisible.state_id == 6){
      alert("Tarefa finalizada! clique no estado atual da tarefa para ativar novamente.")
    }
    else {
      // console.log(e)
      let check = !e;

      changeItemChecked(taskId, itemId, check).then((response) => {
        // console.log(response)
        taskVisible.progress = response.percent;
        taskVisible.state_id = response.state_id;
        dispatch(updateTopic());
      });
      // e.target.setAttribute("checked",check);

 
      // console.log(e)
    }



  }

  useEffect(() => {
    loadTaskItems();
    // dispatch(setInfoTask(taskItem));
  }, [topicUpdate]);

  function addNewItem(taskId, description) {
    if (taskVisible.state_id == 5 || taskVisible.state_id == 4) {
      alert("A tarefa foi bloqueada!");
      setNewItem("");
    }else if(taskVisible.state_id == 6){
      alert("Tarefa finalizada! clique no estado atual da tarefa para ativar novamente.")
    }
    
    else {
      if (description !== "") {
        addItem(taskId, description).then((response) => {
          // console.log(response)
          taskVisible.progress = response.percent;
          taskVisible.state_id = response.state_id;
        });
        dispatch(updateModal());
        dispatch(updateTopic());
        setNewItem("");
      }
    }
  }

  function deleteItemTopic(e, taskId, itemId) {
    e.preventDefault();
    if (taskVisible.state_id == 5 || taskVisible.state_id == 4) {
      alert("A tarefa foi bloqueada!");
    }else if(taskVisible.state_id == 6){
      alert("Tarefa finalizada! clique no estado atual da tarefa para ativar novamente.")
    }
     else {
      deleteItem(taskId, itemId).then((response) => {
        // console.log(response)
        taskVisible.progress = response.percent;
        taskVisible.state_id = response.state_id;
      });
      dispatch(updateModal());
      dispatch(updateTopic());
    }
  }

  function updateTopicItem(itemId, description, taskId) {
    if (taskVisible.state_id == 5 || taskVisible.state_id == 4) {
      alert("A tarefa foi bloqueada!");
    }else if(taskVisible.state_id == 6){
      alert("Tarefa finalizada! clique no estado atual da tarefa para ativar novamente.")
    }
     else{
      updateTopicDescription(itemId, description, taskId);
      setShowEdit(false);
      dispatch(updateModal());
      dispatch(updateTopic());
    }
    
  }

  // let domNode = useClickOutside(() =>{
  //   // console.log('oi')
  //   setShowHistoric(false);
  // })

  // const [loadHistoric, setLoadHistoric] = useState(false);


  return (
    <div className="taskTopicList">
      <div onClick={() => {}} className="taskTopicTop">
        <h1>Itens da tarefa em {taskVisible.progress}%</h1>
        <button type="button" onClick={() => (setShowHistoric(!showHistoric), takeHistoricTask(taskVisible.id).then(response => setTaskHistoric(response.data)))}>
          <AiOutlineClockCircle size="23" color="white" />
        </button>

        {showHistoric ? (
          <div id={id} className="modalHistoric" onClick={() => {}}>
            <div>
            <div className="btnCloseHistoric">
                <button
                  type="button"
                  style={{ backgroundColor: "#ff5251", color: "white" }}
                  onClick={() => setShowHistoric(false)}
                >
                  fechar
                </button>
              </div>
            <div className="modaHistoricContent">
             
              <div className="listHistoric" style={{clear: "both"}}>
                <div className="historicItems">
                {taskHistoric ? (

                taskHistoric.map((historic) => (
                    <ul key={historic.date_time}>
                      <li>{historic.description}  </li>
                      <li>{historic.date_time}</li>
                  </ul>
        ))
                ): null}

            
                </div>
              </div>
            </div>
            </div>
            
          </div>
        ) : null}
      </div>

      {/* alterar modelo de modal */}
      {showEdit && taskVisible.state_id != 5 ? (
        <div id={id} className="modalEdit" onClick={() => {}}>
          <div>
            <div className="btnEditTopic">
              <button
                type="button"
                style={{ backgroundColor: "#ff5251", color: "white" }}
                onClick={() => setShowEdit(false)}
              >
                Fechar
              </button>
              <button
                type="button"
                style={{ backgroundColor: "#69a312", color: "white" }}
                onClick={() =>
                  updateTopicItem(idItem, editDescription, taskVisible.id)
                }
              >
                Salvar
              </button>
            </div>
            <div className="descriptionTopic">
              <textarea
                spellcheck="false"
                rows="5"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
              ></textarea>
            </div>
          </div>
        </div>
      ) : null}

      <div className="topicList">
        {taskItem.map((item) =>
          item.id != null ? (
            <React.Fragment key={item.id}>
              {/* {console.log(item)} */}

              <div className="topic" >
                {/* {console.log(item.check)} */}

                <div className="topicLeft">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      changeInputCheck(item.check, taskVisible.id, item.id);
                    }}
                    checked={item.check}
                  />
                  <a
                    href=""
                    onClick={(e) => {
                      e.preventDefault();
                      setShowEdit(!showEdit);
                      setEditDescription(item.description);
                      setIdItem(item.id);
                    }}
                  >
                    <AiOutlineEdit className="topicEdit" size={20} color="#dddd" />
                  </a>
                </div>

                <div>
                  {/* <input type="checkbox"  onChange={() => {changeChecked(taskVisible.id,item.id,item.check)}} checked={item.check}/> */}
                  <label htmlFor="">{item.description}</label>
                </div>

                <div className="topicRight">
                  <a
                    href=""
                    onClick={(e) => deleteItemTopic(e, taskVisible.id, item.id)}
                  >
                    <FaTrash color="white" />
                  </a>
                </div>
              </div>
            </React.Fragment>
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
          <BiCommentAdd size="27" color="white" />
        </button>
      </div>
    </div>
  );
};

export default TaskTopicList;
