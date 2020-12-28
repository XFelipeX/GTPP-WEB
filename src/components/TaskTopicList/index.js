import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaTrash } from "react-icons/fa";
import { BiCommentAdd } from "react-icons/bi";
import { AiOutlineClose } from "react-icons/ai";
import { AiOutlineClockCircle, AiOutlineEdit } from "react-icons/ai";
import api from "../../services/api";
import {
  changeItemChecked,
  addItem,
  deleteItem,
  updateTopicDescription,
  takeHistoricTask,
} from "./functions";
import { updateModal, updateTopic } from "../../redux";
import "./style.css";

const TaskTopicList = ({ id = "modalEdit" }) => {
  const { topicUpdate } = useSelector((state) => state);
  const { taskVisible } = useSelector((state) => state);
  const { permissions } = useSelector((state) => state);
  const AUTH = permissions.session;
  const { modalUpdate } = useSelector((state) => state);
  const [newItem, setNewItem] = useState("");
  const [taskItem, setTaskItem] = useState([{}]);
  const [showEdit, setShowEdit] = useState(false);
  const [showHistoric, setShowHistoric] = useState(false);

  const [editDescription, setEditDescription] = useState();
  const [idItem, setIdItem] = useState();
  const [taskHistoric, setTaskHistoric] = useState([]);
  const dispatch = useDispatch();

  // const[loadItems,setLoadItems] = useState(false);

  async function loadTaskItems() {
    // const AUTH = sessionStorage.getItem("token");
    try {
      const { data } = await api.get("GTPP/TaskItem.php", {
        params: { AUTH: AUTH, app_id: 3, task_id: taskVisible.info.task_id },
      });
      // console.log(data)

      return data;
    } catch (error) {
      // console.log(error);
      return [{}];
    }
  }

  // useEffect(() => {
  //   setTaskItem(taskVisible.task_item);
  // },[])

  function changeInputCheck(e, taskId, itemId) {
    // tarefa bloqueada
    // if (taskVisible.info.state_id == 5 || taskVisible.info.state_id  == 4) {
    //   alert("A tarefa foi bloqueada!");
    // } else if(taskVisible.info.state_id  == 6){
    //   alert("Tarefa finalizada! clique no estado atual da tarefa para ativar novamente.")
    // }

    // console.log(e)
    let check = !e;

    changeItemChecked(taskId, itemId, check, AUTH).then((response) => {
      if (response != null) {
        taskVisible.info.percent = response.percent;
        taskVisible.info.state_id = response.state_id;
        dispatch(updateTopic());
      }
    });
    // e.target.setAttribute("checked",check);

    // console.log(e)
  }

  const [showBottom, setShowBottom] = useState(false);

  useEffect(() => {
    loadTaskItems().then((response) => {
      // console.log(response)
      if(response.error==false){
        setTaskItem(response.data);
      }else {
        setTaskItem([{}]);
      }
     
    });
  }, [topicUpdate]);

  useEffect(() => {
    handleClick();
  }, [showBottom]);

  function addNewItem(taskId, description) {
    if (taskVisible.info.state_id == 5 || taskVisible.info.state_id == 4) {
      alert("A tarefa foi bloqueada!");
      setNewItem("");
    } else if (taskVisible.state_id == 6) {
      alert(
        "Tarefa finalizada! clique no estado atual da tarefa para ativar novamente."
      );
    } else {
      if (description !== "") {
        addItem(taskId, description, AUTH)
          .then((response) => {
            if (response != null) {
              taskVisible.info.percent = response.percent;
              taskVisible.info.state_id = response.state_id;
              dispatch(updateTopic());
              dispatch(updateModal());

              setTimeout(() => {
                setShowBottom(!showBottom);
              },500)
             
            }
          })
          .finally();
        setNewItem("");
      }
    }

    // $('#topicList').scrollTop($('#topicList')[0].scrollHeight);

    // var list = document.getElementById("topicList");
    // list.scrollIntoView(false);
    // // console.log(list.scrollTop)
    // list.scrollTop = 9999999999;
    // console.log(list.scrollTop)

    // handleClick()
  }

  function deleteItemTopic(e, taskId, itemId) {
    e.preventDefault();
    if (taskVisible.info.state_id == 5 || taskVisible.info.state_id == 4) {
      alert("A tarefa foi bloqueada!");
    } else if (taskVisible.info.state_id == 6) {
      alert(
        "Tarefa finalizada! clique no estado atual da tarefa para ativar novamente."
      );
    } else {
      deleteItem(taskId, itemId, AUTH)
        .then((response) => {
          
          if (response != null) {
            taskVisible.info.percent = response.percent;
            taskVisible.info.state_id = response.state_id;

              dispatch(updateModal());
    dispatch(updateTopic());
          
            
          }
        })
        .catch((error) => {});
    }

    
  }

  function updateTopicItem(itemId, description, taskId) {
    if (taskVisible.info.state_id == 5 || taskVisible.info.state_id == 4) {
      alert("A tarefa foi bloqueada!");
    } else if (taskVisible.info.state_id == 6) {
      alert(
        "Tarefa finalizada! clique no estado atual da tarefa para ativar novamente."
      );
    } else {
      updateTopicDescription(itemId, description, taskId, AUTH).then(
        (response) => {
          if (response != null) {
            dispatch(updateModal());
            dispatch(updateTopic());
          }
          setShowEdit(false);
        }
      );
    }
  }

  // let domNode = useClickOutside(() =>{
  //   // console.log('oi')
  //   setShowHistoric(false);
  // })

  // const [loadHistoric, setLoadHistoric] = useState(false);

  const handleClick = () => {
    if (ref.current)
      ref.current.scrollIntoView(true, {
        behavior: "smooth",
        block: "end",
      });
  };

  const ref = React.createRef();

  return (
    <div className="taskTopicList">
      <div onClick={() => {}} className="taskTopicTop">
        <h1>Itens da tarefa em {taskVisible.info.percent}%</h1>
        <button
          type="button"
          onClick={() => (
            setShowHistoric(!showHistoric),
            takeHistoricTask(taskVisible.info.task_id, AUTH).then((response) =>
              setTaskHistoric(response.data)
            )
          )}
        >
          <AiOutlineClockCircle size="23" color="white" />
        </button>

        {showHistoric ? (
          <div id={id} className="modalHistoric" onClick={() => {}}>
            <div>
              <div className="btnCloseHistoric">
                <button type="button" onClick={() => setShowHistoric(false)}>
                  <AiOutlineClose size={30} />
                </button>
              </div>
              <div className="modaHistoricContent">
                <div className="listHistoric" style={{ clear: "both" }}>
                  <div className="historicItems">
                    {taskHistoric
                      ? taskHistoric.map((historic) => (
                          <ul key={historic.date_time}>
                            <li>{historic.description} </li>
                            <li>{historic.date_time}</li>
                          </ul>
                        ))
                      : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* alterar modelo de modal */}
      {showEdit && taskVisible.info.state_id != 5 ? (
        <div id={id} className="modalEdit" onClick={() => {}}>
          <div>
            <div className="btnEditTopic">
              <button type="button" onClick={() => setShowEdit(false)}>
                <AiOutlineClose size={30} />
              </button>
              <button
                type="button"
                style={{ backgroundColor: "#69a312", color: "white" }}
                onClick={() =>
                  updateTopicItem(
                    idItem,
                    editDescription,
                    taskVisible.info.task_id
                  )
                }
              >
                Salvar
              </button>
            </div>
            <div className="descriptionTopic">
              <textarea
                spellcheck="false"
                rows="5"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
              ></textarea>
            </div>
          </div>
        </div>
      ) : null}

      <div className="topicList" id="topicList">
        {taskItem
          ? taskItem.map((item) =>
              item.id != null ? (
                <React.Fragment key={item.id}>
                  {/* {console.log(item)} */}

                  <div className="topic" ref={ref}>
                    {/* {console.log(item.check)} */}
                   
                    <div className="topicLeft">
                    <a>
                    {item.order}
                    </a>
                      <input
                        type="checkbox"
                        onChange={(e) => {
                          changeInputCheck(
                            item.check,
                            taskVisible.info.task_id,
                            item.id
                          );
                        }}
                        checked={item.check}
                      />
                      <a
                        href=""
                        onClick={(e) => {
                          e.preventDefault();
                          setShowEdit(!showEdit);
                          setEditDescription(item.description);
                          setIdItem(item.id);
                        }}
                      >
                        <AiOutlineEdit
                          className="topicEdit"
                          size={20}
                          color="#dddd"
                        />
                      </a>
                    </div>

                    <div>
                      {/* <input type="checkbox"  onChange={() => {changeChecked(taskVisible.id,item.id,item.check)}} checked={item.check}/> */}
                      <label htmlFor="">{item.description}</label>
                    </div>

                    <div className="topicRight">
                      <a
                        href=""
                        onClick={(e) =>
                          taskVisible.info.user_id === permissions.id ||
                          permissions.administrator === 1
                            ? deleteItemTopic(
                                e,
                                taskVisible.info.task_id,
                                item.id
                              )
                            : (e.preventDefault(),
                              alert(
                                "Somente o criador da tarefa ou administrador pode fazer isto!"
                              ))
                        }
                      >
                        <FaTrash color="white" />
                      </a>
                    </div>
                  </div>
                </React.Fragment>
              ) : null
            )
          : null}
      </div>

      <div className="addTopic">
        <label>Add item</label>
        <input
          type="text"
          size="10"
          name="newItem"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
        />

        <button
          onClick={() => {
            addNewItem(taskVisible.info.task_id, newItem);
            // console.log(taskItem);
          }}
        >
          <BiCommentAdd size="27" color="white" />
        </button>
      </div>
    </div>
  );
};

export default TaskTopicList;
