import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./style.css";
import { taskVisibleUpdate } from "../../redux";

let TaskModal = ({ id = "modal", taskId }) => {
  // console.log(taskId)

  const dispatch = useDispatch();
  //   const {tasks} = useSelector((state) => state);
  const { taskVisible } = useSelector((state) => state);
  const [showDept, setShowDept] = useState(false);

  console.log(taskVisible);
  const handleOutsideClick = (e) => {
    if (e.target.id === id) dispatch(taskVisibleUpdate());
  };

  return (
    <div id={id} className="modal" onClick={handleOutsideClick}>
      <div className="modalContainer">
        <div className="modalHeader">
          <h1>Nome da tarefa</h1>
          <button
            className="modalClose"
            onClick={() => dispatch(taskVisibleUpdate())}
          />
        </div>

        <div className="modalContent">
          <div className="taskInfo">
            <div className="row">
              <h2><h1>Início </h1>22/12/2020</h2>
              <h2><h1>Fim </h1>28/12/2020</h2>

              <button className="buttonState">
                <h2>State</h2>
              </button>
            </div>

            <div className="comshopsubArea">
              <div className="row">
                <div className="col">
                  <h1>Descrição</h1>
                  <textarea
                    cols="36"
                    rows="7"
                    readOnly
                    onClick={() => {}}
                  ></textarea>
                </div>
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

                  {/* <select>
                  <option>Selecione os Departamentos</option>
                  <input type="checkbox"/>
                  <option>Frugal</option>
                  <option>Hetros</option>
                </select> */}
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
              
              <div className="rowControlDescription">
                <button className="btnSaveDescription">Salvar</button>
                <button className="btnEditDescription">Editar</button>
              </div>
            </div>
            <div className="usersVinculated">
                <div className="user">
                    <h1>usuários</h1>
                </div>
            </div>
          </div>

          <div className="taskTopicList"></div>

          {/* <h1>{taskVisible.id}</h1>
          <h1>{taskVisible.description}</h1> */}
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
