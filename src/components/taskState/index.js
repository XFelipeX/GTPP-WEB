import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import api from '../../services/api';
import { updateTask } from '../../redux';

// import useClickOutside from '../Button/index';

const TaskState = ({ task }) => {

  const { taskStates } = useSelector(state => state);
  const { permissions } = useSelector(state => state);
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();


  const updateState = async (id) => {
    try {
      api.put(`Task.php?AUTH=${permissions.session}`, {
        "id": task.id,
        "description": task.description,
        "full_description": task.full_description,
        "final_date": task.final_date,
        "state": id,
        "priority": task.priority,
        "user_id": task.user_id,
      }).then(() => {
        console.log("cai aqui")
        dispatch(updateTask())
        setShow(false);
      });

    } catch (error) {
      alert(error);
    }
  }

 
  
//   let domNode = useClickOutside(() =>{
//     setShow(false)
//   })

  return (
    <div className="menu" >
      {taskStates.map(state => (
        <React.Fragment key={state.id}>
          {
            state.id === task.state_id ?
              <button className="buttonState" color={state.color}>
                <h2>{state.description}</h2>
              </button> :
              null
          }
        </React.Fragment>
      ))}
    </div>
  );
}

export default TaskState;
