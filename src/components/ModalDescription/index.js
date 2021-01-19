import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTaskFilter, taskVisibleUpdate, updateModal, updateTask } from "../../redux";
import api from "../../services/api";
import "./style.css";
// import ConfirmAction from "../ConfirmAction";

let ModalDescription = (props) => {
  const dispatch = useDispatch();
  const { permissions } = useSelector((state) => state);
  const { taskVisible } = useSelector((state) => state);
  const { filterTask } = useSelector((state) => state);
  const [showConfirmDeleteTask, setShowConfirmDeleteTask] = useState(false);
  const [fullDescription, setFullDescription] = useState(props.description);
  const [fullDescBack, setFullDescBack] = useState(fullDescription);

  async function deleteTask(taskId) {
    const AUTH = permissions.session;

    try {
      const {data}  = await api.delete(
        "GTPP/Task.php?AUTH=" + AUTH + "&app_id=3&id=" + taskId
      );

      if(data.error === true){
        let msg = data.message;

        alert(msg);
        return null;
      }

      // const filter = filterTask.filter(task => task.id !==taskId);
      // dispatch(getTaskFilter(filter));
      dispatch(taskVisibleUpdate());

      return data.data
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  return (
    <div className="modalDescription">
      <div id="menuDescription">
        <ul className="menuDescription">
          <li>
            <h2>{props.question}</h2>
            <textarea
              placeholder="Esta tarefa tem como objetivo..."
              spellCheck="false"
              rows="5"
              value={fullDescription}
              onChange={(e) =>
                permissions.administrator === 1 ||
                taskVisible.info.user_id === permissions.id
                  ? setFullDescription(e.target.value)
                  : alert("Você não tem permissão para realizar esta ação!")
              }
            ></textarea>
          </li>
          <li>
            <button
              style={{ width: 130 }}
              className="btnSaveDescription"
              onClick={() =>
                permissions.administrator === 1 ||
                taskVisible.info.user_id === permissions.id
                  ? (setFullDescBack(fullDescription),
                    props.updateDesc(fullDescription),
                    dispatch(updateModal()))
                  : (alert("Você não tem permissão para realizar esta ação!"),
                    props.setShowDesc(false))
              }
            >
              Salvar
            </button>

            <button
              className="btnCancel"
              onClick={() => {
                props.setShowDesc(false);
                setFullDescription(fullDescBack);
              }}
              style={{ margin: 0, width: 130 }}
            >
              Cancelar
            </button>
          </li>
          {(taskVisible.info.user_id === permissions.id ||
          permissions.administrator === 1) && props.showDelete===true ? (
            <li>
              <button
                className="btnDeleteTask"
                onClick={() => {
                  document.getElementById('menuDescription').style.display = 'none';
                  setShowConfirmDeleteTask(true)
                }}
              >
                Apagar
              </button>
            </li>
          ) : (
            ""
          )}
        </ul>
       
      </div>
      {showConfirmDeleteTask ? (
          <div className="confirmDelete">
            <h1>Tem certeza que deseja excluir esta tarefa?</h1>
            <div>
              <button onClick={() => {
                deleteTask(taskVisible.info.task_id).then(response => {
                  if(response!==null){
                    dispatch(updateTask());
                  }
                })
              }}>Confirmar</button>
              <button type="button" onClick={() => {
                props.setShowDesc(false);
                setShowConfirmDeleteTask(false)}}>Cancelar</button>
            </div>
          </div>
        ) : null}
    </div>
  );
};

export default ModalDescription;
