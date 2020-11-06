import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import './style.css';

import Task from '../Task';
import {loadTask,loadTaskStates,loadUserImages} from './functions'
import {getStates,setPhotos} from '../../redux'

const TaskTable = () => {

    const {permissions} = useSelector(state => state);
    const {stateUpdate} = useSelector(state => state);
    const {visionMenu} = useSelector(state => state);
    console.log(permissions)
    const dispatch = useDispatch();

    const [tasks,setTasks] = useState([]);

    useEffect(() =>{
        loadTask(permissions, visionMenu).then(response => {
            if (response.error === true){
                alert('error')
            }else{
                setTasks(response.data);
            }
        });
    },[stateUpdate]);

    // useEffect(() => {
    //     loadTaskStates(permissions).then(response => {
    //         if(response.error === true){
    //             alert('error')
    //         }else{
    //             dispatch(getStates(response.data));
    //         }
    //     });
    // },[])

    // useEffect(() => {
    //     loadUserImages(permissions).then(response => {
    //       if (response.error === true) {
    //         alert('teste')
    //       } else {
    //         dispatch(setPhotos(response.data))
    //       }
    //     });
    //   }, []);

      return (
          <ul className="taskList">
            {tasks.map(task => 
                {/* <Task task={task} key={task.id} /> */}
            )}
          </ul>
      )
}

export default TaskTable;