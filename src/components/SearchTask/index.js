import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getTaskFilter, updateStateAdmin, updateTask } from "../../redux";
import { AiOutlineClose } from "react-icons/ai";
import { BsSearch, BsFillBellFill } from "react-icons/bs";
import useClickOutside from "../ClickOutside";
import "./style.css";

const SearchTask = () => {
  const dispatch = useDispatch();
  const { filterTask } = useSelector((state) => state);
  const { tasks } = useSelector((state) => state);
  const { seeAdminSet } = useSelector((state) => state);
  const { vinculatedUsers } = useSelector((state) => state);
  const { taskStates } = useSelector((state) => state);
  const [typeSearch, setTypeSearch] = useState("descricao");
  const { notifications } = useSelector((state) => state);
  const [allNotifications, setAllNotifications] = useState([]);
  const [totalNotificantions, setTotaNotifications] = useState(0);
  const [showAllNotifications, setShowAllNotifications] = useState(false);

  let domNode = useClickOutside(() => {
    setShowAllNotifications(false);
  });

  React.useEffect(() => {
    setAllNotifications([]);
    let total = 0;

    if (notifications.length > 0) {
      notifications.map((notification) => {
        const filterTask = tasks.filter(
          (task) => task.id === notification.task_id
        );

        notification.content.object.map((obj) => {
          const filterUser = vinculatedUsers.filter(
            (user) => user.id === obj.send_user_id
          );

          if (obj.task_id === notification.task_id) {
            obj.task_description = filterTask[0].description;
            obj.send_user_name = filterUser[0].name;

            if (+obj.type === 6) {
              const filterState = taskStates.filter(
                (state) => state.id === obj.object.state_id
              );

              if (filterState.length > 0) {
                obj.object.description =
                  "Mudou para " + filterState[0].description;
              }
            }

            if (+obj.type === 1) {
              obj.send_user_name = obj.send_user_name + " disse";
            }
          }
        });
        setAllNotifications((oldArray) => [
          ...oldArray,
          ...notification.content.object,
        ]);
        total += notification.content.object.length;
      });
      setTotaNotifications(total);
    }
  }, [notifications]);

  function search(e) {
    const text = e.toLowerCase();

    const filter = filterTask.filter.filter((task) =>
      task.description.toLowerCase().includes(text)
    );
    if (filter.length !== 0) {
      dispatch(getTaskFilter(filter));
    }

    if (text === "") {
      if (seeAdminSet === true) {
        dispatch(updateStateAdmin());
      } else {
        dispatch(updateTask());
      }
    }
  }

  function searchEmployee(e) {
    const text = e.toLowerCase();
    let filter = [];
    const filterUser = vinculatedUsers.filter((user) =>
      user.name.toLowerCase().includes(text)
    );

    filterTask.filter.map((task) => {
      filterUser.map((user) => {
        if (+task.user_id === +user.id) {
          filter.push(task);
        }
      });
    });

    if (filter.length !== 0) {
      dispatch(getTaskFilter(filter));
    }

    if (text === "") {
      if (seeAdminSet === true) {
        dispatch(updateStateAdmin());
      } else {
        dispatch(updateTask());
      }
    }
  }

  function clearSearch() {
    document.getElementById("search").value = "";
    if (seeAdminSet === true) {
      dispatch(updateStateAdmin());
    } else {
      dispatch(updateTask());
    }
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

          <input placeholder="Tarefa..." id="search" type="text" />
          <span className="clearSearch" onClick={() => clearSearch()}>
            <AiOutlineClose color="#ccc" />
          </span>
          <button
            title="Pesquisar"
            className="btnSearchTask"
            type="button"
            onClick={() =>
              typeSearch === "descricao"
                ? search(document.getElementById("search").value)
                : searchEmployee(document.getElementById("search").value)
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
              color={totalNotificantions > 0 ? "#ff4800" : "#fff"}
            />
            {totalNotificantions > 0 && totalNotificantions}
          </div>
          {showAllNotifications && (
            <div className="modalAllNotifications" ref={domNode}>
              <ul>
                {console.log(allNotifications)}
                {allNotifications.map((notification, index) => (
                  <li key={index}>
                    <span>{notification.task_description}</span>
                    {notification.send_user_name}:{" "}
                    {notification.object.description}
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
