import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import api from '../../services/api';
import './style.css';
import userEmpty from '../../assets/nullphoto.jpeg';
import Task from '../Task';
import {
  loadTask,
  loadTaskStates,
  loadCompanies,
  loadShop,
  loadDept,
  loadNotifications,
} from './functions';
import {
  getStates,
  setPhotos,
  getCompany,
  getTask,
  getDepts,
  getShop,
  getVinculatedUsers,
  getTaskFilter,
  getNotifications,
  setTotalUser,
  setTotalAdmin,
  setPageAdmin,
  setPageUser,
} from '../../redux';
import ReactPaginate from 'react-paginate';
import Loading from '../Loading';
import { setPageSearch } from '../../redux/Pagination/PaginationActions';
import { showNotification } from '../../Utils/Notify';

const TaskTable = (props) => {
  const { permissions } = useSelector((state) => state);
  const { filterTask } = useSelector((state) => state);
  const { stateAdmin } = useSelector((state) => state);
  const { seeAdminSet } = useSelector((state) => state);
  const { pagination } = useSelector((state) => state);
  const AUTH = permissions.session;
  const { stateUpdate } = useSelector((state) => state);
  const { visionMenu } = useSelector((state) => state);
  const [vinculatedUsers, setVinculatedUsers] = useState([]);
  const [takePhotos, setTakePhotos] = useState([]);
  const { tasks } = useSelector((state) => state);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    async function loadVinculateUsers() {
      const { data } = await api.get(
        'CCPP/Employee.php?AUTH=' + AUTH + '&app_id=3',
      );

      try {
        dispatch(getVinculatedUsers(data.data));
        setVinculatedUsers(data.data);
      } catch (error) {}
    }

    let amountNotify = [];

    function sumNotification(type, taskId, object) {
      if (type === 1) {
        if (amountNotify && amountNotify.length > 0) {
          let taskNotification = [...amountNotify];
          let isNewNotification = true;

          taskNotification.map((notification) => {
            if (notification.task_id === taskId) {
              if (notification.content.object) {
                notification.content.message += 1;
                notification.content.amount += 1;
                notification.content.object = [
                  ...notification.content.object,
                  object,
                ];
                isNewNotification = false;
              }
            }
          });

          if (isNewNotification) {
            const notification = {
              task_id: taskId,
              content: { message: 1, amount: 1, object: [object] },
            };
            amountNotify = (oldarray) => [...oldarray, notification];
          } else {
            amountNotify = [...taskNotification];
          }
        } else {
          const notification = {
            task_id: taskId,
            content: { message: 1, amount: 1, object: [object] },
          };
          amountNotify.push(notification);
        }
      } else {
        if (amountNotify.length > 0) {
          let taskNotification = [...amountNotify];
          let isNewNotification = true;

          taskNotification.map((notification) => {
            if (notification.task_id === taskId) {
              if (notification.content.object) {
                isNewNotification = false;
                notification.content.amount += 1;
                notification.content.object = [
                  ...notification.content.object,
                  object,
                ];
              }
            }
          });

          if (isNewNotification) {
            const notification = {
              task_id: taskId,
              content: { message: 0, amount: 1, object: [object] },
            };
            amountNotify = [...amountNotify, notification];
          } else {
            amountNotify = [...taskNotification];
          }
        } else {
          const notification = {
            task_id: taskId,
            content: { message: 0, amount: 1, object: [object] },
          };
          amountNotify.push(notification);
        }
      }
    }

    loadVinculateUsers().then(() => {
      loadNotifications(AUTH)
        .then((response) => {
          if (response.length > 0) {
            response.map((info) => {
              sumNotification(Number(info.type), info.task_id, info);
            });
          }
        })
        .then(() => {
          dispatch(getNotifications(amountNotify !== {} ? amountNotify : []));
        })
        .catch((error) => console.log(error));
    });
  }, []);

  useEffect(() => {
    if (!pagination.search) {
      loadTask(visionMenu, AUTH, pagination.pageUser)
        .then((response) => {
          if (response.error === true && response.message !== 'No data') {
            console.log(response.error);
            console.log(response);
          } else {
            try {
              if (response.pages) {
                dispatch(setTotalUser(response.pages));
              }
              dispatch(getTask(response.data ? response.data : [{}]));
            } catch (error) {
              console.log(error);
            }
          }
        })
        .catch((error) => console.log(error));
    }
  }, [stateUpdate, pagination.pageUser]);

  useEffect(() => {
    async function loadAllTasks() {
      const AUTH = permissions.session;

      try {
        const { data } = await api.get(
          'GTPP/_Task.php?AUTH=' +
            AUTH +
            '&app_id=3&administrator=1&rows=15&page=' +
            pagination.pageAdmin,
        );

        if (data.error === true) {
          return null;
        }

        if (data.pages) {
          dispatch(setTotalAdmin(data.pages));
        }

        return data.data;
      } catch (error) {
        return null;
      }
    }
    if (seeAdminSet === true && pagination.search === false) {
      loadAllTasks()
        .then((response) => dispatch(getTask(response)))
        .catch((error) => console.log(error));
    }
  }, [stateAdmin, seeAdminSet, pagination.pageAdmin]);

  useEffect(() => {
    function taskFilter() {
      let filter = tasks.filter(
        (task) =>
          task.state_id == 1 ||
          task.state_id == 2 ||
          task.state_id == 3 ||
          task.state_id == 4 ||
          task.state_id == 5,
      );
      const verifyFilter = filter.length === 0 ? {} : [...filter];
      dispatch(getTaskFilter(verifyFilter));
    }

    if (tasks) {
      tasks.map(
        (task) => (
          (task.notifications = [
            { type: 1, amount: 0, message: '' },
            { type: 4, amount: 0, message: '' },
            { type: 6, amount: 0, message: '' },
            { type: 3, amount: 0, message: '' },
            { type: 2, amount: 0, message: '' },
            { type: 6, amount: 0, message: '' },
            { amount: 0 },
          ]),
          (task.warning = { expire: 0, due_date: 0, initial: 0 })
        ),
      );
      if (filterTask.filter.length === 1) {
        taskFilter();
      }
    }
  }, []);

  useEffect(() => {
    loadCompanies(AUTH)
      .then((response) => {
        if (response.error === true) {
          alert('error');
        } else {
          try {
            dispatch(getCompany(response.data != '' ? response.data : []));
          } catch (error) {}
        }
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    loadShop(AUTH)
      .then((response) => {
        if (response.error === true) {
          alert('error');
        } else {
          try {
            dispatch(getShop(response.data != '' ? response.data : []));
          } catch (error) {}
        }
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    loadTaskStates(AUTH)
      .then((response) => {
        if (response.error === true) {
          alert('error');
        } else {
          try {
            dispatch(getStates(response.data));
          } catch (error) {}
        }
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    loadDept(AUTH)
      .then((response) => {
        if (response.error === true) {
          alert('error');
        } else {
          try {
            dispatch(getDepts(response.data));
          } catch (error) {}
        }
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    const loadUserImages = async (idUser) => {
      if (idUser) {
        try {
          const { data } = await api.get(
            'http://192.168.0.99:71/GLOBAL/Controller/CCPP/EmployeePhoto.php?AUTH=' +
              AUTH +
              '&app_id=3&id=' +
              idUser,
          );

          if (data) {
            if (data.photo == null || data.photo == '') {
              data.user_id = idUser;
              data.photo = userEmpty;
              setTakePhotos((oldarray) => [...oldarray, data]);
            } else {
              data.photo = convertImage(data.photo);
              setTakePhotos((oldarray) => [...oldarray, data]);
            }
          }

          return data;
        } catch (error) {
          console.log(error);
        }
      }
    };

    vinculatedUsers.forEach((user) => {
      loadUserImages(user.id);
    });
  }, [vinculatedUsers]);

  setTimeout(() => {
    setLoading(false);
  }, 1000);

  useEffect(() => {
    dispatch(setPhotos(takePhotos));
  }, [takePhotos]);

  useEffect(() => {
    if (!('Notification' in window)) {
      console.log('Esse browser não suporta notificações desktop');
    } else {
      if (Notification.permission !== 'denied') {
        // Pede ao usuário para utilizar a Notificação Desktop
        Notification.requestPermission();
      }
    }
  }, []);

  function convertImage(src) {
    if (src != null) {
      var image = new Image();
      image.src = 'data:image/jpeg;base64, ' + src;
      return image.src;
    } else {
      return null;
    }
  }

  function handlePageClick(e) {
    if (pagination.search) {
      dispatch(setPageSearch(e.selected));
      return;
    }
    if (seeAdminSet === true) {
      dispatch(setPageAdmin(e.selected));
    } else {
      dispatch(setPageUser(e.selected + 1));
    }
  }

  React.useEffect(() => {
    if (filterTask.filter.length === 0) {
      showNotification(
        'Aviso',
        'Nenhuma tarefa encontrada para o filtro atual',
        'warning',
      );
    }
  }, [filterTask.filter]);

  return loading == true ? (
    <Loading />
  ) : (
    <>
      <ul className="taskList">
        {filterTask.filter
          ? filterTask.filter.map((task) => (
              <Task websocket={props} task={task} key={task.id} />
            ))
          : null}
      </ul>
      <div className="paginationArea">
        <ReactPaginate
          previousLabel={'Anterior'}
          nextLabel={'Próximo'}
          breakLabel={'...'}
          breakClassName={'break-me'}
          pageCount={
            pagination.search
              ? pagination.totalSearch
              : seeAdminSet === false
              ? pagination.totalUser
              : pagination.totalAdmin
          }
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageClick}
          containerClassName={'pagination'}
          subContainerClassName={'pages pagination'}
          activeClassName={'active'}
        />
      </div>
    </>
  );
};

export default TaskTable;
