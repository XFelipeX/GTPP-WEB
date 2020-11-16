import React from 'react';


import Header from '../../components/Header/index'
import TaskTable from '../../components/TaskTable';
// import TaskModal from '../../components/TaskModal';
// import {useSelector, useDispatch} from 'react-redux';
// import {taskVisibleUpdate} from '../../redux';

export default function Main() {

  // const {taskVisible} = useSelector(state => state);
  // const dispatch = useDispatch();

 return (
  <div>

    <Header/>
    <TaskTable/>
  </div>
 );
}