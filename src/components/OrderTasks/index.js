import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BsFilterLeft } from "react-icons/bs";
import { getTaskFilter } from "../../redux";
import { store } from "react-notifications-component";
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
    setTimeout(() => {
      orderTasks();
    }, 1000);
  }, [orderTask]);

  function orderTasks() {
    if (count == 0) {
      return;
    }

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
        store.addNotification({
          title: "Sucesso",
          message: "Ordenado por prioridade",
          type: "success",
          container: "top-center",
          insert: "top",
          animationIn: ["animate__animated animate__fadeIn"],
          animationOut: ["animate__animated animate__fadeOut"],
          dismiss: {
            duration: 2000,
          },
          width: 400,
        });
        setShowAlert(false);
      }
      filterDo = filterTask.filter.filter((task) => task.priority == 0);
      filterDoing = filterTask.filter.filter((task) => task.priority == 1);
      filterAnalyze = filterTask.filter.filter((task) => task.priority == 2);

      finalFilter = [...filterDo, ...filterDoing, ...filterAnalyze];
    } else if (count === 2) {
      if (showAlert === true) {
        store.addNotification({
          title: "Sucesso",
          message: "Ordenado por estado",
          type: "success",
          container: "top-center",
          insert: "top",
          animationIn: ["animate__animated animate__fadeIn"],
          animationOut: ["animate__animated animate__fadeOut"],
          dismiss: {
            duration: 2000,
          },
          width: 400,
        });
        setShowAlert(false);
      }

      filterDo = filterTask.filter.filter((task) => task.state_id == 1);
      filterDoing = filterTask.filter.filter((task) => task.state_id == 2);
      filterAnalyze = filterTask.filter.filter((task) => task.state_id == 3);
      filterStopped = filterTask.filter.filter((task) => task.state_id == 4);
      filterBlocked = filterTask.filter.filter((task) => task.state_id == 5);
      filterDone = filterTask.filter.filter((task) => task.state_id == 6);
      filterCanceled = filterTask.filter.filter((task) => task.state_id == 7);

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
        store.addNotification({
          title: "Sucesso",
          message: "Ordenado por descrição",
          type: "success",
          container: "top-center",
          insert: "top",
          animationIn: ["animate__animated animate__fadeIn"],
          animationOut: ["animate__animated animate__fadeOut"],
          dismiss: {
            duration: 2000,
          },
          width: 400,
        });
        setShowAlert(false);
      }

      // console.log(filterTask);
      finalFilter = [...filterTask.filter];
      finalFilter.sort(function (a, b) {
        return a.description.localeCompare(b.description);
      });
    } else if (count === 4) {
      if (showAlert === true) {
        store.addNotification({
          title: "Sucesso",
          message: "Ordenado por vencimento",
          type: "success",
          container: "top-center",
          insert: "top",
          animationIn: ["animate__animated animate__fadeIn"],
          animationOut: ["animate__animated animate__fadeOut"],
          dismiss: {
            duration: 2000,
          },
          width: 400,
        });
        setShowAlert(false);
      }

      finalFilter = [...filterTask.filter];
      finalFilter.sort(function (a, b) {
        return a.final_date.localeCompare(b.final_date);
      });

      if (count == 4) {
        setCount(0);
      }
    }

    dispatch(getTaskFilter(finalFilter));
  }

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
