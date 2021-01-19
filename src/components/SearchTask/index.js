import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { getTaskFilter, updateStateAdmin, updateTask } from "../../redux";
import { AiOutlineClose } from "react-icons/ai";
import "./style.css";

const SearchTask = () => {
  const dispatch = useDispatch();
  const { filterTask } = useSelector((state) => state);
  const { seeAdminSet } = useSelector((state) => state);

  function search(e) {
    const text = e.toLowerCase();

    const filter = filterTask.filter.filter((task) =>
      task.description.toLowerCase().includes(text)
    );
    dispatch(getTaskFilter(filter));

    if (text === "") {
      if (seeAdminSet === true) {
        dispatch(updateStateAdmin());
      } else {
        dispatch(updateTask());
      }
    }
  }

  function clearSearch(){
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
        {/* <label>Pesquisar</label> */}
        
        
        <div>
        
        <input placeholder="Pesquisar..."  id="search" type="text" onChange={(e) => search(e.target.value)} />
        </div>

        <span className="clearSearch" onClick={() => clearSearch()}>
        <AiOutlineClose color="#ccc"/>
        </span>
    
      </div>
    </div>
  );
};

export default SearchTask;
