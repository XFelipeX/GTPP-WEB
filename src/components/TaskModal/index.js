import React from "react";
import { useDispatch, useSelector } from "react-redux";
import "./style.css";
import { taskVisibleUpdate } from "../../redux";
import TaskTopicList from '../TaskTopicList';
import TaskInfo from '../TaskInfo';



let TaskModal = ({ id = "modal" }) => {

  const dispatch = useDispatch();
  const { taskVisible } = useSelector((state) => state);
  // console.log(taskVisible)
  const handleOutsideClick = (e) => {
    // console.log(e.target.id);
    if (e.target.id === id) dispatch(taskVisibleUpdate());
  };

  return (
    <div id={id} className="modal" onClick={handleOutsideClick}>
      <div className="modalContainer">
        <div className="modalHeader">
          <h1>{taskVisible.description}</h1>
          <button
            className="modalClose"
            onClick={() => dispatch(taskVisibleUpdate())}
          />
        </div>

        <div className="modalContent">
          <TaskInfo/>

          <TaskTopicList/>

        </div>
      </div>
    </div>
  );
};

export default TaskModal;
