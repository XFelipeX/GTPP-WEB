import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { logOff } from "../../redux/userAuth/userAuthActions";
import { useHistory } from "react-router-dom";
import { BiExit } from "react-icons/bi";
import ConfirmAction from "../ConfirmAction";
import { useSelector } from "react-redux";
import "./style.css";

const ButtonLogoff = () => {
  const [showConfirmAction, setShowConfirmAction] = useState();
  const { webSocket } = useSelector((state) => state);
  const history = useHistory();
  let dispatch = useDispatch();

  function UserLogoff() {
    sessionStorage.removeItem("token");

    webSocket.websocket.close();

    dispatch(logOff());
    history.push("/");
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          const element = document.getElementById("buttonLogoffIcon");
          element.classList.add("buttonLogoffIcon");
          setTimeout(() => element.classList.remove("buttonLogoffIcon"), 1000);
          setShowConfirmAction(true);
        }}
        className="buttonLogoff"
        title="Sair"
      >
        <BiExit size={50} color="#959595" id="buttonLogoffIcon" />
      </button>

      {showConfirmAction ? (
        <ConfirmAction
          confirm={() => {}}
          question="Tem certeza que deseja sair"
          action={() => UserLogoff()}
          cancelAction={() => setShowConfirmAction(false)}
        />
      ) : null}
    </div>
  );
};

export default ButtonLogoff;
