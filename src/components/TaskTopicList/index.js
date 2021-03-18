import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaTrash } from "react-icons/fa";
import { BiCommentAdd } from "react-icons/bi";
import {
  AiOutlineClose,
  AiOutlineClockCircle,
  AiOutlineEdit,
  AiOutlinePaperClip,
  AiOutlineQuestionCircle,
} from "react-icons/ai";
import { FaArrowUp, FaCloudDownloadAlt, FaArrowDown } from "react-icons/fa";
import { BsCheckAll } from "react-icons/bs";
import { GoListUnordered, GoNote } from "react-icons/go";
import { GiHamburgerMenu } from "react-icons/gi";
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
  updateAttachment,
  updateNote,
} from "./functions";
import { showNotification } from "../../Utils/Notify";
import { taskInfoShow, updateModal, updateTopic } from "../../redux";
import "./style.css";
import useClickOutside from "../ClickOutside";

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
  const [showEditObs, setShowEditObs] = useState(false);
  const [showHistoric, setShowHistoric] = useState(false);
  const [editDescription, setEditDescription] = useState();
  const [idItem, setIdItem] = useState();
  const [taskHistoric, setTaskHistoric] = useState([]);
  const [showOrder, setShowOrder] = useState(false);
  const [showImage, setShowImage] = useState(null);
  const [orderItem, setOrderItem] = useState(false);
  const [showEditAttachement, setShowEditAttachement] = useState(false);
  const [attachmentSend, setAttachmentSend] = useState(null);
  const [attachmentUpdate, setAttachmentUpdate] = useState(null);
  const [showMenu, setShowMenu] = useState(null);
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
        dispatch(updateTopic());
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
    // const handleClick = () => {
    //   if (ref.current)
    //     ref.current.scrollIntoView(true, {
    //       behavior: "smooth",
    //       block: "end",
    //     });
    // };

    function handleClick() {
      document.getElementById("topicList").scrollTop = 1000000000000;
    }

    handleClick();
  }, [showBottom]);

  useEffect(() => {
    const element = document.getElementById("upload-photo-icon");
    const image = document.getElementById("upload-photo");

    // console.log(image.files[0]);

    if (image.value !== null && image.value !== "") {
      element.classList.add("attachmentIcon");
    }
  }, [attachmentSend]);

  useEffect(() => {
    if (attachmentUpdate !== null) {
      const image = document.getElementById("upload-photo-update").files[0];
      let base64;
      convertBase64(image)
        .then((response) => (base64 = response))
        .then(() => {
          let onlyBase = base64.split(",");
          upAttachment(onlyBase[1], false);
        });
    }

    // console.log(base64);
  }, [attachmentUpdate]);

  // console.log(itemEdit)

  function SendInfo(msg, type, percent, state, item, remove) {
    if (msg !== "" && webSocket.websocketState === "connected") {
      switch (type) {
        case 2:
          try {
            let jsonString = {
              task_id: taskVisible.info.task_id,
              object: {
                description: msg,
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
    let image = document.getElementById("upload-photo").files[0];
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
      if (description !== "" && !image) {
        addItem(taskId, description, AUTH, null).then((response) => {
          if (response != null) {
            const newItem = {
              check: false,
              id: response.last_id,
              description: description,
              order: response.order,
              yes_no: response.yes_no,
              file: 0,
              note: "",
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
      } else if (description !== "") {
        convertBase64(document.getElementById("upload-photo").files[0]).then(
          (response) => {
            // console.log(response);
            let item = response.split(",");
            addItem(taskId, description, AUTH, item[1]).then((response) => {
              if (response != null) {
                const newItem = {
                  check: false,
                  id: response.last_id,
                  description: description,
                  order: response.order,
                  yes_no: response.yes_no,
                  file: 1,
                };

                taskVisible.task.task_item = [
                  ...taskVisible.task.task_item,
                  newItem,
                ];
                SendInfo(
                  "Novo item adicionado",
                  2,
                  response.percent,
                  "",
                  newItem
                );
                taskVisible.info.percent = response.percent;
                taskVisible.info.state_id = response.state_id;

                let changes = [...tasks];

                changes = changes.map((task) => {
                  if (task.id === taskVisible.info.task_id) {
                    if (task.state_id != response.state_id) {
                      SendInfo(
                        " para ",
                        6,
                        response.percent,
                        response.state_id
                      );
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
            setAttachmentSend(null);
            document.getElementById("upload-photo").value = "";
            document
              .getElementById("upload-photo-icon")
              .classList.remove("attachmentIcon");
          }
        );
      }
    }
  }

  function convertBase64(file) {
    // console.log(file);
    if (file !== null) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
        // console.log(reader);
      });
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
          dispatch(updateTopic());

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

  const [showFile, setShowFile] = useState(null);
  const [srcFile, setSrcFile] = useState(null);

  async function loadImage(id) {
    try {
      const { data } = await api.get(
        `GTPP/TaskItem.php?AUTH=${AUTH}&app_id=3&id=${id}`
      );

      // console.log(data);

      let url = String(data.data);

      // console.log(url);

      url = url.split(",");

      if (
        url[0].includes("png") ||
        url[0].includes("jpg") ||
        url[0].includes("gif") ||
        url[0].includes("jpeg")
      ) {
        setShowImage(convertImage(data.data));
      } else if (url[0].includes("zip") || url[0].includes("rar")) {
        setShowFile(".zip");
        setSrcFile(String(data.data));
      } else {
        setShowFile(convertFile(String(url[1])));
        setSrcFile(String(data.data));
        // convertFile(String(data.data));
      }
    } catch (error) {
      console.log(error);
    }
  }

  // console.log(srcFile)

  function convertImage(src) {
    try {
      if (src != null) {
        var image = new Image();
        image.src = src;

        // console.log(image.src);
        return image.src;
      } else {
        return null;
      }
    } catch (error) {
      console.log(error);
    }
  }

  function convertFile(src) {
    // let file;
    // if (src != null) {
    //   file = new File([""],"");
    //   file.src = src;

    //   console.log(file.src);
    //   // return file.src;
    // } else {
    //   // return null;
    // }

    // console.log(src);

    // console.log(atob(src));

    let file;

    try {
      file = atob(src);

      // console.log(file);
      return file;
    } catch (error) {
      console.log(error);
      return "";
    }

    // setShowFile(file);

    // var anchor = document.createElement("a");
    // anchor.href = src;
    // anchor.download = src;
    // document.body.appendChild(anchor);
    // anchor.click();

    // console.log('convert')

    // document.getElementById('my_iframe').src = src;

    // console.log(document.getElementById('my_iframe'));

    // return src;

    // var arr = src.split(","),
    //   mime = arr[0].match(/:(.*?);/)[1],
    //   bstr = atob(arr[1]),
    //   n = bstr.length,
    //   u8arr = new Uint8Array(n);

    // while (n--) {
    //   u8arr[n] = bstr.charCodeAt(n);
    // }

    // const file =  new File([u8arr], "", { type: mime });
    // console.log(file);
    // return file;
  }

  // console.log(showFile);

  const ref = React.createRef();

  let domNode = useClickOutside(() => {
    setShowImage(null);
    setShowMenu(null);
    setShowEditAttachement(false);
    setShowEditObs(false);
    setShowObs(null);
    setShowFile(null);
    setSrcFile(null);
  });

  function upAttachment(atacchment, deleteAttachment) {
    updateAttachment(
      AUTH,
      taskVisible.info.task_id,
      itemEdit.id,
      atacchment,
      deleteAttachment
    ).then(() => {
      dispatch(updateTopic());
      setAttachmentUpdate(null);
      setShowEditAttachement(false);
      setShowMenu(null);
    });
  }

  function upNote() {
    updateNote(AUTH, taskVisible.info.task_id, itemEdit.id, obs).then(() => {
      itemEdit.note = obs;
      dispatch(updateTopic());
      SendInfo(
        "Observação atualizada",
        2,
        taskVisible.info.percent,
        "",
        itemEdit
      );
      setShowEditObs(false);
    });
  }

  useEffect(() => {
    if (itemEdit) {
      setObs(itemEdit.note);
    }
  }, [itemEdit]);

  // console.log(itemEdit)

  const [obs, setObs] = useState(itemEdit ? itemEdit.note : "");

  const [showObs, setShowObs] = useState(false);

  return (
    <div className="taskTopicList">
      {showImage !== null ? (
        <div className="showImgAttachment" onClick={() => {}}>
          <img ref={domNode} src={showImage} alt="" />
        </div>
      ) : (
        ""
      )}

      {/* <iframe id="my_iframe" style={{display:"none"}} download></iframe> */}

      {/* <a href={showFile} download>
  <img src={showFile} alt="" width="104" height="142" />
</a> */}

      {showFile && (
        <div className="containerDownloadFile">
          <div ref={domNode} className="modalDownloadFile">
            <div className="downloadFileContent">
              <h3>Visualização do arquivo</h3>
              <p>{showFile}</p>
            </div>
            <div className="downloadFileActions">
              <a href={srcFile} download>
                <button type="button">
                  <FaCloudDownloadAlt size={30} color="#fff" />
                  Baixar arquivo
                </button>
              </a>
            </div>
          </div>
        </div>
      )}

      {showObs && (
        <div ref={domNode} className="itemObs">
          <h3>Observação</h3>

          <textarea readOnly>{showObs}</textarea>
        </div>
      )}

      {showEditObs && (
        <div className="editObsModal">
          <div ref={domNode} className="editObsBox">
            <h3>Observação</h3>
            <button type="button" style={{
                  position: "absolute",
                  marginLeft: "304px",
                  marginBottom: "340px",
                  backgroundColor:"transparent"
                }} onClick={() => {setShowEditObs(false)}}>
              <AiOutlineClose
                size={30}
                color="red"
                
              />
            </button>

            <textarea
              spellCheck="false"
              rows="5"
              value={obs !== null ? obs : ""}
              onChange={(e) => {
                setObs(e.target.value);
              }}
            ></textarea>
            <button type="button" onClick={() => upNote()}>
              Salvar
            </button>
          </div>
        </div>
      )}

      {showEditAttachement && (
        <div className="editAttachmentModal">
          <div ref={domNode} className="editAttachmentBox">
            <h3>Editar Anexo</h3>
            <ul>
              <li onClick={() => upAttachment("", true)}>
                <FaTrash size={25} color="red" />
                <span style={{ marginLeft: ".3em" }}>Excluir</span>
              </li>
              <label className="upload" htmlFor="upload-photo-update">
                <AiOutlinePaperClip
                  size={30}
                  style={{ marginRigth: "1.3em" }}
                />
                Alterar
                <input
                  type="file"
                  accept=".txt,.pdf,image/jpg,image/png,image/gif, image/jpeg,.rar,.zip"
                  name="photo"
                  id="upload-photo-update"
                  onChange={({ target }) =>
                    setAttachmentUpdate(target.files[0])
                  }
                />
              </label>
            </ul>
          </div>
        </div>
      )}
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
          title="Exibir histórico da tarefa"
        >
          <AiOutlineClockCircle size="23" color="white" />
        </button>

        {showHistoric ? (
          <div id={id} className="modalHistoric" onClick={() => {}}>
            <div>
              <div className="btnCloseHistoric">
                <button
                  title="Fechar"
                  type="button"
                  onClick={() => setShowHistoric(false)}
                >
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

            <div className="defineQuestion">
              <input
                type="checkbox"
                checked={itemEdit.yes_no !== 0 ? true : false}
                onChange={() => {
                  setYesNoOption(itemEdit);
                }}
              />
              <label style={{ marginLeft: " .75em" }}>
                Definir como questão
              </label>
            </div>
            <div className="defineQuestion">
              <button
                style={{ backgroundColor: "transparent" }}
                onClick={() => {
                  // setShowEdit(false);
                  setShowEditObs(true);
                }}
              >
                <GoNote size={23} color="#fff" />
              </button>
              <label style={{ marginLeft: "1em" }}>Observação</label>
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
                          title="Posição do tópico"
                        >
                          {item.order}
                        </a>

                        {item.yes_no === -1 ||
                        item.yes_no === 1 ||
                        item.yes_no === 2 ? (
                          <a>
                            <div className="yesOption">
                              <input
                                className="tick"
                                id={item.description + String(item.id)}
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
                              <label
                                htmlFor={item.description + String(item.id)}
                              >
                                Sim
                              </label>
                            </div>
                            <div className="noOption">
                              <input
                                id={item.description}
                                className="tick"
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
                              <label
                                htmlFor={item.description}
                                className="check-box"
                              >
                                Não
                              </label>
                            </div>
                          </a>
                        ) : null}

                        <a
                          className="menuItems"
                          onClick={() => setShowMenu(item.id)}
                        >
                          <GiHamburgerMenu size={20} color="#dddd" />
                        </a>
                      </div>
                    ) : (
                      <div className="topicLeft">
                        <a
                          title="Posição do tópico"
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

                        <a style={{ justifyContent: "center" }}>
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
                            id={item.description + String(item.id)}
                            checked={item.check}
                          />

                          <label
                            htmlFor={item.description + String(item.id)}
                          ></label>
                        </a>

                        <a
                          className="menuItems"
                          onClick={() => setShowMenu(item.id)}
                        >
                          <GiHamburgerMenu size={20} color="#dddd" />
                        </a>
                      </div>
                    )}

                    <div
                      className="topicDescription"
                      style={
                        item.yes_no === -1 ||
                        item.yes_no === 1 ||
                        item.yes_no === 2
                          ? { textAlign: "center" }
                          : null
                      }
                    >
                      {showMenu && showMenu === item.id ? (
                        <div ref={domNode} className="menuTopicItems">
                          <a
                            href=""
                            onClick={(e) => {
                              e.preventDefault();
                              setShowEdit(!showEdit);
                              setEditDescription(item.description);
                              setIdItem(item.id);
                              setItemEdit(item);
                            }}
                            title="Editar tópico"
                          >
                            <AiOutlineEdit
                              className="topicEdit"
                              size={20}
                              color="#fff"
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
                            title="Ordenar tópico"
                          >
                            <GoListUnordered
                              className="topicEdit"
                              size={20}
                              color="#fff"
                            />
                          </a>

                          <a
                            href=""
                            title="Editar anexo"
                            className="editAttachment"
                            onClick={(e) => {
                              e.preventDefault();
                              setShowEditAttachement(true);
                              setItemEdit(item);
                            }}
                          >
                            <AiOutlinePaperClip size={20} color="#fff" />
                          </a>

                          <a
                            title="Excluir tópico"
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
                      ) : null}

                      <label className="descriptionItem" htmlFor="">
                        {item.description}
                        {+item.file === 1 && (
                          <label
                            htmlFor=""
                            className="imgAttachment"
                            onClick={() => loadImage(item.id)}
                          >
                            <AiOutlinePaperClip size={20} title="Visualizar" />
                          </label>
                        )}
                      </label>

                      {item.note !== null && item.note !== "" && (
                        <label
                          style={{ cursor: "pointer" }}
                          onClick={() => setShowObs(item.note)}
                        >
                          <AiOutlineQuestionCircle size={25} />
                        </label>
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
          title="Adicionar item"
        >
          <BiCommentAdd size="27" color="white" />
        </button>

        <div style={{ marginLeft: 10 }}>
          <label
            className="upload"
            htmlFor="upload-photo"
            title="Anexar imagem"
          >
            <AiOutlinePaperClip size={27} id="upload-photo-icon" />
          </label>
          <input
            accept=".txt,.pdf,image/jpg,image/png,image/gif, image/jpeg,.rar,.zip"
            type="file"
            name="photo"
            id="upload-photo"
            onChange={({ target }) => setAttachmentSend(target.files[0])}
          />
        </div>
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

// style={
//   item.check || item.yes_no === 1 || item.yes_no === 2
//     ? { textDecoration: "line-through" }
//     : {}
// }
