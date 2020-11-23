import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateTask } from '../../redux'
import './style.css';
import lowPriority from '../../assets/Path1.png';
import medPriority from '../../assets/Path2.png';
import highPriority from '../../assets/Arrows.png';
import api from '../../services/api';

// import useClickOutside from '../Button/index';

const TaskPriority = ({ task }) => {

  const { permissions } = useSelector(state => state);
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);


  async function updatePriority(id) {
      const auth = sessionStorage.getItem('token');
      try {
        let data = {};
        (async () => {
          data = await fetch(
            "http://192.168.0.99:71/GLOBAL/Controller/GTPP/Task.php?AUTH=" +
              auth +
              "&app_id=3",
            {
              method: "put",
              body: JSON.stringify({
                 id:task.id,
                 description: task.description,
                 priority:id
              }),
            }
          )
            .then((response) => {
              return response.json();
            })
            .then((r) => {
              setOpen(false);
              dispatch(updateTask());
              return r;
            })
            .catch((err) => {
              // console.log(err);
            });

          if(data.error===true){
            alert("Somente o criador da tarefa ou administrador pode fazer isto!")
          }
        })();
      } catch (error) {
        console.log(error);
      }
    
  }

  // const updatePriority = async (id) => {
  //   // console.log(id, "entrei")
    

    

  //   //  try{
  //   //   const data = await api.put(`GTPP/Task.php?AUTH=${permissions.session}&app_id=3`, {
  //       "id":task.id,
  //       "description": task.description,
  //       "priority":id
  //   //   }).then((response) => {
  //   //     dispatch(updateTask())
  //   //     setOpen(false);
  //   //     return response;
  //   //   })

  //   //   console.log(data);
  //   //  }catch(error){
  //   //    console.log(error.message);
  //   //  } 
     
  //     // console.log(message);

  // }

//   let domNode = useClickOutside(() =>{
//     setShow(false)
//   })

  return (
    <div className="containerPriority" value={task.priority}>
      <div onClick={() => setOpen(!open)}>
        <img src={task.priority === 0 ? lowPriority : task.priority === 1 ? medPriority : highPriority} alt="prioridade" />
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
}

export default TaskPriority;
