import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { useDispatch } from "react-redux";
// import { updateTask } from "../../redux";
import { BsFilterLeft } from "react-icons/bs";
import { getTaskFilter, updateTask } from "../../redux";
import "./style.css";

let OrderTasks = () => {
  const dispatch = useDispatch();
  const [count, setCount] = useState(0);
  const { filterTask } = useSelector((state) => state);
  const { orderTask } = useSelector((state) => state);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    orderTasks();
  }, [count]);

  useEffect(() => {
    // console.log(count)

    setTimeout(() => {
      orderTasks();
    }, 1000);
  }, [orderTask]);

  function orderTasks() {
    // console.log(showAlert);
    if (count == 0) {
      return;
    }

    // console.log(count);
    let filterDo = [];
    let filterDoing = [];
    let filterAnalyze = [];
    let filterStopped = [];
    let filterBlocked = [];
    let filterDone = [];
    let filterCanceled = [];
    let finalFilter = [];

    if (count === 1) {
      if (showAlert === true) {
        alert("Ordenado por prioridade");
        setShowAlert(false);
      }
      filterDo = filterTask.filter((task) => task.priority == 0);
      filterDoing = filterTask.filter((task) => task.priority == 1);
      filterAnalyze = filterTask.filter((task) => task.priority == 2);

      finalFilter = [...filterDo, ...filterDoing, ...filterAnalyze];
    } else if (count === 2) {
      if (showAlert === true) {
        alert("Ordenado por estado");
        setShowAlert(false);
      }

      filterDo = filterTask.filter((task) => task.state_id == 1);
      filterDoing = filterTask.filter((task) => task.state_id == 2);
      filterAnalyze = filterTask.filter((task) => task.state_id == 3);
      filterStopped = filterTask.filter((task) => task.state_id == 4);
      filterBlocked = filterTask.filter((task) => task.state_id == 5);
      filterDone = filterTask.filter((task) => task.state_id == 6);
      filterCanceled = filterTask.filter((task) => task.state_id == 7);

      finalFilter = [
        ...filterDo,
        ...filterDoing,
        ...filterAnalyze,
        ...filterStopped,
        ...filterBlocked,
        ...filterDone,
        ...filterCanceled,
      ];
    } else if (count === 3) {
      if (showAlert === true) {
        alert("Ordenado por descrição");
        setShowAlert(false);
      }

      // console.log(filterTask);
      finalFilter = [...filterTask];
      finalFilter.sort(function (a, b) {
        return a.description.localeCompare(b.description);
      });
    } else if (count === 4) {
      if (showAlert === true) {
        alert("Ordenado por vencimento");
        setShowAlert(false);
      }

      finalFilter = [...filterTask];
      finalFilter.sort(function (a, b) {
        return a.final_date.localeCompare(b.final_date);
      });

      if (count == 4) {
        setCount(0);
      }
    }

    dispatch(getTaskFilter(finalFilter));
    // dispatch(updateTask());
  }

  // console.log(filterTask)

  return (
    <div className="load-tasks-area">
      <button
        className="button-refresh"
        onClick={() => {
          setCount(count + 1);
          setShowAlert(true);
        }}
      >
        <BsFilterLeft size={75} style={{ color: "#959595" }} />
      </button>
    </div>
  );
};

export default OrderTasks;
