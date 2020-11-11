import React, { useState } from "react";
import { useEffect, useSelector } from "react-redux";
import "./style.css";
import api from "../../services/api";

let CreateTask = () => {
  const [dateInitial, setDateInitial] = useState("");
  const [dateFinal, setDateFinal] = useState("");

  const [open, setOpen] = useState(false);
  //const {permissions} = useSelector(state => state);
  const auth = sessionStorage.getItem("token");

  function showMenu() {
    setOpen(!open);
  }

  async function createTask() {
    let description = document.getElementById("taskDescription").value;

    if (description != '' && dateFinal != '' && dateInitial != '') {
      try {
        let data = {};

        (async () => {
          data = await fetch(
            "http://192.168.0.99:71/GLOBAL/Controller/GTPP/Task.php?AUTH=" +
              auth +
              "&mobile=1&app_id=3",
            {
              method: "post",
              body: JSON.stringify({
                description: description,
                priority: "",
                initial_date: `${dateInitial}`,
                final_date: `${dateFinal}`,
              }),
            }
          )
            .then((response) => {
              return response.json();
            })
            .then((r) => {
              return r;
            })
            .catch((err) => {
              console.log(err);
            });

          console.log(data);
          // if (data.erro === true) {
          //   //alert(data.message)
          //   console.log("entrei no error");
          //   return;
          // }
        })();
      } catch (error) {
        console.log(error);
      }
    }
  }

  return (
    <div className="createTaskArea">
      <ul onClick={() => showMenu()}>criar tarefa</ul>

      {open ? (
        <li className="menuCreateTask">
          <label htmlFor="">Tarefa:</label>
          <input
            type="text"
            id="taskDescription"
            placeholder="Nome da tarefa"
          />
          <label htmlFor="">Data ínicio</label>
          <input
            type="date"
            id="startDate"
            onChange={(e) => {
              setDateInitial(e.target.value);
            }}
          />
          <label htmlFor="">Data Final</label>
          <input
            type="date"
            id="finalDate"
            onChange={(e) => {
              setDateFinal(e.target.value);
            }}
          />
          <button type="button" onClick={createTask}>
            Criar
          </button>
        </li>
      ) : null}
    </div>
  );
};

export default CreateTask;
