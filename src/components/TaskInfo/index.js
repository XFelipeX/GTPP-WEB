import React, { useState, useEffect } from 'react';
import ConfirmAction from '../ConfirmAction';
import { BiEdit } from 'react-icons/bi';
import { useDispatch, useSelector } from 'react-redux';
import ModalCancel from '../ModalCancel';
import {
  updateTask,
  updateModal,
  orderTasks,
  updateStateAdmin,
  setDoVisi,
  setDoingVisi,
  setAnalyzeVisi,
  setStoppedVisi,
  setBlockedVisi,
  setDoneVisi,
  setCanceledVisi,
  removeWarning,
} from '../../redux';
import {
  updateFullDescription,
  formatDate,
  updateCheckDept,
  loadShopsCompany,
  loadDeptsCompany,
  updateStateTask,
  cancelStateTask,
} from './functions';
import { showNotification } from '../../Utils/Notify';
import api from '../../services/api';
import './style.css';
import useClickOutside from '../ClickOutside';
import ModalDescription from '../ModalDescription';
import InfoUserCard from '../InfoUserCard';

const TaskInfo = () => {
  const dispatch = useDispatch();
  const { seeAdminSet } = useSelector((state) => state);
  const { tasks } = useSelector((state) => state);
  const { taskStates } = useSelector((state) => state);
  const { taskVisible } = useSelector((state) => state);
  const { userPhotos } = useSelector((state) => state);
  const { taskCompanies } = useSelector((state) => state);
  const { modalUpdate } = useSelector((state) => state);
  const { webSocket } = useSelector((state) => state);
  const [shops, setShops] = useState([]);
  const [depts, setDepts] = useState([]);
  const [company, setCompany] = useState(false);
  const [shop, setShop] = useState({});
  const [taskcsds, setTaskcsds] = useState([]);
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [showDayModal, setShowDayModal] = useState(false);
  const [days, setDays] = useState(1);
  const [fullDescription, setFullDescription] = useState(
    taskVisible.task.full_description,
  );
  const [showInfoUser, setShowInfoUser] = useState(false);
  const [infoUserId, setInfoUserId] = useState();
  const [reason, setReason] = useState('');
  const { vinculatedUsers } = useSelector((state) => state);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [showDept, setShowDept] = useState(false);
  const [users, setUsers] = useState([]);
  const { filterTask } = useSelector((state) => state);
  const [showModalAsk, setShowModalAsk] = useState(false);
  const { permissions } = useSelector((state) => state);
  const AUTH = permissions.session;

  useEffect(() => {
    setFullDescription(taskVisible.task.full_description);
  }, [taskVisible.task.full_description]);

  useEffect(() => {
    async function loadTaskVisible() {
      let { data } = await api.get(
        'GTPP/Task.php?AUTH=' +
          AUTH +
          '&app_id=3&id=' +
          taskVisible.info.task_id,
      );

      if (data.error === true) {
      } else {
        if (data.data && data.data.csds && data.data.csds == null) {
          setTaskcsds([]);
          setDepts(null);
          setShops([]);
          setCompany(false);
          setShop(false);
          setShowDept(false);
        } else {
          setTaskcsds(data.data.csds);
        }

        if (data.data.csds != null) {
          loadShopsCompany(data.data.csds[0].company_id, AUTH).then(
            (response) => {
              setShops(response.data);
            },
          );
          loadDeptsCompany(
            data.data.csds[0].company_id,
            data.data.csds[0].shop_id,
            taskVisible.info.task_id,
            AUTH,
          ).then((response) => {
            setDepts(response);
          });
          setCompany(data.data.csds[0].company_id);
          setShop(data.data.csds[0].shop_id);
        }
      }
    }

    loadTaskVisible();
  }, [modalUpdate]);

  //dates task
  const dateInitial = formatDate(
    taskVisible.info ? taskVisible.info.initial_date : '00-00-0000',
  );
  const dateFinal = formatDate(
    taskVisible.info ? taskVisible.info.final_date : '00-00-0000',
  );

  function upFullDescription(taskId, description) {
    updateFullDescription(taskId, description, AUTH).then((response) => {
      setFullDescription(taskVisible.task.full_description);
      if (
        response.includes('Only the task creator or administrator can do this')
      ) {
        showNotification(
          'Aviso',
          'Somente o criador da tarefa ou administrador pode fazer isto',
          'warning',
        );
      } else if (response.includes('The full description cannot be empty')) {
        showNotification(
          'Aviso',
          'A descrição completa não pode estar vazia',
          'warning',
        );
      } else if (response.includes('Task with this state cannot be modified')) {
        showNotification(
          'Aviso',
          'Tarefa neste estado não pode ser modificada',
          'warning',
        );
      } else if (response.includes('No data to Update')) {
        showNotification(
          'Aviso',
          'Sem dados para atualizar, modifique a descrição',
          'warning',
        );
      } else if (
        response.includes(
          '(id, full_description || (description, priority)) is broken',
        )
      ) {
        showNotification(
          'Aviso',
          'Preencha o campo de descrição para atualizar',
          'warning',
        );
      } else {
        showNotification(
          'Sucesso',
          'Descrição completa atualizada com sucesso',
          'success',
        );

        setFullDescription(description);
        taskVisible.task.full_description = description;
        SendInfo('A descrição completa da tarefa foi atualizada', 3);
      }

      tasks.map((task) => {
        if (task.id === taskVisible.info.task_id) {
          task.full_description = description;
        }
      });
    });
    setShowFullDesc(false);
  }

  useEffect(() => {
    async function loadVinculateUsers() {
      const { data } = await api.get('GTPP/Task_User.php', {
        params: {
          AUTH: AUTH,
          task_id: taskVisible.info.task_id,
          list_user: 0,
          app_id: 3,
        },
      });
      try {
        setUsers(data.data);
      } catch (error) {}
    }
    loadVinculateUsers();
  }, []);

  useEffect(() => {
    function loadShops() {
      if (company != '-1') {
        setDepts(false);
        setShowDept(false);
        setCompany(company);
        loadShopsCompany(company, AUTH).then((response) => {
          setShops(response.data);
        });
      }
    }

    loadShops();
  }, [company]);

  useEffect(() => {
    loadDeptsCompany(company, shop, taskVisible.info.task_id, AUTH).then(
      (response) => {
        setDepts(response);
      },
    );
  }, [shop, modalUpdate]);

  function changeCheckDept(taskId, deptId, shopId, companyId) {
    if (shopId == '-1' || companyId == '-1') {
      showNotification('Aviso', 'Selecione companhia e loja', 'warning');
    } else {
      try {
        updateCheckDept(taskId, deptId, shopId, companyId, AUTH)
          .then((response) => {
            if (response == null) {
              setShowDept(false);
              setDepts([]);
            }
          })
          .then(() => {
            dispatch(updateModal());
            if (seeAdminSet === true) {
              dispatch(updateStateAdmin());
            } else {
              dispatch(updateTask());
            }
          });
      } catch (error) {
        showNotification('Erro', String(error), 'danger');
      } finally {
        dispatch(orderTasks());
      }
    }
  }

  let domNodeDept = useClickOutside(() => {
    setShowDept(false);
  });

  function updateState(stateId, reason, days) {
    if (
      taskVisible.info.state_id == 1 ||
      taskVisible.info.state_id == 2 ||
      taskVisible.info.state_id == 6
    ) {
      if (reason == null) {
        setShowReasonModal(true);
      } else if (reason === '') {
        showNotification('Aviso', 'motivo é obrigatório', 'warning');
      } else {
        updateStateTask(taskVisible.info.task_id, reason, null, AUTH)
          .then((response) => {
            taskVisible.info.state_id = response[0].id;
            verifyState(response[0].id);

            let changes = [...tasks];
            changes = changes.map((task) => {
              if (task.id === taskVisible.info.task_id) {
                if (Number(task.state_id) !== Number(response[0].id)) {
                  SendInfo('send', 6);
                }
                task.state_id = response[0].id;
              }
            });
          })
          .catch((error) => {});
        if (seeAdminSet === true) {
          dispatch(updateStateAdmin());
        } else {
          dispatch(updateTask());
        }
        dispatch(updateModal());
        setShowReasonModal(false);
        setReason('');
      }
    } else if (taskVisible.info.state_id == 5) {
      if (days == null) {
        setShowDayModal(true);
      } else {
        updateStateTask(taskVisible.info.task_id, reason, days, AUTH)
          .then((response) => {
            taskVisible.info.state_id = response.id;
            taskVisible.info.final_date = response.final_date;
            verifyState(response.id);

            let changes = [...tasks];
            changes = changes.map((task) => {
              if (task.id === taskVisible.info.task_id) {
                if (Number(task.state_id) !== Number(response.id)) {
                  SendInfo('send', 6, taskVisible.info.final_date);
                }
                task.final_date = response.final_date;
                task.state_id = response.id;
              }
            });

            dispatch(removeWarning(taskVisible.info));
          })
          .catch((error) => {
            console.log(error.message);
          });
        if (seeAdminSet === true) {
          dispatch(updateStateAdmin());
        } else {
          dispatch(updateTask());
        }
        dispatch(updateModal());
        setShowDayModal(false);
        setDays('');
      }
    } else if (taskVisible.info.state_id !== 5) {
      updateStateTask(taskVisible.info.task_id, null, null, AUTH)
        .then((response) => {
          taskVisible.info.state_id = response[0].id;
          verifyState(response[0].id);

          let changes = [...tasks];
          changes = changes.map((task) => {
            if (task.id === taskVisible.info.task_id) {
              if (Number(task.state_id) !== Number(response[0].id)) {
                SendInfo('send', 6);
              }

              task.state_id = response[0].id;
            }
          });
        })
        .then(() => {
          if (seeAdminSet === true) {
            dispatch(updateStateAdmin());
          }
          setShowConfirmAction(false);
        })
        .catch((error) => {
          console.log(error);
        });

      return;
    }
  }

  function verifyState(state) {
    if (state == 1 && filterTask.do === false) {
      dispatch(setDoVisi(true));
    }
    if (state == 2 && filterTask.doing === false) {
      dispatch(setDoingVisi(true));
    }
    if (state == 3 && filterTask.analyze === false) {
      dispatch(setAnalyzeVisi(true));
    }
    if (state == 4 && filterTask.stopped === false) {
      dispatch(setStoppedVisi(true));
    }
    if (state == 5 && filterTask.blocked === false) {
      dispatch(setBlockedVisi(true));
    }
    if (state == 6 && filterTask.done === false) {
      dispatch(setDoneVisi(true));
    }
    if (state == 7 && filterTask.canceled === false) {
      dispatch(setCanceledVisi(true));
    }
  }

  function cancelTask(taskId, reason) {
    if (reason === '') {
      showNotification('Aviso', 'O motivo é obrigatório', 'warning');
      return;
    }

    cancelStateTask(taskId, reason, AUTH)
      .then((response) => {
        setShowModalAsk(false);

        taskVisible.info.state_id = response.id;

        let changes = [...tasks];
        changes = changes.map((task) => {
          if (task.id === taskVisible.info.task_id) {
            if (Number(task.state_id) !== Number(response.id)) {
              SendInfo('send', 6);
            }
            task.state_id = response.id;
          }
        });

        verifyState(response.id);

        if (seeAdminSet === true) {
          dispatch(updateStateAdmin());
        } else {
          dispatch(updateTask());
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  //count button change state
  let count = 0;

  const [showConfirmAction, setShowConfirmAction] = useState(false);
  const [confirm, setConfirm] = useState(false);

  if (users.length > 0) {
    users.map((user) => {
      let result = vinculatedUsers.filter(
        (users) => Number(users.id) === Number(user.user_id),
      );
      user.name = result[0].name;
    });
  }

  useEffect(() => {
    if (webSocket.users !== undefined) {
      users.map((user) => {
        webSocket.users.forEach((item, index) => {
          if (user.user_id == item) {
            user.status = true;
          }
        });
      });
    }
  }, [webSocket]);

  function SendInfo(msg, type, newDateFinal) {
    if (msg !== '' && webSocket.websocketState === 'connected') {
      switch (type) {
        case 3:
          try {
            let jsonString = {
              task_id: taskVisible.info.task_id,
              object: {
                description: msg,
                task_id: taskVisible.info.task_id,
                full_description: taskVisible.task.full_description,
              },

              date_time: null,
              user_id: Number(permissions.id),
              type: type,
            };
            webSocket.websocket.send(JSON.stringify(jsonString));
          } catch (error) {
            console.log(error);
          }
          break;
        case 6:
          try {
            let jsonString = {
              task_id: taskVisible.info.task_id,
              object: {
                description: msg,
                task_id: taskVisible.info.task_id,
                state_id: taskVisible.info.state_id,
                percent: taskVisible.info.percent,
                new_final_date: newDateFinal,
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

  function verifyStatus(userId) {
    const filter = webSocket.users.filter((id) => id == userId);

    if (filter[0]) {
      return 'online';
    } else {
      return '';
    }
  }

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
        </>
      ) : null}

      {showReasonModal ? (
        <div className="modalState">
          <div>
            <ul className="menuState">
              <li>
                <h3>
                  {taskVisible.info.state_id == 6
                    ? 'Deseja retomar a tarefa?'
                    : 'Alterar tarefa para o estado Parado?'}
                </h3>
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
          <ModalCancel
            ask="Cancelando a tarefa"
            reason={reason}
            setReason={(e) => setReason(e)}
            cancelTask={() =>
              cancelTask(taskVisible.info.task_id, reason, AUTH)
            }
            close={() => setShowModalAsk(false)}
          />
        ) : (
          <ModalCancel
            ask="Retomando a tarefa"
            reason={reason}
            setReason={(e) => setReason(e)}
            cancelTask={() =>
              cancelTask(taskVisible.info.task_id, reason, AUTH)
            }
            close={() => setShowModalAsk(false)}
          />
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
                        if (state.id == 3 || state.id == 4) {
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
                  title="Estado atual"
                  className="buttonState stateControl"
                  style={{ backgroundColor: '#' + state.color }}
                >
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
              <h1>
                Descrição Completa:{' '}
                <BiEdit
                  size="25"
                  onClick={() => setShowFullDesc(!showFullDesc)}
                  className="btnEdit"
                  title="Editar"
                />
              </h1>
              <textarea
                placeholder="Esta tarefa tem como objetivo..."
                spellCheck="false"
                rows="5"
                defaultValue={fullDescription}
                readOnly
              ></textarea>
            </div>

            {showFullDesc ? (
              <ModalDescription
                showDelete={false}
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
              style={
                taskcsds
                  ? {
                      pointerEvents: 'none',
                      backgroundColor: '#343434',
                      color: '#fff',
                    }
                  : {}
              }
            >
              <option value="-1">Selecionar Companhia</option>

              {taskCompanies.map((comp) => (
                <option key={comp.id} value={comp.id}>
                  {comp.description}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              id="shop"
              value={shop}
              onChange={(e) => setShop(e.target.value)}
              style={
                taskcsds
                  ? {
                      pointerEvents: 'none',
                      backgroundColor: '#343434',
                      color: '#fff',
                    }
                  : {}
              }
            >
              <option value="-1">Selecionar Loja</option>

              {shops
                ? shops.map((shop) => (
                    <option key={shop.id} value={shop.id}>
                      {shop.description}
                    </option>
                  ))
                : null}
            </select>
          </div>

          <div>
            <div ref={domNodeDept} className="depts">
              <p onClick={() => (depts ? setShowDept(!showDept) : null)}>
                Departamentos
              </p>

              {showDept && shop && company ? (
                <ul className="menuDept">
                  {depts !== null
                    ? depts.map((dept) => (
                        <li key={dept.id}>
                          <label htmlFor="">{dept.description}</label>
                          <input
                            type="checkbox"
                            checked={dept.check}
                            onChange={(e) => {
                              changeCheckDept(
                                taskVisible.info.task_id,
                                dept.id,
                                shop,
                                company,
                              );
                              dispatch(updateTask());
                            }}
                          />
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
          <div className="userControl">
            {taskVisible.owner ? (
              <img
                className={verifyStatus(taskVisible.owner[0].id)}
                src={taskVisible.owner[0].photo}
                width="35"
                height="35"
                alt={taskVisible.owner[0].name}
                title={taskVisible.owner[0].name}
                onClick={() => (
                  setShowInfoUser(true), setInfoUserId(taskVisible.owner[0].id)
                )}
              />
            ) : null}
          </div>
          {users.map((user) => (
            <React.Fragment key={user.user_id}>
              {userPhotos.map((userPhoto) => (
                <React.Fragment key={userPhoto.user_id}>
                  {user.user_id == userPhoto.user_id ? (
                    <div className="userControl">
                      <img
                        className={verifyStatus(user.user_id)}
                        src={userPhoto.photo}
                        width="35"
                        height="35"
                        alt={user.name}
                        title={user.name}
                        onClick={() => (
                          setShowInfoUser(true), setInfoUserId(user.user_id)
                        )}
                      />
                    </div>
                  ) : null}
                </React.Fragment>
              ))}
            </React.Fragment>
          ))}
        </div>

        {showInfoUser == true ? (
          <InfoUserCard id={infoUserId} close={() => setShowInfoUser(false)} />
        ) : null}
      </div>
    </div>
  );
};

export default TaskInfo;
