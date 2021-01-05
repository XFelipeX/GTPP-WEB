import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaElementor, FaTrash } from "react-icons/fa";
import { BiCommentAdd } from "react-icons/bi";
import { AiOutlineClose } from "react-icons/ai";
import { AiOutlineClockCircle, AiOutlineEdit } from "react-icons/ai";
import { FaArrowUp } from "react-icons/fa";
import { FaArrowDown } from "react-icons/fa";
import { BsCheckAll } from "react-icons/bs";
import { GoListUnordered } from "react-icons/go";
import ConfirmAction from "../ConfirmAction";
import api from "../../services/api";
import {
  changeItemChecked,
  addItem,
  deleteItem,
  updateTopicDescription,
  takeHistoricTask,
  nextOrPreviousTopic,
  changeYesNoTopic,
} from "./functions";
import { getTaskFilter, updateModal, updateTask, updateTopic } from "../../redux";
import "./style.css";

const TaskTopicList = ({ id = "modalEdit" }) => {
  const { topicUpdate } = useSelector((state) => state);
  const { taskVisible } = useSelector((state) => state);
  const { tasks } = useSelector((state) => state);
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
  const [showOrder, setShowOrder] = useState(false);
  const [orderItem, setOrderItem] = useState(false);
  const [itemEdit, setItemEdit] = useState();
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  let itemDelete = {};
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

        let changes = [...tasks];

        changes = changes.map(task => {
          if(task.id===taskVisible.info.task_id){
            task.percent = response.percent;
            task.state_id = response.state_id;
          }
        })
        dispatch(updateTopic());
        // dispatch(getTaskFilter([...changes]));
      }
    });
    // e.target.setAttribute("checked",check);

    // console.log(e)
  }

  const [showBottom, setShowBottom] = useState(false);

  useEffect(() => {
    loadTaskItems().then((response) => {
      // console.log(response)
      if (response.error == false) {
        setTaskItem(response.data);
      } else {
        setTaskItem([{}]);
      }
    });
  }, [topicUpdate, modalUpdate]);

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
              }, 500);
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

  function deleteItemTopic(taskId, itemId) {
    // e.preventDefault();
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

  function changeOrderTopic(taskId, nextOrPrevious, itemId) {
    nextOrPreviousTopic(taskId, AUTH, nextOrPrevious, itemId).then(() =>
      dispatch(updateModal())
    );

    // console.log(document.getElementById(itemId).getBoundingClientRect().top);

    let element = document.getElementById("topicList");

    let distance = document.getElementById(itemId);

    if (distance.offsetTop > element.offsetTop * 2 - 100) {
      element.scrollTop = distance.offsetTop - 280;
    }

    // console.log(distance.offsetTop)
    // console.log(element.offsetTop)
    // handleClick()
  }

  function setYesNoOption() {
    let change = itemEdit.yes_no === 0 ? -1 : 0;

    changeYesNoTopic(taskVisible.info.task_id, change, itemEdit.id, AUTH).then(
      (response) => {
        if (response != null) {
          taskVisible.info.percent = response.percent;
          taskVisible.info.state_id = response.state_id;

          dispatch(updateModal());
          dispatch(updateTopic());
          itemEdit.yes_no = change;
        }
      }
    );
  }

  function setYesNo(taskId, yesOrNo, idItem, auth) {
    let change = yesOrNo;

    changeYesNoTopic(taskId, change, idItem, auth).then((response) => {
      if (response != null) {
        taskVisible.info.percent = response.percent;
        taskVisible.info.state_id = response.state_id;

        dispatch(updateModal());
        dispatch(updateTopic());
      }
    });
  }

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
      {showOrder === true ? (
        <div className="orderModal">
          <div className="orderArea">
            <div
              className="orderUp"
              onClick={() => {
                changeOrderTopic(
                  taskVisible.info.task_id,
                  "previous",
                  orderItem
                );
              }}
            >
              <FaArrowUp size={40} color="white" />
            </div>

            <div
              className="orderDone"
              onClick={() => {
                setShowOrder(false);
                setOrderItem(null);
              }}
            >
              <BsCheckAll size={40} color="white" />
            </div>

            <div
              className="orderDown"
              onClick={() => {
                changeOrderTopic(taskVisible.info.task_id, "next", orderItem);
              }}
            >
              <FaArrowDown size={40} color="white" />
            </div>
          </div>
        </div>
      ) : null}
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
              <div className="defineQuestion">
                <input
                  type="checkbox"
                  checked={itemEdit.yes_no !== 0 ? true : false}
                  onChange={() => {
                    setYesNoOption(itemEdit);
                  }}
                />
                <label>Definir como questão</label>
              </div>
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
                spellCheck="false"
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

                  <div className="topic" ref={ref} id={item.id}>
                    {/* {console.log(item.check)} */}
                    {item.yes_no !== 0 ? (
                      <div className="topicLeft">
                        <a
                          style={
                            orderItem == item.id
                              ? {
                                  backgroundColor: "#4da6ff",
                                  borderRadius: "10px",
                                  padding: "2px",
                                }
                              : null
                          }
                        >
                          {item.order}
                        </a>

                        <a></a>

                        <a
                          href=""
                          onClick={(e) => {
                            e.preventDefault();
                            setShowEdit(!showEdit);
                            setEditDescription(item.description);
                            setIdItem(item.id);
                            setItemEdit(item);
                          }}
                        >
                          <AiOutlineEdit
                            className="topicEdit"
                            size={20}
                            color="#dddd"
                          />
                        </a>

                        <a
                          className="orderTopic"
                          href=""
                          onClick={(e) => {
                            e.preventDefault();
                            setShowOrder(true);
                            setOrderItem(item.id);
                          }}
                        >
                          <GoListUnordered
                            className="topicEdit"
                            size={20}
                            color="#dddd"
                          />
                        </a>
                      </div>
                    ) : (
                      <div className="topicLeft">
                        <a
                          style={
                            orderItem == item.id
                              ? {
                                  backgroundColor: "#4da6ff",
                                  borderRadius: "10px",
                                  padding: "2px",
                                }
                              : null
                          }
                        >
                          {item.order}
                        </a>
                        <a>
                          <input
                            className="tick"
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
                        </a>

                        <a
                          href=""
                          onClick={(e) => {
                            e.preventDefault();
                            setShowEdit(!showEdit);
                            setEditDescription(item.description);
                            setIdItem(item.id);
                            setItemEdit(item);
                          }}
                        >
                          <AiOutlineEdit
                            className="topicEdit"
                            size={20}
                            color="#dddd"
                          />
                        </a>

                        <a
                          className="orderTopic"
                          href=""
                          onClick={(e) => {
                            e.preventDefault();
                            setShowOrder(true);
                            setOrderItem(item.id);
                          }}
                        >
                          <GoListUnordered
                            className="topicEdit"
                            size={20}
                            color="#dddd"
                          />
                        </a>
                      </div>
                    )}

                    <div
                      className="topicDescription"
                      style={
                        item.yes_no === -1 ||
                        item.yes_no === 1 ||
                        item.yes_no === 2
                          ? { paddingRight: 90 }
                          : null
                      }
                    >
                      {/* <input type="checkbox"  onChange={() => {changeChecked(taskVisible.id,item.id,item.check)}} checked={item.check}/> */}
                      <label
                        style={
                          item.yes_no === -1 ||
                          item.yes_no === 1 ||
                          item.yes_no === 2
                            ? { maxWidth: 250 }
                            : null
                        }
                        htmlFor=""
                      >
                        {item.description}
                      </label>
                    </div>

                    <div
                      className="topicRight"
                      style={item.yes_no === 0 ? { width: "auto" } : null}
                    >
                      {item.yes_no === -1 ||
                      item.yes_no === 1 ||
                      item.yes_no === 2 ? (
                        <div className="topicOptions">
                          <a style={{ display: "flex" }}>
                            <div className="yesOption">
                              <input
                                id="yes"
                                type="checkbox"
                                checked={item.yes_no === 1}
                                onChange={() => {
                                  let change = item.yes_no !== 1 ? 1 : -1;
                                  setYesNo(
                                    taskVisible.info.task_id,
                                    change,
                                    item.id,
                                    AUTH
                                  );
                                }}
                              />
                              <label htmlFor="yes" className="tick">
                                Sim
                              </label>
                            </div>
                            <div className="noOption">
                              <input
                                type="checkbox"
                                checked={item.yes_no === 2}
                                onChange={() => {
                                  let change = item.yes_no !== 2 ? 2 : -1;
                                  setYesNo(
                                    taskVisible.info.task_id,
                                    change,
                                    item.id,
                                    AUTH
                                  );
                                }}
                              />
                              <label className="check-box" className="tick">
                                Não
                              </label>
                            </div>
                          </a>
                          <a
                            href=""
                            onClick={(e) =>
                              taskVisible.info.user_id === permissions.id ||
                              permissions.administrator === 1
                                ? (e.preventDefault(),
                                  setIdItem(item.id),
                                  setShowConfirmDelete(true))
                                : (e.preventDefault(),
                                  alert(
                                    "Somente o criador da tarefa ou administrador pode fazer isto!"
                                  ))
                            }
                          >
                            <FaTrash color="white" />
                          </a>
                        </div>
                      ) : (
                        <a
                          href=""
                          onClick={(e) =>
                            taskVisible.info.user_id === permissions.id ||
                            permissions.administrator === 1
                              ? (e.preventDefault(),
                                setIdItem(item.id),
                                setShowConfirmDelete(true))
                              : (e.preventDefault(),
                                alert(
                                  "Somente o criador da tarefa ou administrador pode fazer isto!"
                                ))
                          }
                        >
                          <FaTrash color="white" />
                        </a>
                      )}
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

      {showConfirmDelete === true ? (
        <ConfirmAction
          confirm={() => {}}
          question="Tem certeza que deseja excluir este item"
          action={() => {
            deleteItemTopic(taskVisible.info.task_id, idItem);
            setShowConfirmDelete(false)
          }}
          cancelAction={() => setShowConfirmDelete(false)}
        />
      ) : null}
    </div>
  );
};

export default TaskTopicList;
