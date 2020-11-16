import React from "react";
import { useDispatch, useSelector } from "react-redux";
import './style.css';
import {taskVisibleUpdate} from '../../redux';

let TaskModal = ({id = 'modal',taskId}) => {

// console.log(taskId)

  const dispatch = useDispatch();
//   const {tasks} = useSelector((state) => state);  
  const {taskVisible} = useSelector((state) => state);

//   console.log(taskVisible);
  const handleOutsideClick = (e) => {
    if(e.target.id===id) dispatch(taskVisibleUpdate());
  }

  return (
    <div id={id} className="modal" onClick={handleOutsideClick}>
      <div className="modalContainer">
        <button className="modalClose" onClick={() => dispatch(taskVisibleUpdate())} />
        <div className="modalContent">
          {/* <h1>{task.id}</h1> */}
          {/* <React.Fragment>
          {tasks.map((task) => {
              <h1 style="color:red;">{task.id}</h1>
          })}
          </React.Fragment> */}
          <h1>{taskVisible.id}</h1>
          <h1>{taskVisible.description}</h1>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
