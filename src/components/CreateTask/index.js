import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./style.css";
import lowPriority from "../../assets/Path1.png";
import medPriority from "../../assets/Path2.png";
import highPriority from "../../assets/Arrows.png";
import { getTask, getTaskFilter, updateStateAdmin, updateTask } from "../../redux";
import useClickOutside from "../ClickOutside";
import { BiCommentAdd } from "react-icons/bi";
import {showNotification} from '../../Utils/Notify';
import api from "../../services/api";


let CreateTask = () => {
  const dispatch = useDispatch();

  const [dateInitial, setDateInitial] = useState("");
  const [dateFinal, setDateFinal] = useState("");
  const [priority, setPriority] = useState("");
  const [description, setDescription] = useState("");
  const { permissions } = useSelector((state) => state);
  const { seeAdminSet } = useSelector((state) => state);
  const { filterTask } = useSelector((state) => state);
  const [open, setOpen] = useState(false);
  const [showPriority, setShowPriority] = useState(false);
  const auth = permissions.session;

  function showMenu() {
    const element = document.getElementById("createTaskIcon");
    element.classList.add("createTaskIcon");
    setTimeout(() => element.classList.remove("createTaskIcon"), 1000);
    setOpen(!open);
  }

  let domNode = useClickOutside(() => {
    setOpen(false);
    setShowPriority(false);
    clear();
  });

  function clear() {
    setPriority("");
    setDateFinal("");
    setDateInitial("");
    setDescription("");
  }

  async function createTask() {
    let object ={};
    if (
      description !== "" &&
      dateFinal !== "" &&
      dateInitial !== "" &&
      priority !== ""
    ) {
      try {
        const { data } = await api.post(
          "http://192.168.0.99:71/GLOBAL/Controller/GTPP/Task.php?AUTH=" +
            auth +
            "&mobile=1&app_id=3",
          {
            description: description,
            priority: priority,
            initial_date: dateInitial,
            final_date: dateFinal,
          }
        );

        // console.log(data);

        if (data.error === true) {
          let msg = data.message;

          if (msg.includes("Authorization denied")) {
            showNotification("Erro", "Autorização negada", "danger");
          } else if (
            msg.includes("The final_date may not be less than the current date")
          ) {
            showNotification(
              "Erro",
              "A data final não pode ser menor que a data atual",
              "danger"
            );
          } else {
            showNotification("Erro", msg, "danger");
          }
        } else {
          object.id = data.last_id;
          object.description = description;
          object.priority = priority;
          object.initial_date = dateInitial;
          object.final_date = dateFinal;
          object.user_id = permissions.id;
          object.percent = 0;
          object.state_id = 1;
          object.csds = [];
          object.focus = true;
          setOpen(false);
         
            // dispatch(updateTask());
            dispatch(getTaskFilter([...filterTask.filter,object]))
          
          showNotification("Sucesso", "Nova tarefa foi adicionada", "success");

          clear();
        }
      } catch (error) {
        console.log(error.message);
      }
    } else {
      showNotification("Aviso", "Preencha todos os campos", "warning");
    }
  }

  let changePriority = (e) => {
    let select = document.getElementById("selectOption");

    let selectValue = select.value;
    let selectText = select.innerHTML;

    let aux;

    aux = e.target.value;
    e.target.value = selectValue;
    select.value = aux;

    aux = e.target.innerHTML;
    e.target.innerText = selectText;
    select.innerHTML = aux;

    setShowPriority(false);
    setPriority(select.value);
  };

  return (
    <div ref={domNode} className="create-task-area">
      <ul onClick={() => showMenu()} id="createTaskIcon" title="Criar tarefa">
        <BiCommentAdd size={50} color="#959595" />
      </ul>

      {open ? (
        <li className="menuCreateTask">
          <label htmlFor="">Tarefa:</label>
          <input
            onChange={(e) => setDescription(e.target.value)}
            type="text"
            id="taskDescription"
            placeholder="Nome da tarefa"
          />
          <label htmlFor="">Data Ínicio</label>
          <input
            type="date"
            id="startDate"
            onChange={(e) => {
              setDateInitial(e.target.value);
            }}
          />
          <label htmlFor="">Data Fim</label>
          <input
            type="date"
            id="finalDate"
            onChange={(e) => {
              setDateFinal(e.target.value);
            }}
          />
          <label htmlFor="">Prioridade</label>
          <ul className="menuPriority">
            <li
              value=""
              onClick={() => setShowPriority(!showPriority)}
              id="selectOption"
            >
              Selecione a prioridade
            </li>
            {showPriority ? (
              <>
                <li value="0" onClick={(e) => changePriority(e)}>
                  <img src={lowPriority} alt="" />
                  Baixa
                </li>
                <li value="1" onClick={(e) => changePriority(e)}>
                  <img src={medPriority} alt="" />
                  Média
                </li>
                <li value="2" onClick={(e) => changePriority(e)}>
                  <img src={highPriority} alt="" />
                  Alta
                </li>
              </>
            ) : null}
          </ul>
          <button type="button" onClick={createTask}>
            <BiCommentAdd size={40}/>
          </button>
        </li>
      ) : null}
    </div>
  );
};

export default CreateTask;
