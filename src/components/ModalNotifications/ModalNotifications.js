import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "./style.css";

const ModalNotifications = ({ task }) => {
  const { notifications } = useSelector((state) => state);
  const { vinculatedUsers } = useSelector((state) => state);
  const { taskStates } = useSelector((state) => state);
  const [notify, setNotify] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const taskF = notifications.filter(
      (taskFilter) => taskFilter.task_id === task.id
    );
    const { content } = taskF[0];
    let userAuthor;

    if (content.object) {
      content.object.map((info) => {
        switch (Number(info.type)) {
          case 1:
            userAuthor = vinculatedUsers.filter(
              (user) => Number(user.id) === Number(info.send_user_id)
            );
            setNotify((oldarray) => [
              ...oldarray,
              {
                message: info.object.description,
                description: task.description,
                user_name: userAuthor[0].name + " disse",
              },
            ]);
            break;
          case 2:
            userAuthor = vinculatedUsers.filter(
              (user) => Number(user.id) === Number(info.send_user_id)
            );
            setNotify((oldarray) => [
              ...oldarray,
              {
                message: info.object.description,
                description: task.description,
                user_name: userAuthor[0].name,
              },
            ]);
            break;
          case 3:
            userAuthor = vinculatedUsers.filter(
              (user) => Number(user.id) === Number(info.send_user_id)
            );
            setNotify((oldarray) => [
              ...oldarray,
              {
                message: info.object.description,
                description: task.description,
                user_name: userAuthor[0].name,
              },
            ]);
            break;
          case 4:
            userAuthor = vinculatedUsers.filter(
              (user) => Number(user.id) === Number(info.send_user_id)
            );
            setNotify((oldarray) => [
              ...oldarray,
              {
                message: info.object.description,
                description: task.description,
                user_name: userAuthor[0].name,
              },
            ]);

            break;
          case 5:
            let user = vinculatedUsers.filter(
              (user) => Number(user.id) === Number(info.object.changeUser)
            );

            userAuthor = vinculatedUsers.filter(
              (user) => Number(user.id) === Number(info.send_user_id)
            );
            if (userAuthor[0]) {
              setNotify((oldarray) => [
                ...oldarray,
                {
                  message: user[0].name + " " + info.object.description,
                  description: task.description,
                  user_name: userAuthor[0].name,
                },
              ]);
            }

            break;
          case 6:
            userAuthor = vinculatedUsers.filter(
              (user) => Number(user.id) === Number(info.send_user_id)
            );
            const newState = taskStates.filter(
              (state) => Number(state.id) === Number(info.object.state_id)
            );
            setNotify((oldarray) => [
              ...oldarray,
              {
                message: "Mudou para " + newState[0].description,
                description: task.description,
                user_name: userAuthor[0].name,
              },
            ]);
            break;
        }
      });
    }
  }, []);

  return (
    <div className="modalNotifications">
      <div className="tableNotifications">
        <ul>
          {notify &&
            notify.map((info, index) => (
              <li key={index}>
                <span>{info.description}</span>{" "}
                {info.user_name + ": " + info.message}
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default ModalNotifications;
