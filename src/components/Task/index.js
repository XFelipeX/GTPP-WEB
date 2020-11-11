import React, { useEffect, useState } from 'react';

import './style.css';
import { useSelector } from 'react-redux';
import TaskState from '../TaskState';
import TaskPriority from '../TaskPriority';
import TaskDate from '../TaskDate';
import TaskUsers from '../TaskUsers';
// import TaskDept from '../TaskDept'


const Task = ({ task }) => {

  const [photo, setPhoto] = useState('');

  const { userPhotos } = useSelector(state => state);
  const { visionMenu } = useSelector(state => state);

 
  // async function loadUserImage() {
  //   for (let index = 0; index < userPhotos.length; index++) {
  //     if (task.user_id === userPhotos[index].user_id) {
  //       setPhoto(userPhotos[index].photo)
  //     } else {
  //     }
  //   }
  // }

  // useEffect(() => {
  //   loadUserImage()
  // }, []);

  // setTimeout(() => {

  // }, 200);

  return (
    <li className="containerTask">
    
      <div className="taskName">
        <div className="tooltip" >
          <img src={photo} alt="" width='30' height='30' />
          <span className="tooltiptext">{task.user_name}</span>
        </div>
        <h2 >{task.description}</h2>
      </div>
      <div className="taskContent">
        {visionMenu.vinc === true ? <TaskUsers task={task} /> : null}
        {visionMenu.priority === true ? <TaskPriority task={task} /> : null}
        {visionMenu.state === true ? <TaskState task={task} /> : null}
        {visionMenu.date === true ? <TaskDate task={task} /> : null} 
        { <h2>{task.progress}%</h2>}
      </div>
      
    </li>
  );
}



export default Task;
