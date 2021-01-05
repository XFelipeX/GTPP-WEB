import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./style.css";
import { updateTask, taskVisibleUpdate, getTaskFilter } from "../../redux";
import { AiOutlineClose } from "react-icons/ai";
import { BiEdit } from "react-icons/bi";
import TaskTopicList from "../TaskTopicList";
import TaskInfo from "../TaskInfo";
import Loading from "../Loading";
import { updateDescription } from "./functions";
import ModalDescription from "../ModalDescription";
import {BsChatSquareDotsFill} from 'react-icons/bs';
import WebChat from '../WebChat';

let TaskModal = ({ id = "modal", close }) => {
  const dispatch = useDispatch();
  const { taskVisible } = useSelector((state) => state);
  const { tasks } = useSelector((state) => state);
  const { permissions } = useSelector((state) => state);
  const AUTH = permissions.session;
  const [description, setDescription] = useState(taskVisible.info.description);
  const [showDesc, setShowDesc] = useState(false);
  const [showWebChat,setShowWebChat] = useState(false);

  function upDescription(taskId, description, priority) {
    updateDescription(taskId, description, priority, AUTH).then(() => {
      setDescription(description);
    });
    setShowDesc(false);

    // let changes = [...tasks];

   tasks.map(task => {
      if(task.id===taskVisible.info.task_id){
        task.description = description;

      }
    })

    // console.log(changes)

    // dispatch(getTaskFilter([...changes]));
  }

  // console.log(taskVisible)
  // console.log(permissions)
  const handleOutsideClick = (e) => {
    // console.log(e.target.id);
    if (e.target.id === id) {
      dispatch(taskVisibleUpdate());
      close();
    }
  };

  const [loading, setLoading] = useState(true);

  setTimeout(() => {
    setLoading(false);
  }, 1000);

  return (
    <div id={id} className="modal" onClick={handleOutsideClick}>
      {loading == true ? <Loading /> : null}
      {showDesc ? (
        <ModalDescription
          description={description}
          setShowDesc={(info) => setShowDesc(info)}
          updateDesc={(info) =>
            upDescription(
              taskVisible.info.task_id,
              info,
              taskVisible.info.priority
            )
          }
          question="Descrição da tarefa"
        />
      ) : null}
      <div className="modalContainer">
        <div className="modalHeader">
          <div className="modalTaskDescription">
            <div onClick={() => setShowDesc(true)}>
            <BiEdit
                size="20"
                
                className="btnEdit"
              />
             
            </div>
            <div>
            {description}
            </div>
          </div>
          <div>
            <button
              className="modalClose"
              onClick={() => {
                dispatch(taskVisibleUpdate());
                close();
              }}
            >
              <AiOutlineClose size={35} />
            </button>
          </div>
        </div>

        <div className="modalContent">
          <TaskInfo />

          <TaskTopicList />
        </div>
      </div>

      <div className="webChatArea">
          <div className="chatIcon" onClick={() =>{
             setShowWebChat(!showWebChat)
             
          }}>
          <BsChatSquareDotsFill size={50} color="white"/>
          </div>
          {showWebChat ===true ? (
            <WebChat/>
          ): null}
      </div>
    </div>
  );
};

export default TaskModal;
