import React, { useState } from "react";
import "./style.css";

let CreateTask = () => {
  const [open, setOpen] = useState(false);

  function showMenu() {
    setOpen(!open);
  }
  return (
    <div className="createTaskArea">
      <ul onClick={() => showMenu()}>criar tarefa</ul>

      {open ? (
        <li className="menu">
          <label htmlFor="">Tarefa:</label>
          <input type="text" id="task" placeholder="Nome da tarefa" />
          <label htmlFor="">Data ínicio</label>
          <input type="date" id="startDate" />
          <label htmlFor="">Data Final</label>
          <input type="date" id="finalDate" />
          <button type="button">Criar</button>
        </li>
      ) : null}
    </div>
  );
};

export default CreateTask;
