import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadTaskItems, changeItemChecked} from "./functions";
import {updateTask} from '../../redux';
import {taskInfoShow} from '../../redux';
import "./style.css";
import userImg from "../../assets/user@2x.png";
import { taskVisibleUpdate } from "../../redux";
import { AiOutlineClockCircle } from "react-icons/ai";
import { FaTrash } from "react-icons/fa";
import { BiCommentAdd } from "react-icons/bi";
import { AiOutlineUserAdd } from "react-icons/ai";
import { BiEdit } from "react-icons/bi";

let TaskModal = ({ id = "modal" }) => {
  // console.log(taskId)

  const dispatch = useDispatch();
    const {tasks} = useSelector((state) => state);
  const { taskVisible } = useSelector((state) => state);
  const { taskStates } = useSelector((state) => state);
  const {stateUpdate} = useSelector(state => state);
  const {taskItemControl} = useSelector(state => state);
  const [showDept, setShowDept] = useState(false);
  const [showDesc, setShowDesc] = useState(false);
  const [taskItem, setTaskItem] = useState([{}]);


  // console.log(taskVisible);

  function changeChecked(taskId,itemId,check){
    changeItemChecked(taskId,itemId,check);
    dispatch(updateTask());
  }

  useEffect(() => {
   
  },[]);

  useEffect(() => {
    loadTaskItems(taskVisible.id).then((response) => {
      if (response.error === true) {
        //alert("error");
      } else {
        //console.log(response.data);
        setTaskItem(response.data);
        
        {tasks.map((task) => (
          task.id === taskVisible.id ? dispatch(taskInfoShow(task)) : null
        ))}
        
        // console.log(taskVisible.progress)
      }
    });

   
   
  }, [stateUpdate]);

  // useEffect(() => {
  //   function changeChecked(taskId,itemId,check){
  //     changeItemChecked(taskId,itemId,check);
  //   }
    
  // },[])

  const handleOutsideClick = (e) => {
    if (e.target.id === id) dispatch(taskVisibleUpdate());
  };

  return (
    <div id={id} className="modal" onClick={handleOutsideClick}>
      <div className="modalContainer">
        <div className="modalHeader">
          <h1>{taskVisible.description}</h1>
          <button
            className="modalClose"
            onClick={() => dispatch(taskVisibleUpdate())}
          />
        </div>

        <div className="modalContent">
          <div className="taskInfo">
            <div className="row">
              <h1>Início : {taskVisible.initial_date}</h1>
              <h1>Fim : {taskVisible.final_date}</h1>

              {taskStates.map((state) => (
                <React.Fragment key={state.id}>
                  {state.id === taskVisible.state_id ? (
                    <button
                      className="buttonState stateControl"
                      style={{ backgroundColor: "#" + state.color }}
                    >
                      {/* {console.log(state.color)} */}
                      <h2>{state.description}</h2>
                    </button>
                  ) : null}
                </React.Fragment>
              ))}
            </div>

            <div className="comshopsubArea">
              <div className="row">
                <div className="col taskDescription">
                  <h1>Descrição</h1>
                  <BiEdit
                    size="22"
                    onClick={() => setShowDesc(!showDesc)}
                    className="btnEdit"
                  />
                  {showDesc ? (
                    <ul className="menuDescription">
                      <li>
                        <textarea
                          rows="5"
                          value={taskVisible.full_description}
                        ></textarea>
                      </li>
                      <li>
                        <button className="btnSaveDescription">Salvar</button>
                      </li>
                    </ul>
                  ) : null}
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <select>
                    <option>Selecione a companhia</option>
                    <option>Peg Pese</option>
                    <option>Frugal</option>
                    <option>Hetros</option>
                  </select>
                  <select>
                    <option>Selecione a loja</option>
                  </select>
                </div>
              </div>
              <div className="rowDept">
                <p onClick={() => setShowDept(!showDept)}>
                  Selecione os departamentos
                </p>

                {showDept ? (
                  <ul className="menuDept">
                    <li>
                      <label htmlFor="">1 TI</label>
                      <input type="checkbox" />
                    </li>
                    <li>
                      <label htmlFor="">1 TI</label>
                      <input type="checkbox" />
                    </li>
                    <li>
                      <label htmlFor="">1 TI</label>
                      <input type="checkbox" />
                    </li>
                    <li>
                      <label htmlFor="">1 TI</label>
                      <input type="checkbox" />
                    </li>
                  </ul>
                ) : null}
              </div>

              {/* <div className="rowControlDescription">
                <button className="btnSaveDescription">Salvar</button>
                <button className="btnEditDescription">Editar</button>
              </div> */}
            </div>
            <div className="usersVinculated">
              <div className="user">
                <div>
                  <img src={userImg} alt="" width="" />
                </div>
              </div>
              <div className="addUser">
                <div>
                  <AiOutlineUserAdd size="20" />
                </div>
              </div>
            </div>
          </div>

          <div className="taskTopicList">
            <div className="taskTopicTop">
              <h1>Itens da tarefa em {taskVisible.progress}%</h1>
              <AiOutlineClockCircle size="23" color="#353535" />
            </div>

            <div className="topicList">
              
              {taskItem.map(item => (
                  item.id !=null ?
                  <>
                  {/* {console.log(item)} */}
             
                  <div className="topic" key={item.id}>
                  {console.log(item.check)}
                  <input type="checkbox"  onChange={() => {changeChecked(taskVisible.id,item.id,!(item.check))}} checked={item.check}/>
                  <label htmlFor="">{item.description}</label>
                  <FaTrash/>
                </div>
            
              
                  </>
                  : null
              ))}
            </div>

            <div className="addTopic">
              <label>Add item</label>
              <input type="text" size="10" />

              <button>
                <BiCommentAdd size="27" color="#353535" />
              </button>
            </div>
          </div>

          {/* <h1>{taskVisible.id}</h1>
          <h1>{taskVisible.description}</h1> */}
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
