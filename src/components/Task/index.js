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
import {taskInfoShow,sendInfoModal} from '../../redux'
// import {AiOutlineUser} from 'react-icons/ai';
import userEmpty from '../../assets/nullphoto.jpeg';
import api from '../../services/api';
// import TaskDept from '../TaskDept'


const Task = ({ task }) => {

  // const [photo, setPhoto] = useState('');

  // const { userPhotos } = useSelector(state => state);
  const { visionMenu } = useSelector(state => state);
  const {userPhotos} = useSelector(state => state);
  const { taskVisible } = useSelector(state => state);
  // const [taskShow,setTaskShow] = useState({});
  // const {stateUpdate} = useSelector(state => state);
  const{permissions} =  useSelector(state => state);
  const {vinculatedUsers} = useSelector(state => state);

  // console.log(userPhotos)
 
  const dispatch = useDispatch();

 
  // async function loadUserImage() {
  //   for (let index = 0; index < userPhotos.length; index++) {
  //     // console.log(userPhotos[index].photo);

  //     if(userPhotos[index].photo==null){
  //       // console.log(userPhotos[index].photo);
       
  //         setPhoto(null);
  //         return;
        
  //     }else{
  //       if (task.user_id == userPhotos[index].user_id) {
  //         // console.log(userPhotos[index].photo);
  //         setPhoto(userPhotos[index].photo)
  //         return;
  //       } else {
  //         // setPhoto(null);
  //       }

  //     }

      
  //   }
  // }

  // useEffect(() => {
  //   loadUserImage()
  // }, []);

  // useEffect(() =>{
  //   dispatch(taskInfoShow(taskShow))
  //   console.log(taskShow);
  // },[taskShow])

  async function loadTaskVisible(taskId,percent,description,initial_date,final_date,state_id,userId){
    let auth = permissions.session;

    try { 
      let {data} = await api.get('GTPP/Task.php?AUTH='+auth+'&app_id=3&id='+taskId);
      // console.log(taskVisible);

      dispatch(sendInfoModal(taskId,percent,description,initial_date,final_date,state_id,userId))
      dispatch(taskInfoShow(data.data))

      
      ;
     
    } catch (error) {
      console.log(error);
    }
  }

  let photo = userPhotos.filter(user => user.user_id == task.user_id)
  let user = vinculatedUsers.filter(user => user.id == task.user_id)

  // console.log(userPhotos)
  return (
    <li className="containerTask">
      {visionMenu.priority === true ? <TaskPriority task={task} /> : null}
      <div className="taskName">
      
        <div className="tooltip" > 
            
              {photo[0] ? (
                <>
                <img src={photo[0].photo} alt="" width='30' height='30' />
            <span className="tooltiptext">{user[0].user}</span>
            </>    
              ) : null}
          
            
              
        </div>
        <h2 onClick={() => {loadTaskVisible(task.id,task.percent,task.description,task.initial_date,task.final_date,task.state_id,task.user_id)}}>{task.description}</h2>
        {taskVisible && taskVisible.info && taskVisible.task ? <TaskModal/> : null}
      </div>
      <div className="taskContent">
        {/* {visionMenu.shop === true ? <TaskShop task={task}/> : null}
        {visionMenu.company === true ? <TaskCompany task={task}/> : null} */}
        {visionMenu.vinc === true ? <TaskUsers task={task} /> : null}
        {visionMenu.state === true ? <TaskState task={task} /> : null}
        {visionMenu.date === true ? <TaskDate task={task} /> : null} 
        { <h2>{task.percent}%</h2>}
      </div>
      
    </li>
  );
}



export default Task;
