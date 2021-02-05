import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import useClickOutside from "../ClickOutside";
import { AiFillTrophy } from "react-icons/ai";
import { MdCreateNewFolder, MdError } from "react-icons/md";
import { FaUsersCog } from "react-icons/fa";
import { FaMedal } from "react-icons/fa";
import { GoVerified, GoTasklist } from "react-icons/go";
import "./style.css";

const Ranking = ({ data, close }) => {
  const { userPhotos } = useSelector((state) => state);
  const [first, setFirst] = useState(null);
  const [second, setSecond] = useState(null);
  const [third, setThird] = useState(null);

  useEffect(() => {
    // first
    if (data) {
      let score = data.map((score) => +score.score);
      score = score.filter((value) => !isNaN(value));
      let amount = Math.max.apply(Math, score);
      setFirst(amount);

      //second
      score = score.filter((value) => value !== amount);
      amount = Math.max.apply(Math, score);
      setSecond(amount);

      //third
      score = score.filter((value) => value !== amount);
      amount = Math.max.apply(Math, score);
      setThird(amount);
    }
  }, []);

  let domNodeRanking = useClickOutside(() => {
    close(false);
  });

  return (
    <div className="containerRanking">
      <div ref={domNodeRanking} className="modalRanking">
        {data &&
          data.map((user) =>
            userPhotos.map(
              (photo) =>
                Number(photo.user_id) === Number(user.id) && (
                  <div className="userRanking" key={user.id}>
                    <div>
                      {+user.score === first ? (
                        <FaMedal
                          size={25}
                          className="champion"
                          color="#f9ce31"
                        />
                      ) : +user.score === second ? (
                        <FaMedal
                          size={25}
                          className="champion"
                          color="#f2ecca"
                        />
                      ) : +user.score === third ? (
                        <FaMedal
                          size={25}
                          className="champion"
                          color="#e99f5e"
                        />
                      ) : (
                        <FaMedal
                          size={25}
                          className="champion"
                          color="transparent"
                        />
                      )}

                      <img src={photo.photo} alt="" />
                      <p>{user.user}</p>
                    </div>

                    <h2 title="Pontos">
                      <AiFillTrophy size={20} style={{ marginRight: "10px" }} />
                      {user.score}
                    </h2>

                    <h2 title="Tarefas criadas">
                      <MdCreateNewFolder
                        size={20}
                        style={{ marginRight: "10px" }}
                      />
                      {user.user_task_count}
                    </h2>
                    <h2 title="Tarefas que está vinculado">
                      <FaUsersCog size={20} style={{ marginRight: "10px" }} />
                      {user.attached_task_count}
                    </h2>
                    <h2 title="Tarefas em aberto">
                      <GoTasklist size={20} style={{ marginRight: "10px" }} />
                      {user.current_task_count}
                    </h2>
                    <h2 title="Tarefas concluídas">
                      <GoVerified size={20} style={{ marginRight: "10px" }} />
                      {user.finished_task_count}
                    </h2>
                    <h2 title="Tarefas desqualificadas">
                      <MdError size={20} style={{ marginRight: "10px" }} />
                      {user.disqualify_task_count}
                    </h2>
                  </div>
                )
            )
          )}
      </div>
    </div>
  );
};

export default Ranking;
