import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { orderTasks, updateTask } from "../../redux";
import "./style.css";
import lowPriority from "../../assets/Path1.png";
import medPriority from "../../assets/Path2.png";
import highPriority from "../../assets/Arrows.png";
import api from "../../services/api";
import useClickOutside from "../ClickOutside";
import Loading from "../Loading";

// import useClickOutside from '../Button/index';

const TaskPriority = ({ task }) => {
  const { permissions } = useSelector((state) => state);
  const [loading, setLoading] = useState(false);
  const AUTH = permissions.session;
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);

  //  function updatePriority(id) {
  //       // const auth = sessionStorage.getItem('token');
  //       try {
  //         let data = {};
  //         (async () => {
  //           data = await fetch(
  //             "http://192.168.0.99:71/GLOBAL/Controller/GTPP/Task.php?AUTH=" +
  //               AUTH +
  //               "&app_id=3",
  //             {
  //               method: "put",
  //               body: JSON.stringify({
  //                  id:task.id,
  //                  description: task.description,
  //                  priority:id
  //               }),
  //             }
  //           )
  //             .then((response) => {
  //               return response.json();
  //             })
  //             .then((r) => {
  //               setOpen(false);
  //               dispatch(updateTask());
  //               return r;
  //             })
  //             .catch((err) => {
  //               console.log(err);
  //             });

  //             console.log(data)
  //             let msg = data.message;

  //         if(msg.includes("Only the task creator or administrator can do this")){
  //           alert("Somente o criador da tarefa ou administrador pode fazer isto!")
  //         }

  //         })();

  //         // console.log(data)
  //       } catch (error) {

  //         // console.log(error);
  //       }

  //   }

  const updatePriority = async (id) => {
    // console.log(id, "entrei")

    try {
      const data = await api
        .put(`GTPP/Task.php?AUTH=${AUTH}&app_id=3`, {
          id: task.id,
          description: task.description,
          priority: id,
        })
        .then((response) => {
          dispatch(updateTask());
          dispatch(orderTasks());
          setLoading(true);
          setTimeout(() => {
            setLoading(false);
          }, 1200);
          setOpen(false);
          return response;
        });

      // console.log(data);
    } catch (error) {
      let msg = error.message;

      if (msg.includes("Network Error")) {
        alert("Autorização Negada!");
      }

      msg = error.response.data.message;
      if (msg.includes("Only the task creator or administrator can do this")) {
        alert("Somente o criador da tarefa ou administrador pode fazer isto!");
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
    <div ref={domNode} className="containerPriority" value={task.priority}>
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
          <li onClick={() => updatePriority("0")}>
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
