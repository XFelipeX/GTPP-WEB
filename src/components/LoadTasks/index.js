import React from "react";
import { useDispatch } from "react-redux";
import { updateTask } from "../../redux";
import { VscRefresh } from "react-icons/vsc";
import "./style.css";

let LoadTasks = () => {
  const dispatch = useDispatch();

  function loadingTasks() {
    const element = document.getElementById("refresh-icon");
    element.classList.add("loading");
    dispatch(updateTask());
    setTimeout(() => element.classList.remove("loading"), 1000);
  }

  return (
    <div className="load-tasks-area">
      <button className="button-refresh" onClick={() => loadingTasks()}>
        <VscRefresh size={50} style={{ color: "#959595" }} id="refresh-icon" />
      </button>
    </div>
  );
};

export default LoadTasks;
