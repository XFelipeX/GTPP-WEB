import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import './style.css';

import Task from '../Task';
import {loadTask,loadTaskStates,loadUserImages, loadCompanies,loadShop} from './functions'
import {getStates,setPhotos, getCompany,getTask,getShop} from '../../redux'
import TaskCompany from '../TaskCompany';

const TaskTable = () => {

    const {permissions} = useSelector(state => state);
    const {stateUpdate} = useSelector(state => state);
    const {visionMenu} = useSelector(state => state);

    // console.log(permissions)
    const dispatch = useDispatch();

    const [tasks,setTasks] = useState([]);
    // const [companies, setCompanies] = useState([]);

    useEffect(() =>{
        loadTask(permissions, visionMenu).then(response => {
            if (response.error === true){
                alert('error')
            }else{
                
                setTasks(response.data);
                dispatch(getTask(response.data));
            }
        });
    },[stateUpdate]);

    useEffect(() => {
        loadCompanies().then(response => {
            if(response.error === true){
                alert('error')
            }else{
                //console.log(response.data);
               dispatch(getCompany(response.data));
            }
        });
    },[])

    useEffect(() => {
        loadShop().then(response => {
            if(response.error === true){
                alert('error')
            }else{
                //console.log(response.data);
               dispatch(getShop(response.data));
            }
        });
    },[])

    useEffect(() => {
        loadTaskStates(permissions).then(response => {
            if(response.error === true){
                alert('error')
            }else{
                dispatch(getStates(response.data));
            }
        });
    },[])

    


    useEffect(() => {
        loadUserImages(permissions).then(response => {
          if (response.error === true) {
            alert('teste')
          } else {
            dispatch(setPhotos(response.data))
          }
        });
      }, []);

      return (
          <ul className="taskList">
            {tasks.map(task => 
                <Task task={task} key={task.id} />
            )}
          </ul>
      )
}

export default TaskTable;