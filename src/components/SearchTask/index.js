import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getTaskFilter, updateStateAdmin, updateTask } from "../../redux";
import { AiOutlineClose } from "react-icons/ai";
import { BsSearch } from "react-icons/bs";
import "./style.css";

const SearchTask = () => {
  const dispatch = useDispatch();
  const { filterTask } = useSelector((state) => state);
  const { seeAdminSet } = useSelector((state) => state);
  const { vinculatedUsers } = useSelector((state) => state);
  const [typeSearch, setTypeSearch] = useState("descricao");

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
        </div>
      </div>
    </div>
  );
};

export default SearchTask;
