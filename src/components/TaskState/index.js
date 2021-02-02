import React from "react";
import { useSelector } from "react-redux";
import "./style.css";

const TaskState = ({ task }) => {
  const { taskStates } = useSelector((state) => state);

  return (
    <ul className="menu">
      {taskStates.map((state) => (
        <React.Fragment key={state.id}>
          {state.id == task.state_id ? (
            <button
              className="buttonState"
              style={{ backgroundColor: "#" + state.color }}
            >
              <h2>{state.description}</h2>
            </button>
          ) : null}
        </React.Fragment>
      ))}
    </ul>
  );
};

export default TaskState;
