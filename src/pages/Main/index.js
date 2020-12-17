import React from 'react';


import Header from '../../components/Header/index'
import TaskTable from '../../components/TaskTable';
import { useSelector,useDispatch } from "react-redux";
import Loading from '../../components/Loading';
// import TaskModal from '../../components/TaskModal';
// import {useSelector, useDispatch} from 'react-redux';
// import {taskVisibleUpdate} from '../../redux';

export default function Main() {

  const {loading} = useSelector(state => state);
  // const dispatch = useDispatch();

 return (
  <div>
    {loading==true ? (  
      <>
      {/* <Loading/> */}
     <Header/>
    <TaskTable/>
      </>)
    : (
      <>
      <Header/>
    <TaskTable/>
      </>
    )}
 
  </div>
 );
}