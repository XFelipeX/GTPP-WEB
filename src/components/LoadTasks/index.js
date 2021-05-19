import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateStateAdmin, updateTask } from "../../redux";
import { VscRefresh } from "react-icons/vsc";
import "./style.css";

let LoadTasks = () => {
  const dispatch = useDispatch();
  const { seeAdminSet } = useSelector((state) => state);

  function loadingTasks() {
    const element = document.getElementById("refresh-icon");
    element.classList.add("loading");
    if (seeAdminSet === true) {
      dispatch(updateStateAdmin());
    } else {
      dispatch(updateTask());
    }

    setTimeout(() => element.classList.remove("loading"), 1000);
  }

  return (
    <div className="load-tasks-area">
      <button className="button-refresh" onClick={() => loadingTasks()} title="Atualizar lista">
        <VscRefresh size={50} style={{ color: "#959595" }} id="refresh-icon" />
      </button>
    </div>
  );
};

export default LoadTasks;
