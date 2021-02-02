import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaTrash } from "react-icons/fa";
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
  showNotification,
} from "./functions";
import { taskInfoShow, updateModal, updateTopic } from "../../redux";
import "./style.css";

const TaskTopicList = ({ id = "modalEdit" }) => {
  const { topicUpdate } = useSelector((state) => state);
  const { taskVisible } = useSelector((state) => state);
  const { tasks } = useSelector((state) => state);
  const { webSocket } = useSelector((state) => state);
  const { permissions } = useSelector((state) => state);
  const AUTH = permissions.session;
  const { modalUpdate } = useSelector((state) => state);
  const [newItem, setNewItem] = useState("");
  const [showEdit, setShowEdit] = useState(false);
  const [showHistoric, setShowHistoric] = useState(false);
  const [editDescription, setEditDescription] = useState();
  const [idItem, setIdItem] = useState();
  const [taskHistoric, setTaskHistoric] = useState([]);
  const [showOrder, setShowOrder] = useState(false);
  const [orderItem, setOrderItem] = useState(false);
  const [itemEdit, setItemEdit] = useState();
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const dispatch = useDispatch();

  function changeInputCheck(e, taskId, itemId) {
    let check = !e;

    changeItemChecked(taskId, itemId, check, AUTH).then((response) => {
      if (response != null) {
        let itemUp;
        taskVisible.task.task_item.map((item) => {
          if (item.id === itemId) {
            item.check = check;
            itemUp = item;
          }
        });
        taskVisible.info.percent = response.percent;
        taskVisible.info.state_id = response.state_id;

        if (e === true) {
          SendInfo("Um item foi desmarcado", 2, response.percent, "", itemUp);
        } else {
          SendInfo("Um item foi marcado", 2, response.percent, "", itemUp);
        }

        let changes = [...tasks];

        changes = changes.map((task) => {
          if (task.id === taskVisible.info.task_id) {
            if (task.state_id != response.state_id) {
              SendInfo("Mudou para ", 6, response.percent, response.state_id);
            }
            task.percent = response.percent;
            task.state_id = response.state_id;
          }
        });
        // dispatch(updateTopic());
        // dispatch(getTaskFilter([...changes]));
      }
    });
  }

  const [showBottom, setShowBottom] = useState(false);

  useEffect(() => {
    async function loadTaskItems() {
      try {
        const { data } = await api.get("GTPP/TaskItem.php", {
          params: { AUTH: AUTH, app_id: 3, task_id: taskVisible.info.task_id },
        });

        return data;
      } catch (error) {
        console.log(error);
        return [{}];
      }
    }

    loadTaskItems().then((response) => {
      if (response.error == false) {
        dispatch(
          taskInfoShow({ ...taskVisible.task, task_item: response.data })
        );
      } else {
        taskVisible.task.task_item = [{}];
      }
    });
  }, [topicUpdate, modalUpdate]);

  useEffect(() => {
    const handleClick = () => {
      if (ref.current)
        ref.current.scrollIntoView(true, {
          behavior: "smooth",
          block: "end",
        });
    };
    handleClick();
  }, [showBottom]);

  function SendInfo(msg, type, percent, state, item, remove) {
    if (msg !== "" && webSocket.websocketState === "connected") {
      switch (type) {
        case 2:
          try {
            let jsonString = {
              task_id: taskVisible.info.task_id,
              object: {
                description: msg,
                task_id: taskVisible.info.task_id,
                percent: percent,
                itemUp: item,
                remove: remove,
              },
              date_time: null,
              user_id: Number(permissions.id),
              type: type,
            };
            webSocket.websocket.send(JSON.stringify(jsonString));
          } catch (error) {
            alert(error);
          }
          break;
        case 6: {
          try {
            let jsonString = {
              task_id: taskVisible.info.task_id,
              object: {
                description: msg,
                task_id: taskVisible.info.task_id,
                percent: percent,
                state_id: state,
                task: taskVisible.info,
              },
              date_time: null,
              user_id: Number(permissions.id),
              type: type,
            };
            webSocket.websocket.send(JSON.stringify(jsonString));
          } catch (error) {
            alert(error);
          }
          break;
        }
      }
    }
  }

  function addNewItem(taskId, description) {
    if (taskVisible.info.state_id == 5 || taskVisible.info.state_id == 4) {
      showNotification(
        "Aviso",
        "Tarefa neste estado não pode ser modificada",
        "warning"
      );
      setNewItem("");
    } else if (taskVisible.state_id == 6) {
      showNotification(
        "Aviso",
        "Tarefa finalizada! clique no estado atual da tarefa para ativar novamente",
        "warning"
      );
    } else {
      if (description !== "") {
        addItem(taskId, description, AUTH).then((response) => {
          if (response != null) {
            const newItem = {
              check: false,
              id: response.last_id,
              description: description,
              order: response.order,
              yes_no: response.yes_no,
            };

            taskVisible.task.task_item = [
              ...taskVisible.task.task_item,
              newItem,
            ];
            SendInfo("Novo item adicionado", 2, response.percent, "", newItem);
            taskVisible.info.percent = response.percent;
            taskVisible.info.state_id = response.state_id;

            let changes = [...tasks];

            changes = changes.map((task) => {
              if (task.id === taskVisible.info.task_id) {
                if (task.state_id != response.state_id) {
                  SendInfo(" para ", 6, response.percent, response.state_id);
                }
                task.percent = response.percent;
                task.state_id = response.state_id;
              }
            });
            dispatch(updateTopic());
            dispatch(updateModal());

            setTimeout(() => {
              setShowBottom(!showBottom);
            }, 500);
          }
        });
        setNewItem("");
      }
    }
  }

  function deleteItemTopic(taskId, itemId) {
    if (taskVisible.info.state_id == 5 || taskVisible.info.state_id == 4) {
      showNotification(
        "Aviso",
        "Tarefa neste estado não pode ser modificada",
        "warning"
      );
    } else if (taskVisible.info.state_id == 6) {
      showNotification(
        "Aviso",
        "Tarefa finalizada! clique no estado atual da tarefa para ativar novamente",
        "warning"
      );
    } else {
      deleteItem(taskId, itemId, AUTH)
        .then((response) => {
          if (response != null) {
            taskVisible.task.task_item = taskVisible.task.task_item.filter(
              (item) => item.id !== itemId
            );

            SendInfo(
              "Um item foi removido",
              2,
              response.percent,
              "",
              itemId,
              true
            );
            taskVisible.info.percent = response.percent;
            taskVisible.info.state_id = response.state_id;

            let changes = [...tasks];

            changes = changes.map((task) => {
              if (task.id === taskVisible.info.task_id) {
                if (task.state_id != response.state_id) {
                  SendInfo(
                    "Mudou para ",
                    6,
                    response.percent,
                    response.state_id,
                    false
                  );
                }
                task.percent = response.percent;
                task.state_id = response.state_id;
              }
            });

            dispatch(updateModal());
            dispatch(updateTopic());
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  function updateTopicItem(itemId, description, taskId) {
    if (taskVisible.info.state_id == 5 || taskVisible.info.state_id == 4) {
      showNotification(
        "Aviso",
        "Tarefa neste estado não pode ser modificada",
        "warning"
      );
    } else if (taskVisible.info.state_id == 6) {
      showNotification(
        "Aviso",
        "Tarefa finalizada! clique no estado atual da tarefa para ativar novamente",
        "warning"
      );
    } else {
      updateTopicDescription(itemId, description, taskId, AUTH).then(
        (response) => {
          if (response != null) {
            let itemUp;

            taskVisible.task.task_item.map((item) => {
              if (item.id === itemId) {
                item.description = description;
                itemUp = item;
              }
            });

            SendInfo(
              "Um item foi atualizado",
              2,
              taskVisible.info.percent,
              "",
              itemUp
            );
            dispatch(updateModal());
            dispatch(updateTopic());
          }
          setShowEdit(false);
        }
      );
    }
  }

  function changeOrderTopic(taskId, nextOrPrevious, itemId) {
    nextOrPreviousTopic(taskId, AUTH, nextOrPrevious, itemId).then(
      () => dispatch(updateModal()),
      dispatch(updateTopic())
    );

    let element = document.getElementById("topicList");

    let distance = document.getElementById(itemId);

    if (distance.offsetTop > element.offsetTop * 2 - 100) {
      element.scrollTop = distance.offsetTop - 280;
    }
  }

  function setYesNoOption() {
    let change = itemEdit.yes_no === 0 ? -1 : 0;

    changeYesNoTopic(taskVisible.info.task_id, change, itemEdit.id, AUTH).then(
      (response) => {
        if (response != null) {
          let itemUp;
          taskVisible.task.task_item.map((item) => {
            if (item.id === idItem) {
              item.yes_no = change;
              itemUp = item;
            }
          });

          if (change === -1) {
            SendInfo(
              "Agora é uma questão ",
              2,
              response.percent,
              response.state_id,
              itemUp
            );
          } else {
            SendInfo(
              "Agora é um item comum ",
              2,
              response.percent,
              response.state_id,
              itemUp
            );
          }

          taskVisible.info.percent = response.percent;
          taskVisible.info.state_id = response.state_id;

          // dispatch(updateModal());
          // dispatch(updateTopic());

          setItemEdit({ ...itemEdit, yes_no: change });
          // itemEdit.yes_no = change;
        }
      }
    );
  }

  function setYesNo(taskId, yesOrNo, idItem, auth) {
    let change = yesOrNo;

    changeYesNoTopic(taskId, change, idItem, auth).then((response) => {
      if (response != null) {
        let itemUp;
        taskVisible.task.task_item.map((item) => {
          if (item.id === idItem) {
            item.yes_no = change;
            itemUp = item;
          }
        });

        if (yesOrNo === 1) {
          SendInfo(
            "Marcou uma questão como sim ",
            2,
            response.percent,
            response.state_id,
            itemUp
          );
        } else if (yesOrNo === 2) {
          SendInfo(
            "Marcou uma questão como não ",
            2,
            response.percent,
            response.state_id,
            itemUp
          );
        } else {
          SendInfo(
            "Desmarcou uma questão ",
            2,
            response.percent,
            response.state_id,
            itemUp
          );
        }

        taskVisible.info.percent = response.percent;
        taskVisible.info.state_id = response.state_id;

        let changes = [...tasks];

        changes = changes.map((task) => {
          if (task.id === taskVisible.info.task_id) {
            if (task.state_id != response.state_id) {
              SendInfo("Mudou para ", 6, response.percent, response.state_id);
            }
            task.percent = response.percent;
            task.state_id = response.state_id;
          }
        });

        dispatch(updateTopic());
      }
    });
  }

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
        {taskVisible.task.task_item
          ? taskVisible.task.task_item.map((item) =>
              item.id != null ? (
                <React.Fragment key={item.id}>
                  <div className="topic" ref={ref} id={item.id}>
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
                                onChange={(e) => {
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
                                onChange={(e) => {
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
                                  showNotification(
                                    "Aviso",
                                    "Somente o criador da tarefa ou administrador pode fazer isto",
                                    "warning"
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
                                showNotification(
                                  "Aviso",
                                  "Somente o criador da tarefa ou administrador pode fazer isto",
                                  "warning"
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
          autoFocus
          type="text"
          size="10"
          name="newItem"
          value={newItem}
          onKeyPress={(e) =>
            e.key === "Enter" && addNewItem(taskVisible.info.task_id, newItem)
          }
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
            setShowConfirmDelete(false);
          }}
          cancelAction={() => setShowConfirmDelete(false)}
        />
      ) : null}
    </div>
  );
};

export default TaskTopicList;
