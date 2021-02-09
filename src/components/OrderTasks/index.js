import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BsFilterLeft } from "react-icons/bs";
import { getTaskFilter } from "../../redux";
import {showNotification} from '../../Utils/Notify';
import "./style.css";
import useClickOutside from "../ClickOutside";

let OrderTasks = () => {
  const dispatch = useDispatch();
  const { filterTask } = useSelector((state) => state);
  const { orderTask } = useSelector((state) => state);
  const [showAlert, setShowAlert] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [orderPriority, setOrderPriority] = useState(false);
  const [orderState, setOrderState] = useState(false);
  const [orderDescription, setOrderDescription] = useState(false);
  const [orderDueDate, setOrderDueDate] = useState(false);


  useEffect(() => {
    orderTasks();
  }, [orderPriority,orderState,orderDescription,orderDueDate]);

  useEffect(() => {
    setTimeout(() => {
      orderTasks();
    }, 1000);
  }, [orderTask]);

  function orderTasks() {

    let filterDo = [];
    let filterDoing = [];
    let filterAnalyze = [];
    let filterStopped = [];
    let filterBlocked = [];
    let filterDone = [];
    let filterCanceled = [];
    let finalFilter = [];

    if (orderPriority) {
      if (showAlert === true) {
        showNotification("Sucesso","Ordenado por prioridade","success");
        setShowAlert(false);
      }
      filterDo = filterTask.filter.filter((task) => task.priority == 0);
      filterDoing = filterTask.filter.filter((task) => task.priority == 1);
      filterAnalyze = filterTask.filter.filter((task) => task.priority == 2);

      finalFilter = [...filterAnalyze, ...filterDoing, ...filterDo];
    } else if (orderState) {
      if (showAlert === true) {
        showNotification("Sucesso","Ordenado por estado","success");
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
    } else if (orderDescription) {
      if (showAlert === true) {
        showNotification("Sucesso","Ordenado por descrição","success");
        setShowAlert(false);
      }

      // console.log(filterTask);
      finalFilter = [...filterTask.filter];
      finalFilter.sort(function (a, b) {
        return a.description.localeCompare(b.description);
      });
    } else if (orderDueDate) {
      if (showAlert === true) {
        showNotification("Sucesso","Ordenado por vencimento","success");
        setShowAlert(false);
      }

      finalFilter = [...filterTask.filter];
      finalFilter.sort(function (a, b) {
        return a.final_date.localeCompare(b.final_date);
      });

    }

    if(finalFilter.length===0){
      return;
    }

    dispatch(getTaskFilter(finalFilter));
  }

  let domNode = useClickOutside(() => {
    setShowMenu(false);
  });

  return (
    <div className="load-tasks-area">
      {showMenu ? (
        <ul className="menuExpanded" ref={domNode}>
          <label htmlFor="">
            <input
              type="checkbox"
              id="priority"
              onChange={() => {
                setOrderPriority(!orderPriority);
                setOrderState(false);
                setOrderDescription(false);
                setOrderDueDate(false);
              }}
              checked={orderPriority}
            />
            Prioridade
          </label>
          <label htmlFor="">
            <input
              type="checkbox"
              id="state"
              onChange={() => {
                setOrderState(!orderState);
                setOrderPriority(false);
                setOrderDescription(false);
                setOrderDueDate(false);
              }}
              checked={orderState}
            />
            Estado
          </label>
          <label htmlFor="">
            <input
              type="checkbox"
              id="date"
              onChange={() => {
                setOrderDescription(!orderDescription);
                setOrderState(false);
                setOrderPriority(false);
                setOrderDueDate(false);
              }}
              checked={orderDescription}
            />
            Descrição
          </label>
          <label htmlFor="">
            <input
              type="checkbox"
              id="userVinculated"
              onChange={() => {
                setOrderDueDate(!orderDueDate);
                setOrderState(false);
                setOrderDescription(false);
                setOrderPriority(false);
              }}
              checked={orderDueDate}
            />
            Vencimento
          </label>
        </ul>
      ) : null}
      <button
        className="button-refresh"
        onClick={() => {
          const element = document.getElementById("orderTaskIcon");
          element.classList.add("orderTaskIcon");
          setTimeout(() => element.classList.remove("orderTaskIcon"), 1000);
          setShowMenu(true);
          // setCount(count + 1);
          setShowAlert(true);
        }}
        title="Ordenar lista"
      >
        <BsFilterLeft
          size={75}
          style={{ color: "#959595" }}
          id="orderTaskIcon"
        />
      </button>
    </div>
  );
};

export default OrderTasks;
