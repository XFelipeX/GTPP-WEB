import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './style.css';
import api from '../../services/api';
import { updateTask } from '../../redux';

// import useClickOutside from '../Button/index';

const TaskState = ({ task }) => {

  const { taskStates } = useSelector(state => state);
  const { permissions } = useSelector(state => state);
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();


  // const updateState = async (id) => {
  //   try {
  //     const {data} = api.put(`GTPP/Task.php?AUTH=${permissions.session}&app_id=3`, {
  //       "id": task.id,
  //       "description": task.description,
  //       "full_description": task.full_description,
  //       "final_date": task.final_date,
  //       "state": id,
  //       "priority": task.priority,
  //       "user_id": task.user_id,
  //     }).then(() => {
  //       console.log("cai aqui")
  //       dispatch(updateTask())
  //       setShow(false);
  //     });

  //     console.log(data);
  //   } catch (error) {
  //     alert(error);
  //   }
  // }

  // let stateColors ={
  //   backgroundColor:'red',
  // }
 

 
  
//   let domNode = useClickOutside(() =>{
//     setShow(false)
//   })

  return (
    <ul className="menu" >
      {taskStates.map(state => (
        <React.Fragment key={state.id}>
          {
            state.id == task.state_id ?
              
              <button className="buttonState" style={{backgroundColor:'#'+state.color}}>
                {/* {console.log(state.color)} */}
                <h2>{state.description}</h2>
              </button> :
              null
          }
        </React.Fragment>
      ))}
    </ul>
  );
}

export default TaskState;
