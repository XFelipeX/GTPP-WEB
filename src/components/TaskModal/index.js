import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "../../services/api";
import { addItem, changeItemChecked, deleteItem, updateDescription } from "./functions";
import { updateTask } from "../../redux";

import "./style.css";
import userImg from "../../assets/user@2x.png";
import { taskVisibleUpdate } from "../../redux";
import TaskTopicList from '../TaskTopicList';


import { AiOutlineUserAdd } from "react-icons/ai";
import { BiEdit } from "react-icons/bi";
import { setItemCheck } from "../../redux";
import { loadTask } from "./functions";



let TaskModal = ({ id = "modal" }) => {
  const dispatch = useDispatch();
  const { taskVisible } = useSelector((state) => state);
  const [fullDescription,setFullDescription] = useState(taskVisible.full_description);


  const { taskStates } = useSelector((state) => state);

  const { taskItemControl } = useSelector((state) => state);
  const [progress, setProgress] = useState();
  const [showDept, setShowDept] = useState(false);
  const [showDesc, setShowDesc] = useState(false);
  



 



 

  function updateFullDescription(taskId,description){
    updateDescription(taskId,description);
    setShowDesc(false);
    dispatch(updateTask());
  }

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
                          value={fullDescription}
                          onChange={(e) => setFullDescription(e.target.value)}
                        ></textarea>
                      </li>
                      <li>
                        <button className="btnSaveDescription" onClick={() => updateFullDescription(taskVisible.id,fullDescription)}>Salvar</button>
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

          <TaskTopicList/>

          {/* <h1>{taskVisible.id}</h1>
          <h1>{taskVisible.description}</h1> */}
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
