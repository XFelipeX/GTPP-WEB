import React, { useState, useEffect } from "react";
// import { AiOutlineUserAdd } from "react-icons/ai";
import ConfirmAction from "../ConfirmAction";
import { BiEdit } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { updateTask, updateModal } from "../../redux";
import {
  updateFullDescription,
  formatDate,
  updateCheckDept,
  loadShopsCompany,
  loadDeptsCompany,
  updateStateTask,
  cancelStateTask,
} from "./functions";
import api from "../../services/api";
import "./style.css";
import useClickOutside from "../ClickOutside";
import ModalDescription from "../ModalDescription";
import InfoUserCard from '../InfoUserCard';

const TaskInfo = () => {
  const dispatch = useDispatch();
  const { taskStates } = useSelector((state) => state);
  const { taskVisible } = useSelector((state) => state);
  const { userPhotos } = useSelector((state) => state);
  const { taskCompanies } = useSelector((state) => state);
  const { modalUpdate } = useSelector((state) => state);
  // const {permissions} = useSelector(state => state);
  // const {vinculatedUsers} = useSelector(state => state);

  const [shops, setShops] = useState([]);
  const [depts, setDepts] = useState([]);
  const [company, setCompany] = useState(false);
  const [shop, setShop] = useState({});

  const [taskcsds, setTaskcsds] = useState([]);
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [showDayModal, setShowDayModal] = useState(false);

  const [days, setDays] = useState(1);

  // console.log(taskVisible)

  const [fullDescription, setFullDescription] = useState(
    taskVisible.task.full_description
  );
  const [showInfoUser,setShowInfoUser] = useState(false);
  const [infoUserId,setInfoUserId] = useState();

  const [reason, setReason] = useState("");
  // const [vinculatedUsers, setVinculatedUsers] = useState([]);
  const { vinculatedUsers } = useSelector((state) => state);
  const [showFullDesc, setShowFullDesc] = useState(false);

  const [showDept, setShowDept] = useState(false);
  const { stateUpdate } = useSelector((state) => state);
  const [users, setUsers] = useState([]);

  // console.log(taskVisible)

  const [showModalAsk, setShowModalAsk] = useState(false);

  const { permissions } = useSelector((state) => state);
  const AUTH = permissions.session;

  useEffect(() => {
    async function loadTaskVisible() {
      // let AUTH = sessionStorage.getItem("token");
      let { data } = await api.get(
        "GTPP/Task.php?AUTH=" +
          AUTH +
          "&app_id=3&id=" +
          taskVisible.info.task_id
      );

      // console.log(taskVisible)
      // console.log(data);

      if (data.data.csds == null) {
        // console.log('aqui')
        setTaskcsds([]);
        setDepts([]);
        setShops([]);
        setCompany(false);
        setShowDept(false);
      } else {
        setTaskcsds(data.data.csds);
      }

      if (data.data.csds != null) {
        loadShopsCompany(data.data.csds[0].company_id,AUTH).then((response) => {
          setShops(response.data);
        });
        loadDeptsCompany(
          data.data.csds[0].company_id,
          data.data.csds[0].shop_id,
          taskVisible.info.task_id,
          AUTH
        ).then((response) => {
          setDepts(response);
        });
        setCompany(data.data.csds[0].company_id);
        setShop(data.data.csds[0].shop_id);
        // return true;
      } 
    }

    loadTaskVisible();
  }, [modalUpdate]);

  //formatando datas
  const dateInitial = formatDate(
    taskVisible.info ? taskVisible.info.initial_date : ""
  );
  const dateFinal = formatDate(
    taskVisible.info ? taskVisible.info.final_date : ""
  );

  function upFullDescription(taskId, description) {
    updateFullDescription(taskId, description,AUTH).then(() => {
      setFullDescription(description);
    });
    setShowFullDesc(false);
    dispatch(updateTask());
  }

  async function loadVinculateUsers() {
    const { data } = await api.get("GTPP/Task_User.php", {
      params: {
        AUTH: AUTH,
        task_id: taskVisible.info.task_id,
        list_user: 0,
        app_id: 3,
      },
    });
    // console.log(data);
    try {
      // dispatch(getVinculatedUsers(data.data));
      setUsers(data.data);
    } catch (error) {}

    // console.log(users)
    // console.log(task.id)
  }

  useEffect(() => {
    loadVinculateUsers();
  }, []);

  useEffect(() => {
    // console.log(company)
    function loadShops() {
      if (company != "-1") {
        // dispatch(getDepts([]));
        setDepts(false);
        setShowDept(false);
        setCompany(company);
        loadShopsCompany(company,AUTH).then((response) => {
          setShops(response.data);
        });
      }
    }

    loadShops();
  }, [company]);

  // useEffect(() => {
  //   loadShopsCompany(company).then((response) => {
  //     setShops(response.data);
  //   });
  // }, []);

  useEffect(() => {
    loadDeptsCompany(company, shop, taskVisible.info.task_id,AUTH).then(
      (response) => {
        setDepts(response);
      }
    );
  }, [shop, modalUpdate]);

  // function loadCsds(){
  //   for (let i = 0; i < taskcsds.length; i++) {
  //     changeCheckDept(
  //       taskVisible.info.task_id,
  //       taskcsds[i].depart_id,
  //       taskcsds[i].shop_id,
  //       taskcsds[i].company_id
  //     );
  //   }
  // }

  // console.log(taskVisible)

  function changeCheckDept(taskId, deptId, shopId, companyId) {
    if (shopId == "-1" || companyId == "-1") {
      alert("Selecione companhia e loja!");
    } else {
      try {
        if (taskcsds != null) {
          // console.log(taskcsds);

          let csds = taskcsds.filter((csds) => csds.company_id !== companyId || csds.shop_id !== shopId);

          if (csds.length >= 1) {
            // console.log(csds);
            updateCheckDept(
              taskId,
              csds[0].depart_id,
              csds[0].shop_id,
              csds[0].company_id,
              AUTH
            );

            dispatch(updateModal());
          }

      
        }

        updateCheckDept(taskId, deptId, shopId, companyId,AUTH)
          .then((response) => {
            if (response == null) {
              setShowDept(false);
              setDepts([]);
              // loadCsds();
            }

            // setShop(shop);
          })
          .then(() => dispatch(updateModal()));
      } catch (error) {
        console.log(error);
        console.log("Erro ao selecionar departamento!");
      }
    }
  }

  let domNodeDept = useClickOutside(() => {
    setShowDept(false);
  });

  function updateState(stateId, reason, days) {
    // console.log("estado atual é o "+taskVisible);
    if (taskVisible.info.state_id == 1 || taskVisible.info.state_id == 2) {
      if (reason == null) {
        setShowReasonModal(true);
      } else if (reason === "") {
        alert("o motivo é obrigatório!");
      } else {
        updateStateTask(taskVisible.info.task_id, reason,null,AUTH)
          .then((response) => (taskVisible.info.state_id = response[0].id))
          .catch((error) => {});
        dispatch(updateTask());
        dispatch(updateModal());
        setShowReasonModal(false);
        setReason("");
      }
    } else if (taskVisible.info.state_id == 5) {
      if (days == null) {
        setShowDayModal(true);
      } else {
        updateStateTask(taskVisible.info.task_id, reason, days,AUTH)
          .then(
            (response) => (
              // console.log(response.id),
              (taskVisible.info.state_id = response.id),
              (taskVisible.info.final_date = response.final_date)
            )
          )
          .catch((error) => {
            // console.log(error.message);
          });
        dispatch(updateTask());
        dispatch(updateModal());
        setShowDayModal(false);
        setDays("");
      }
    } else if (taskVisible.info.state_id !== 5) {
      if (confirm == false) {
        setShowConfirmAction(true);
        return;
      } else if (confirm == true) {
        updateStateTask(taskVisible.info.task_id,null,null,AUTH)
          .then((response) => (taskVisible.info.state_id = response[0].id))
          .then((response) => {
            dispatch(updateTask());
            dispatch(updateModal());
            setShowConfirmAction(false);
            setShowConfirmAction(false);
          })
          .catch((error) => {
            console.log(error);
          });

        return;
      }
      // updateStateTask(taskVisible.info.task_id).then(response => taskVisible.info.state_id = response.id);
      // dispatch(updateTask());
      // dispatch(updateModal());
    }
  }

  function cancelTask(taskId, reason) {
    // console.log("estado atual é o "+stateId);
    if (reason === "") {
      alert("o motivo é obrigatório!");
      return;
    }

    // console.log('aqui')
    cancelStateTask(taskId, reason,AUTH)
      .then((response) => (taskVisible.info.state_id = response.id))
      .catch((error) => {
        // console.log(error);
      });
    dispatch(updateTask());
    dispatch(updateModal());
    setShowModalAsk(false);
  }

 
  // console.log(taskVisible)

  //contador button estados
  let count = 0;

  const [showConfirmAction, setShowConfirmAction] = useState(false);
  const [confirm, setConfirm] = useState(false);

  let ModalCancel = (props) => {
    const [reason, setReason] = useState("");
    return (
      <div className="modalAsk">
        <div>
          <ul className="menuAsk">
            <li>
              <h3>{props.ask}, tem certeza?</h3>
              <h2>*Informe o motivo:</h2>
              <textarea
                spellCheck="false"
                rows="5"
                onChange={(e) => setReason(e.target.value)}
              ></textarea>
            </li>
            <li>
              <button
                className="btnConfirm"
                onClick={(e) => cancelTask(taskVisible.info.task_id, reason,AUTH)}
              >
                Confirmar
              </button>
              <button
                className="btnCancel"
                onClick={() => setShowModalAsk(false)}
              >
                Cancelar
              </button>
            </li>
          </ul>
        </div>
      </div>
    );
  };

  if (users.length > 0) {
    users.map((user) => {
      let result = vinculatedUsers.filter((users) => users.id == user.user_id);

      user.name = result[0].user;
      // console.log(user.name)
    });
  }

  // console.log(vinculatedUsers);
  // console.log(taskVisible)

  return (
    <div className="taskInfo">
      {showConfirmAction ? (
        <>
          {taskVisible.info.state_id == 6 || taskVisible.info.state_id == 4 ? (
            <ConfirmAction
              confirm={() => setConfirm(true)}
              question="Tem certeza que deseja reabrir esta tarefa"
              action={() => updateState(taskVisible.info.state_id)}
              cancelAction={() => setShowConfirmAction(false)}
            />
          ) : null}
          {taskVisible.info.state_id == 3 ? (
            <ConfirmAction
              confirm={() => setConfirm(true)}
              question="Tem certeza que deseja finalizar esta tarefa"
              action={() => updateState(taskVisible.info.state_id)}
              cancelAction={() => setShowConfirmAction(false)}
            />
          ) : null}
          {/* {taskVisible.state_id == 7 ? (<ConfirmAction confirm={() => setConfirm(true)} question="Tem certeza que deseja finalizar esta tarefa" action={() => updateState(taskVisible.state_id)} cancelAction={() => setShowConfirmAction(false)}/> ) : null} */}
        </>
      ) : null}

      {showReasonModal ? (
        <div className="modalState">
          <div>
            <ul className="menuState">
              <li>
                <h3>
                  Alterar tarefa para o estado <strong>parado</strong>?
                </h3>
                <h2>*Informe o motivo:</h2>
                <textarea
                  spellcheck="false"
                  rows="5"
                  onChange={(e) => setReason(e.target.value)}
                ></textarea>
              </li>
              <li>
                <button
                  className="btnConfirm"
                  onClick={(e) =>
                    updateState(taskVisible.info.state_id, reason)
                  }
                >
                  Confirmar
                </button>
                <button
                  className="btnCancel"
                  onClick={() => setShowReasonModal(false)}
                >
                  Cancelar
                </button>
              </li>
            </ul>
          </div>
        </div>
      ) : null}

      {showDayModal ? (
        <div className="modalDays">
          <div>
            <ul className="menuDays">
              <li>
                <h3>
                  Informe a quantidade de dias que deseja prolongar esta tarefa:
                </h3>
                <input
                  type="number"
                  min="1"
                  value={days}
                  spellCheck="false"
                  rows="5"
                  onChange={(e) => setDays(e.target.value)}
                ></input>
              </li>
              <li>
                <button
                  className="btnConfirm"
                  onClick={(e) =>
                    updateState(taskVisible.info.state_id, reason, days)
                  }
                >
                  Confirmar
                </button>
                <button
                  className="btnCancel"
                  onClick={() => setShowDayModal(false)}
                >
                  Cancelar
                </button>
              </li>
            </ul>
          </div>
        </div>
      ) : null}

      {showModalAsk ? (
        taskVisible.info.state_id != 7 ? (
          <ModalCancel ask="Cancelando a tarefa" />
        ) : (
          <ModalCancel ask="Retomando a tarefa" />
        )
      ) : null}

      <div className="row">
        <h1>Início : {dateInitial}</h1>
        <h1>Fim : {dateFinal}</h1>

        {taskStates.map((state) => (
          <React.Fragment key={state.id}>
            {taskVisible.info ? (
              state.id == taskVisible.info.state_id ? (
                <button
                  onClick={() => {
                    count++;

                    setTimeout(() => {
                      if (count == 1 && state.id !== 7) {
                        if (state.id == 6 || state.id == 3 || state.id == 4) {
                          setShowConfirmAction(true);
                        } else {
                          updateState(state.id);
                        }
                      } else if (count == 2) {
                        setShowModalAsk(true);
                        return;
                      }
                    }, 500);

                    setTimeout(() => {
                      count = 0;
                    }, 500);
                  }}
                  className="buttonState stateControl"
                  style={{ backgroundColor: "#" + state.color }}
                >
                  {/* {console.log(state.color)} */}
                  <h2>{state.description}</h2>
                </button>
              ) : null
            ) : null}
          </React.Fragment>
        ))}
      </div>

      <div className="comshopsubArea">
        <div className="row">
          <div className="col taskDescription">
            <div className="descriptionArea">
              <h1>Descrição Completa:</h1>
              <textarea
                placeholder="Esta tarefa tem como objetivo..."
                spellCheck="false"
                rows="5"
                value={fullDescription}
                readOnly
              ></textarea>
              <BiEdit
                size="25"
                onClick={() => setShowFullDesc(!showFullDesc)}
                className="btnEdit"
              />
            </div>

            {showFullDesc ? (
              <ModalDescription
                description={fullDescription}
                setShowDesc={(info) => setShowFullDesc(info)}
                updateDesc={(info) =>
                  upFullDescription(taskVisible.info.task_id, info)
                }
                question="Descrição completa da tarefa"
              />
            ) : null}
          </div>
        </div>
        <div className="rowCompShop">
          <div>
            <select
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              id="company"
            >
              <option value="-1">Selecionar Companhia</option>

              {taskCompanies.map((comp) => (
                <>
                  <option key={comp.id} value={comp.id}>
                    {comp.description}
                  </option>
                </>
              ))}
            </select>
          </div>

          <div>
            <select
              id="shop"
              value={shop}
              onChange={(e) => setShop(e.target.value)}
            >
              <option value="-1">Selecionar Loja</option>

              {shops
                ? shops.map((shop) => (
                    <>
                      <option key={shop.id} value={shop.id}>
                        {shop.description}
                      </option>
                    </>
                  ))
                : null}
            </select>
          </div>

          <div>
            <div ref={domNodeDept} className="depts">
              <p onClick={() => (depts ? setShowDept(!showDept) : null)}>
                Departamentos
              </p>

              {showDept ? (
                <ul className="menuDept">
                  {depts.length>0
                    ? depts.map((dept) => (
                        <li key={dept.id}>
                          <>
                            <label htmlFor="">{dept.description}</label>
                            <input
                              type="checkbox"
                              checked={dept.check}
                              onChange={(e) => {
                                changeCheckDept(
                                  taskVisible.info.task_id,
                                  dept.id,
                                  shop,
                                  company
                                );
                              }}
                            />
                          </>
                        </li>
                      ))
                    : null}
                </ul>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <div className="usersVinculated">
        <div className="user">
          {users.map((user) => (
            <React.Fragment key={user.user_id}>
              {userPhotos.map((userPhoto) => (
                <React.Fragment key={userPhoto.user_id}>
                  {user.user_id == userPhoto.user_id ? (
                    <div className="userControl">
                      <img
                        src={userPhoto.photo}
                        width="35"
                        height="35"
                        alt={user.name}
                        title={user.name}
                        onClick={() => (setShowInfoUser(true), setInfoUserId(user.user_id))}
                      />
                    </div>
                  ) : null}
                </React.Fragment>
              ))}
            </React.Fragment>
          ))}
        </div>

        {showInfoUser ==true ? (
          <InfoUserCard id={infoUserId} close={() => setShowInfoUser(false)}/>
        ) : null}
        {/* <div className="addUser">
                <div>
                  <AiOutlineUserAdd size="20" />
                </div>
              </div>
              </div> */}
      </div>
    </div>
  );
};

export default TaskInfo;
