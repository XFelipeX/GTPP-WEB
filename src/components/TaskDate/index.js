import React, { useState } from "react";
// import { useSelector } from "react-redux";
// import { updateTask } from '../../redux';
// import api from '../../services/api';
import "./style.css";

// import useClickOutside from '../Button/index'

const TaskDate = ({ task }) => {
  // console.log(task);

  // const { permissions } = useSelector(state => state);
  const [open, setOpen] = useState(false);
  const initial_date = formatDate(task.initial_date);
  const final_date = formatDate(task.final_date);
  // const dispatch = useDispatch();

  function formatDate(props) {
    const date = new Date(props);
    var day = date.getDate();
    day++;
    if (day < 10) {
      day = "0" + day;
    }
    var month = date.getMonth();
    month++;
    if (month < 10) {
      month = "0" + month;
    }
    var year = date.getFullYear();
    return day + "/" + month + "/" + year;
  }

  //   let domNode = useClickOutside(() =>{
  //     setShow(false)
  //   })

  return (
    <div className="containerDate">
      <div className="initialDate">
        <h2>{initial_date}</h2>
      </div>

      <div onClick={() => setOpen(!open)} className="dataShow">
        <h2>{final_date}</h2>
      </div>
      {/* {open ? (
         <div className="addDate">
        <div>
          <input placeholder="Adicionar dias" type="number" id = {'date' + task.id} />
          <button onClick={() => updateDate()}>Atualizar</button>
        </div>
      </div>) : null

      } */}
    </div>
  );
};

export default TaskDate;
