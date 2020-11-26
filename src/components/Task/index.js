import React, { useEffect, useState } from 'react';
import './style.css';
import { useSelector, useDispatch } from 'react-redux';
import TaskState from '../TaskState';
import TaskPriority from '../TaskPriority';
import TaskDate from '../TaskDate';
import TaskUsers from '../TaskUsers';
import TaskCompany from '../TaskCompany';
import TaskShop from '../TaskShop';
import TaskModal from '../TaskModal';
import {taskInfoShow, updateTask} from '../../redux'
import {AiOutlineUser} from 'react-icons/ai';
// import TaskDept from '../TaskDept'


const Task = ({ task }) => {

  const [photo, setPhoto] = useState('');

  const { userPhotos } = useSelector(state => state);
  const { visionMenu } = useSelector(state => state);
  const { taskVisible } = useSelector(state => state);
  const {stateUpdate} = useSelector(state => state);
 
  const dispatch = useDispatch();

 
  async function loadUserImage() {
    for (let index = 0; index < userPhotos.length; index++) {
      // console.log(userPhotos[index].photo);

      if(userPhotos[index].photo==null){
        // console.log(userPhotos[index].photo);
       
          setPhoto(null);
          return;
        
      }else{
        if (task.user_id == userPhotos[index].user_id) {
          // console.log(userPhotos[index].photo);
          setPhoto(userPhotos[index].photo)
          return;
        } else {
          // setPhoto(null);
        }

      }

      
    }
  }

  useEffect(() => {
    loadUserImage()
  }, []);



  return (
    <li className="containerTask">
      {visionMenu.priority === true ? <TaskPriority task={task} /> : null}
      <div className="taskName">
      
        <div className="tooltip" >
          {photo == null ? (
            
                          <AiOutlineUser
                            size="35"
                            style={{
                              backgroundColor: "#353535",
                              borderRadius: "50%",
                            }}
                            alt=""
                            title=""
                          />
                        
          ): (
            <img src={photo} alt="" width='30' height='30' />
          )}
          
          <span className="tooltiptext">{task.user_name}</span>
        </div>
        <h2 onClick={() => {dispatch(taskInfoShow(task))}}>{task.description}</h2>
        {taskVisible ? <TaskModal/> : null}
      </div>
      <div className="taskContent">
        {visionMenu.shop === true ? <TaskShop task={task}/> : null}
        {visionMenu.company === true ? <TaskCompany task={task}/> : null}
        {visionMenu.vinc === true ? <TaskUsers task={task} /> : null}
        {visionMenu.state === true ? <TaskState task={task} /> : null}
        {visionMenu.date === true ? <TaskDate task={task} /> : null} 
        { <h2>{task.progress}%</h2>}
      </div>
      
    </li>
  );
}



export default Task;
