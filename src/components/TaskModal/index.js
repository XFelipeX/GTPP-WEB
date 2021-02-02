import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./style.css";
import {
  taskVisibleUpdate,
  getWebSocketHistoric,
  getNotifications,
} from "../../redux";
import { AiOutlineClose } from "react-icons/ai";
import { BiEdit } from "react-icons/bi";
import TaskTopicList from "../TaskTopicList";
import TaskInfo from "../TaskInfo";
import Loading from "../Loading";
import { updateDescription, getMessage } from "./functions";
import ModalDescription from "../ModalDescription";
import { BsChatSquareDotsFill } from "react-icons/bs";
import WebChat from "../WebChat";

let TaskModal = ({ id = "modal", close, open }) => {
  const dispatch = useDispatch();
  const { taskVisible } = useSelector((state) => state);
  const { tasks } = useSelector((state) => state);
  const { permissions } = useSelector((state) => state);
  const { webSocket } = useSelector((state) => state);
  const { warning } = useSelector((state) => state);
  const { notifications } = useSelector((state) => state);
  const AUTH = permissions.session;
  const [description, setDescription] = useState(taskVisible.info.description);
  const [showDesc, setShowDesc] = useState(false);
  const [showWebChat, setShowWebChat] = useState(false);

  useEffect(() => {
    setDescription(taskVisible.info.description);
  }, [taskVisible.info.description]);

  function upDescription(taskId, description, priority) {
    updateDescription(taskId, description, priority, AUTH).then((response) => {
      if (response !== null) {
        setDescription(description);
        SendInfo("A descrição simples da tarefa foi atualizada", description);
      }
    });
    setShowDesc(false);

    tasks.map((task) => {
      if (task.id === taskVisible.info.task_id) {
        task.description = description;
      }
    });
  }

  function SendInfo(msg, update) {
    if (msg !== "" && webSocket.websocketState === "connected") {
      try {
        let jsonString = {
          task_id: taskVisible.info.task_id,
          object: {
            description: msg,
            task_id: taskVisible.info.task_id,
            update: update,
          },
          date_time: null,
          user_id: Number(permissions.id),
          type: 3,
        };
        webSocket.websocket.send(JSON.stringify(jsonString));
      } catch (error) {
        alert(error);
      }
    }
  }

  const handleOutsideClick = (e) => {
    if (e.target.id === id) {
      dispatch(taskVisibleUpdate());
      close();
      setShowWebChat(false);
    }
  };

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const [notification, setNotification] = useState(0);

  useEffect(() => {
    if (notifications.length > 0) {
      notifications.map((notification) => {
        if (notification.task_id === taskVisible.info.task_id) {
          let total = 0;

          total += notification.content.message;

          if (total > 99) {
            setNotification("+99");
          } else if (total === 0) {
            setNotification(0);
          } else {
            setNotification(total);
          }
        }
      });
    }
  }, [notifications]);

  const [warningState, setWarningState] = useState("");

  useEffect(() => {
    function verifyWarning() {
      let task = warning.warning.filter(
        (task) => task.task_id == taskVisible.info.task_id
      );

      if (warning.warning.length > 0 && task[0]) {
        const due_date = task[0].due_date;
        const expire = task[0].expire;
        const initial = task[0].initial;

        if (due_date > -1) {
          if (due_date === 0) {
            setWarningState("A tarefa vence hoje");
          } else if (due_date === 1) {
            setWarningState("A tarefa venceu há " + due_date + " dia");
          } else {
            setWarningState("A tarefa venceu há " + due_date + " dias");
          }
        } else if (expire > 0) {
          if (expire === 1) {
            setWarningState("A tarefa expira em " + expire + " dia");
          } else {
            setWarningState("A tarefa expira em " + expire + " dias");
          }
        } else if (initial > 0) {
          if (initial === 1) {
            setWarningState("A tarefa começa em " + initial + " dia");
          } else {
            setWarningState("A tarefa começa em " + initial + " dias");
          }
        }
      } else {
        setWarningState(null);
      }
    }

    verifyWarning();
  }, [warning]);

  return (
    <div id={id} className="modal" onClick={handleOutsideClick}>
      {loading == true ? <Loading /> : null}
      {showDesc ? (
        <ModalDescription
          showDelete={true}
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
          <div
            style={{
              position: "absolute",
              top: 5 + "em",
              width: 100 + "%",
              height: 3 + "px",
              backgroundColor: "#1b1b1b",
            }}
          >
            <div
              style={{
                backgroundColor: "#00a2ff",
                width: taskVisible.info.percent + "%",
                height: 100 + "%",
              }}
            />
          </div>

          <div className="modalTaskDescription">
            <div>
              <div onClick={() => setShowDesc(true)}>
                <BiEdit size="20" className="btnEdit" />
              </div>

              <span>{description}</span>
            </div>
            {warningState ? (
              <div
                style={
                  warningState.includes("venceu") ||
                  warningState.includes("vence")
                    ? { color: "red" }
                    : warningState.includes("expira")
                    ? { color: "yellow" }
                    : {}
                }
              >
                {warningState}
              </div>
            ) : (
              <div></div>
            )}
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
          <TaskInfo close={(close) => close()} open={open} />

          <TaskTopicList />
        </div>
      </div>

      <div
        className="chatIcon"
        id="openChat"
        onClick={() => {
          getMessage(permissions.session, taskVisible.info.task_id)
            .then((response) => dispatch(getWebSocketHistoric(response)))
            .then(() => {});
          setShowWebChat(!showWebChat);
          document.getElementById("openChat").style.display = "none";
          let newArray = [...notifications];

          newArray.map((notify) => {
            if (notify.task_id === taskVisible.info.task_id) {
              notify.content.message = 0;
              notify.content.amount = 0;
              notify.content.object = [];
            }
          });

          dispatch(getNotifications([...newArray]));
        }}
      >
        <div
          className="webChatNotification"
          style={notification === 0 ? { backgroundColor: "transparent" } : null}
        >
          <div>{notification > 0 && notification}</div>
        </div>
        <BsChatSquareDotsFill size={50} color="white" />
      </div>
      {showWebChat === true ? (
        <div className="webChatArea">
          <WebChat close={() => setShowWebChat(false)} />
        </div>
      ) : null}
    </div>
  );
};

export default TaskModal;
