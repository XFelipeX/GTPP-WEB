import React, { useState } from "react";
import "./style.css";
const TaskDate = ({ task }) => {
  const [open, setOpen] = useState(false);
  const initial_date = formatDate(task.initial_date);
  const final_date = formatDate(task.final_date);

  function formatDate(props) {
    let data = props.split("-");
    var day = data[2];
    var month = data[1];
    var year = data[0];
    return day + "/" + month + "/" + year;
  }

  return (
    <div className="containerDate">
      <div className="initialDate">
        <h2>{initial_date}</h2>
      </div>

      <div onClick={() => setOpen(!open)} className="dataShow">
        <h2>{final_date}</h2>
      </div>
    </div>
  );
};

export default TaskDate;
