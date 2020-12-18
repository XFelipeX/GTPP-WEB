import React,{useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import "./style.css";
import { taskVisibleUpdate } from "../../redux";
import TaskTopicList from '../TaskTopicList';
import TaskInfo from '../TaskInfo';
import Loading from "../Loading";



let TaskModal = ({ id = "modal" }) => {

  

  const dispatch = useDispatch();
  const { taskVisible } = useSelector((state) => state);
  // console.log(taskVisible)
  const handleOutsideClick = (e) => {
    // console.log(e.target.id);
    if (e.target.id === id) dispatch(taskVisibleUpdate());
  };

  const [loading,setLoading] = useState(true);

  setTimeout(() => {
    setLoading(false)
  },1000)

  return (
  
    <div id={id} className="modal" onClick={handleOutsideClick}>
      {loading ? <Loading/> : null}
      <div className="modalContainer">
        <div className="modalHeader">
          <h1>{taskVisible.info ? taskVisible.info.description : null}</h1>
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
