import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateModal } from "../../redux";
import "./style.css";

let ModalDescription = (props) => {
  const dispatch = useDispatch();
  const { permissions } = useSelector((state) => state);
  const { taskVisible } = useSelector((state) => state);

  const [fullDescription, setFullDescription] = useState(props.description);
  const [fullDescBack, setFullDescBack] = useState(fullDescription);

  return (
    <div className="modalDescription">
      <div>
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
              style={{ margin: 0 }}
            >
              Cancelar
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ModalDescription;
