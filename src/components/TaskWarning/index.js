import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AiOutlineExclamation } from "react-icons/ai";
import { BsDot } from "react-icons/bs";
import "./style.css";
import { getWarning } from "../../redux";

const TaskWarning = ({ task }) => {
  const finalDate = new Date(String(task.final_date));
  const initialDate = new Date(String(task.initial_date));
  const { webSocket } = useSelector((state) => state);
  const [warningState, setWarningState] = useState(0);
  const { taskVisible } = useSelector((state) => state);
  const dispatch = useDispatch();

  useEffect(() => {
    function formatWarning() {
      //current date
      let today = new Date();

      //verify due date of the task
      let final_date = new Date(finalDate);
      final_date.setDate(final_date.getDate() - 7);

      let warning = new Date();

      if (task.state_id == 6 || task.state_id == 7) {
        warning = { task_id: task.id, expire: 0, due_date: -2, initial: 0 };
        dispatch(getWarning(warning));
        setWarningState(2);
      } else {
        //date of task
        if (today.getTime() > finalDate.getTime()) {
          warning = Math.round((today - finalDate) / (1000 * 60 * 60 * 24)) - 1;

          warning = {
            task_id: task.id,
            expire: 0,
            due_date: warning,
            initial: 0,
          };
          dispatch(getWarning(warning));

          setWarningState(1);
        } else if (today.getTime() > final_date.getTime()) {
          warning.setDate(finalDate.getDate() + 1 - warning.getDate());
          warning = {
            task_id: task.id,
            expire: warning.getDate() > 0 ? warning.getDate() : 1,
            due_date: -2,
            initial: 0,
          };
          dispatch(getWarning(warning));

          setWarningState(0);
        } else if (today.getTime() < initialDate.getTime()) {
          warning =
            Math.round((today - initialDate) / (1000 * 60 * 60 * 24)) - 1;
          warning = {
            task_id: task.id,
            expire: 0,
            due_date: -2,
            initial: Math.abs(warning),
          };
          dispatch(getWarning(warning));
          setWarningState(-1);
        } else {
          warning = { task_id: task.id, expire: 0, due_date: -2, initial: 0 };
          dispatch(getWarning(warning));

          setWarningState(2);
        }
      }
    }

    formatWarning(initialDate, finalDate);
  }, [taskVisible, task.final_date]);

  return (
    <div className="taskWarning">
      {warningState === -1 ? (
        <BsDot
          size={25}
          color="green"
          style={
            task.focus === true
              ? { backgroundColor: "black", borderRadius: 50 + "%" }
              : {}
          }
        />
      ) : warningState !== 2 ? (
        <AiOutlineExclamation
          size={25}
          color={warningState === 0 ? "yellow" : "red"}
          style={
            task.focus === true
              ? { backgroundColor: "black", borderRadius: 50 + "%" }
              : {}
          }
        />
      ) : null}
    </div>
  );
};

export default TaskWarning;
