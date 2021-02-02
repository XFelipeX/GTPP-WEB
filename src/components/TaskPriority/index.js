import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { orderTasks } from "../../redux";
import { store } from "react-notifications-component";
import "./style.css";
import lowPriority from "../../assets/Path1.png";
import medPriority from "../../assets/Path2.png";
import highPriority from "../../assets/Arrows.png";
import api from "../../services/api";
import useClickOutside from "../ClickOutside";
import Loading from "../Loading";
import { showNotification } from "../TaskModal/functions";

const TaskPriority = ({ task }) => {
  const { permissions } = useSelector((state) => state);
  const { filterTask } = useSelector((state) => state);
  const { webSocket } = useSelector((state) => state);
  const [loading, setLoading] = useState(false);
  const AUTH = permissions.session;
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);

  function SendInfo(msg, update) {
    if (msg !== "" && webSocket.websocketState === "connected") {
      try {
        let jsonString = {
          task_id: task.id,
          object: {
            description: msg,
            task_id: task.id,
            update: update == 0 ? -1 : update,
          },
          date_time: null,
          user_id: Number(permissions.id),
          type: 4,
        };
        webSocket.websocket.send(JSON.stringify(jsonString));
      } catch (error) {
        alert(error);
      }
    }
  }

  const updatePriority = async (id) => {
    try {
      const { data } = await api
        .put(`GTPP/Task.php?AUTH=${AUTH}&app_id=3`, {
          id: task.id,
          description: task.description,
          priority: id,
        })
        .then((response) => {
          setLoading(true);
          setTimeout(() => {
            setLoading(false);
          }, 1200);
          setOpen(false);

          filterTask.filter.map((taskChange) => {
            if (taskChange.id === task.id) {
              taskChange.priority = id;
            }
          });

          dispatch(orderTasks());
          return response;
        });

      if (data.error === true) {
        showNotification("Erro", data.message, "danger");
      } else {
        SendInfo("A prioridade da tarefa foi alterada", id);
        store.addNotification({
          title: "Sucesso",
          message: "A prioridade foi alterada",
          type: "success",
          container: "top-center",
          insert: "top",
          animationIn: ["animate__animated animate__fadeIn"],
          animationOut: ["animate__animated animate__fadeOut"],
          dismiss: {
            duration: 2000,
          },
          width: 400,
        });
      }
    } catch (error) {
      let msg = error.message;

      showNotification("Erro", error.message, "danger");

      if (msg.includes("Network Error")) {
        store.addNotification({
          title: "Aviso",
          message: "Autorização Negada",
          type: "warning",
          container: "top-center",
          insert: "top",
          animationIn: ["animate__animated animate__fadeIn"],
          animationOut: ["animate__animated animate__fadeOut"],
          dismiss: {
            duration: 2000,
          },
          width: 400,
        });
      }

      msg = error.response.data.message;
      if (msg.includes("Only the task creator or administrator can do this")) {
        store.addNotification({
          title: "Aviso",
          message:
            "Somente o criador da tarefa ou administrador pode fazer isto",
          type: "warning",
          container: "top-center",
          insert: "top",
          animationIn: ["animate__animated animate__fadeIn"],
          animationOut: ["animate__animated animate__fadeOut"],
          dismiss: {
            duration: 2000,
          },
          width: 400,
        });
      } else if (msg.includes("Task with this state cannot be modified")) {
        store.addNotification({
          title: "Aviso",
          message: "Tarefa neste estado não pode ser modificada",
          type: "warning",
          container: "top-center",
          insert: "top",
          animationIn: ["animate__animated animate__fadeIn"],
          animationOut: ["animate__animated animate__fadeOut"],
          dismiss: {
            duration: 2000,
          },
          width: 400,
        });
      }

      setOpen(false);
    }
  };

  let domNode = useClickOutside(() => {
    setOpen(false);
  });

  return loading == true ? (
    <Loading />
  ) : (
    <div
      ref={domNode}
      className="containerPriority"
      value={task.priority}
      style={
        task.focus === true
          ? { backgroundColor: "black", borderRadius: 50 + "%" }
          : {}
      }
    >
      <div
        onClick={() => setOpen(!open)}
        title={
          task.priority === 0
            ? "Prioridade Baixa"
            : task.priority === 1
            ? "Prioridade Média"
            : task.priority === 2
            ? "Prioridade Alta"
            : null
        }
      >
        <img
          src={
            task.priority === 0
              ? lowPriority
              : task.priority === 1
              ? medPriority
              : highPriority
          }
          alt="prioridade"
        />
      </div>

      {open ? (
        <ul className="options">
          <li onClick={() => updatePriority(0)}>
            <div>
              <img src={lowPriority} alt="prioridade" />
            </div>
            Baixa Prioridade
          </li>
          <li onClick={() => updatePriority(1)}>
            <div>
              <img src={medPriority} alt="prioridade" />
            </div>
            Media Prioridade
          </li>
          <li onClick={() => updatePriority(2)}>
            <div>
              <img src={highPriority} alt="prioridade" />
            </div>
            Alta Prioridade
          </li>
        </ul>
      ) : null}
    </div>
  );
};

export default TaskPriority;
