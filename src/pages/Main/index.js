import React from 'react';


import Header from '../../components/Header/index'
import TaskTable from '../../components/TaskTable';
import { useSelector,useDispatch } from "react-redux";
import {loadingScreen} from '../../redux'
import Loading from '../../components/Loading';
// import TaskModal from '../../components/TaskModal';
// import {useSelector, useDispatch} from 'react-redux';
// import {taskVisibleUpdate} from '../../redux';

function Main() {

  // const {loading} = useSelector(state => state);
  // const dispatch = useDispatch();
  // dispatch(loadingScreen())
 return (
  <div>
  
      
     <Header/>
    <TaskTable/>
     

   
 
  </div>
 );
}

export default Main;