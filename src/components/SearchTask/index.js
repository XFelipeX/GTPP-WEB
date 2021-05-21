import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  getTask,
  setStatusSearch,
  setTotalSearch,
  updateStateAdmin,
  updateTask,
} from '../../redux';
import { AiOutlineClose } from 'react-icons/ai';
import { BsSearch, BsFillBellFill } from 'react-icons/bs';
import useClickOutside from '../ClickOutside';
import './style.css';
import { searchByDescription, searchByEmployee } from './functions';

const SearchTask = () => {
  const dispatch = useDispatch();
  const { permissions } = useSelector((state) => state);
  const { tasks } = useSelector((state) => state);
  const { pagination } = useSelector((state) => state);
  const { seeAdminSet } = useSelector((state) => state);
  const { vinculatedUsers } = useSelector((state) => state);
  const { taskStates } = useSelector((state) => state);
  const [typeSearch, setTypeSearch] = useState('descricao');
  const { notifications } = useSelector((state) => state);
  const [allNotifications, setAllNotifications] = useState([]);
  const [totalNotificantions, setTotaNotifications] = useState(0);
  const [showAllNotifications, setShowAllNotifications] = useState(false);
  const [searchDescription, setSearchDescription] = useState('');
  const [searchEmployeeDesc, setSearchEmployeeDesc] = useState('');

  let domNode = useClickOutside(() => {
    setShowAllNotifications(false);
  });

  React.useEffect(() => {
    setAllNotifications([]);
    let total = 0;

    notifications.map((taskNotification) => {
      const { content } = taskNotification;
      if (content.object) {
        const taskF = tasks.filter(
          (taskFilter) => +taskFilter.id === +taskNotification.task_id,
        );

        let userAuthor;

        content.object.map((info) => {
          total++;
          switch (Number(info.type)) {
            case 1:
              userAuthor = vinculatedUsers.filter(
                (user) => Number(user.id) === Number(info.send_user_id),
              );
              setAllNotifications((oldarray) => [
                ...oldarray,
                {
                  message: info.object.description,
                  description: taskF[0] ? taskF[0].description : '',
                  user_name: userAuthor[0].name + ' disse',
                },
              ]);
              break;
            case 2:
              userAuthor = vinculatedUsers.filter(
                (user) => Number(user.id) === Number(info.send_user_id),
              );
              setAllNotifications((oldarray) => [
                ...oldarray,
                {
                  message: info.object.description,
                  description: taskF[0] ? taskF[0].description : '',
                  user_name: userAuthor[0].name,
                },
              ]);
              break;
            case 3:
              userAuthor = vinculatedUsers.filter(
                (user) => Number(user.id) === Number(info.send_user_id),
              );
              setAllNotifications((oldarray) => [
                ...oldarray,
                {
                  message: info.object.description,
                  description: taskF[0] ? taskF[0].description : '',
                  user_name: userAuthor[0].name,
                },
              ]);
              break;
            case 4:
              userAuthor = vinculatedUsers.filter(
                (user) => Number(user.id) === Number(info.send_user_id),
              );
              setAllNotifications((oldarray) => [
                ...oldarray,
                {
                  message: info.object.description,
                  description: taskF[0] ? taskF[0].description : '',
                  user_name: userAuthor[0].name,
                },
              ]);

              break;
            case 5:
              let user = vinculatedUsers.filter(
                (user) => Number(user.id) === Number(info.object.changeUser),
              );

              userAuthor = vinculatedUsers.filter(
                (user) => Number(user.id) === Number(info.send_user_id),
              );
              if (userAuthor[0]) {
                setAllNotifications((oldarray) => [
                  ...oldarray,
                  {
                    message: user[0].name + ' ' + info.object.description,
                    description: taskF[0] ? taskF[0].description : '',
                    user_name: userAuthor[0].name,
                  },
                ]);
              }

              break;
            case 6:
              userAuthor = vinculatedUsers.filter(
                (user) => Number(user.id) === Number(info.send_user_id),
              );
              const newState = taskStates.filter(
                (state) => Number(state.id) === Number(info.object.state_id),
              );
              setAllNotifications((oldarray) => [
                ...oldarray,
                {
                  message: 'Mudou para ' + newState[0].description,
                  description: taskF[0] ? taskF[0].description : '',
                  user_name: userAuthor[0].name,
                },
              ]);
              break;
          }
        });
      }
    });

    setTotaNotifications(total);
  }, [notifications]);

  React.useEffect(() => {
    if (
      pagination.search === true &&
      searchDescription !== '' &&
      searchEmployeeDesc === ''
    ) {
      if (seeAdminSet === true) {
        searchByDescription(
          permissions.session,
          pagination.pageSearch,
          searchDescription,
          true,
        ).then((response) => {
          if (response.data) {
            dispatch(getTask([...response.data]));
          }
        });
      } else {
        searchByDescription(
          permissions.session,
          pagination.pageSearch,
          searchDescription,
          false,
        ).then((response) => {
          if (response.data) {
            setTimeout(() => {
              dispatch(getTask([...response.data]));
            }, 1000);
          }
        });
      }
    }
  }, [pagination.pageSearch]);

  React.useEffect(() => {
    if (
      pagination.search === true &&
      searchEmployeeDesc !== '' &&
      searchDescription === ''
    ) {
      if (seeAdminSet === true) {
        searchByEmployee(
          permissions.session,
          pagination.pageSearch,
          searchEmployeeDesc,
          true,
        ).then((response) => {
          if (response.data) {
            dispatch(getTask([...response.data]));
          }
        });
      } else {
        searchByEmployee(
          permissions.session,
          pagination.pageSearch,
          searchEmployeeDesc,
          false,
        ).then((response) => {
          if (response.data) {
            setTimeout(() => {
              dispatch(getTask([...response.data]));
            }, 1000);
          }
        });
      }
    }
  }, [pagination.pageSearch]);

  function search(e) {
    const text = e.toLowerCase();
    setSearchDescription(text);
    setSearchEmployeeDesc('');
    dispatch(setStatusSearch(true));

    if (seeAdminSet === true) {
      searchByDescription(permissions.session, 1, text, true).then(
        (response) => {
          if (response.data) {
            dispatch(getTask(response.data));
            dispatch(setTotalSearch(response.pages));
          }
        },
      );
    } else {
      searchByDescription(permissions.session, 0, text, false).then(
        (response) => {
          if (response.data) {
            dispatch(getTask(response.data));
            dispatch(setTotalSearch(response.pages));
          }
        },
      );
    }

    if (text === '') {
      if (seeAdminSet === true) {
        dispatch(updateStateAdmin());
      } else {
        dispatch(updateTask());
      }
    }
  }

  function searchEmployee(e) {
    const text = e.toLowerCase();
    setSearchEmployeeDesc(text);
    setSearchDescription('');
    dispatch(setStatusSearch(true));

    if (seeAdminSet === true) {
      searchByEmployee(permissions.session, 0, text, true).then((response) => {
        if (response.data) {
          dispatch(getTask(response.data));
          dispatch(setTotalSearch(response.pages));
        }
      });
    } else {
      searchByEmployee(permissions.session, 0, text, false).then((response) => {
        if (response.data) {
          dispatch(getTask(response.data));
          dispatch(setTotalSearch(response.pages));
        }
      });
    }

    if (text === '') {
      if (seeAdminSet === true) {
        dispatch(updateStateAdmin());
      } else {
        dispatch(updateTask());
      }
    }
  }

  function clearSearch() {
    document.getElementById('search').value = '';
    dispatch(setStatusSearch(false));
    if (seeAdminSet === true) {
      dispatch(updateStateAdmin());
    } else {
      dispatch(updateTask());
    }
    setSearchDescription('');
    setSearchEmployeeDesc('');
  }

  return (
    <div className="searchContainer">
      <div className="searchArea">
        <div>
          <select
            className="typeSearch"
            defaultValue={typeSearch}
            name="typeSearch"
            id="typeSearch"
            onChange={({ target }) => setTypeSearch(target.value)}
          >
            <option value="descricao">Descrição</option>
            <option value="funcionario">Funcionário</option>
          </select>

          <input
            placeholder="Tarefa..."
            id="search"
            type="text"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                typeSearch === 'descricao'
                  ? search(document.getElementById('search').value)
                  : searchEmployee(document.getElementById('search').value);
              }
            }}
          />
          <span className="clearSearch" onClick={() => clearSearch()}>
            <AiOutlineClose color="#ccc" />
          </span>
          <button
            title="Pesquisar"
            className="btnSearchTask"
            type="button"
            onClick={() =>
              typeSearch === 'descricao'
                ? search(document.getElementById('search').value)
                : searchEmployee(document.getElementById('search').value)
            }
          >
            <BsSearch size={25} />
          </button>
          <div
            className="iconNotification"
            onClick={() =>
              totalNotificantions > 0
                ? setShowAllNotifications(!showAllNotifications)
                : null
            }
          >
            <BsFillBellFill
              size={25}
              color={totalNotificantions > 0 ? '#ff4800' : '#fff'}
            />
            {totalNotificantions > 0 && totalNotificantions}
          </div>
          {showAllNotifications && (
            <div className="modalAllNotifications" ref={domNode}>
              <ul>
                {allNotifications.map((notification, index) => (
                  <li key={index}>
                    <span>{notification.description}</span>
                    {notification.user_name}: {notification.message}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchTask;
