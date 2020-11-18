import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./style.css";
import userImg from "../../assets/user@2x.png";
import { taskVisibleUpdate } from "../../redux";
import { AiOutlineClockCircle } from "react-icons/ai";
import { FaTrash } from "react-icons/fa";
import { BiCommentAdd } from "react-icons/bi";
import { AiOutlineUserAdd } from "react-icons/ai";
import { BiEdit } from "react-icons/bi";

let TaskModal = ({ id = "modal", taskId }) => {
  // console.log(taskId)

  const dispatch = useDispatch();
  //   const {tasks} = useSelector((state) => state);
  const { taskVisible } = useSelector((state) => state);
  const { taskStates } = useSelector(state => state);
  const [showDept, setShowDept] = useState(false);

  console.log(taskVisible);
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
              <h2>
                <h1>Início </h1>{taskVisible.initial_date}
              </h2>
              <h2>
                <h1>Fim </h1>{taskVisible.final_date}
              </h2>

              {taskStates.map(state => (
        <React.Fragment key={state.id}>
          {
            state.id === taskVisible.state_id ?
              
              <button className="buttonState stateControl" style={{backgroundColor:'#'+state.color}}>
                {/* {console.log(state.color)} */}
                <h2>{state.description}</h2>
              </button> :
              null
          }
        </React.Fragment>
      ))}
            </div>

            <div className="comshopsubArea">
              <div className="row">
                <div className="col taskDescription">
                  <h1>Descrição</h1>
                  <BiEdit size="22"/>
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
              <h1>Itens da tarefa em 50%</h1>
              <AiOutlineClockCircle size="23" color="#353535" />
            </div>

            <div className="topicList">
              <div className="topic">
                <input type="checkbox" />
                <label>Tópico</label>
                <FaTrash />
              </div>

              <div className="topic">
                <input type="checkbox" />
                <label>Tópico</label>
                <FaTrash />
              </div>
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
