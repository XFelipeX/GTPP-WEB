import React, { useState, useEffect } from "react";
import { AiOutlineUserAdd } from "react-icons/ai";
import { AiOutlineUser } from "react-icons/ai";
import { BiEdit } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { updateTask } from "../../redux";
import { updateDescription, formatDate } from "./functions";
import userImg from "../../assets/user@2x.png";
import api from "../../services/api";
import "./style.css";

const TaskInfo = () => {
  const dispatch = useDispatch();
  const { taskStates } = useSelector((state) => state);
  const { taskVisible } = useSelector((state) => state);
  const { stateUpdate } = useSelector((state) => state);
  const { userPhotos } = useSelector((state) => state);
  const { permissions } = useSelector((state) => state);
  const [fullDescription, setFullDescription] = useState(
    taskVisible.full_description
  );
  const [vinculatedUsers, setVinculatedUsers] = useState([]);
  const [showDesc, setShowDesc] = useState(false);
  const [showDept, setShowDept] = useState(false);

  //formatando datas
  const dateInitial = formatDate(taskVisible.initial_date);
  const dateFinal = formatDate(taskVisible.final_date);

  function updateFullDescription(taskId, description) {
    updateDescription(taskId, description);
    setShowDesc(false);
    dispatch(updateTask());
  }

  async function loadVinculateUsers() {
    const AUTH = sessionStorage.getItem("token");
    const { data } = await api.get("GTPP/Task_User.php", {
      params: {
        AUTH: AUTH,
        task_id: taskVisible.id,
        list_user: "",
        app_id: 3,
      },
    });
    // console.log(data);
    setVinculatedUsers(data.data);
  }

  useEffect(() => {
    loadVinculateUsers();
  }, [stateUpdate]);

  return (
    <div className="taskInfo">
      <div className="row">
        <h1>Início : {dateInitial}</h1>
        <h1>Fim : {dateFinal}</h1>

        {taskStates.map((state) => (
          <React.Fragment key={state.id}>
            {state.id === taskVisible.state_id ? (
              <button
                className="buttonState stateControl"
                style={{ backgroundColor: "#" + state.color }}
              >
                {/* {console.log(state.color)} */}
                <h2>{state.description}</h2>
              </button>
            ) : null}
          </React.Fragment>
        ))}
      </div>

      <div className="comshopsubArea">
        <div className="row">
          <div className="col taskDescription">
            <h1>Descrição</h1>
            <BiEdit
              size="22"
              onClick={() => setShowDesc(!showDesc)}
              className="btnEdit"
            />
            {showDesc ? (
              <ul className="menuDescription">
                <li>
                  <textarea
                    rows="5"
                    value={fullDescription}
                    onChange={(e) => setFullDescription(e.target.value)}
                  ></textarea>
                </li>
                <li>
                  <button
                    className="btnSaveDescription"
                    onClick={() =>
                      updateFullDescription(taskVisible.id, fullDescription)
                    }
                  >
                    Salvar
                  </button>
                </li>
              </ul>
            ) : null}
          </div>
        </div>
        <div className="row">
          <div className="col">
            <select>
              <option>Selecione a companhia</option>
              <option>Peg Pese</option>
              <option>Frugal</option>
              <option>Hetros</option>
            </select>
            <select>
              <option>Selecione a loja</option>
            </select>
          </div>
        </div>
        <div className="rowDept">
          <p onClick={() => setShowDept(!showDept)}>
            Selecione os departamentos
          </p>

          {showDept ? (
            <ul className="menuDept">
              <li>
                <label htmlFor="">1 TI</label>
                <input type="checkbox" />
              </li>
              <li>
                <label htmlFor="">1 TI</label>
                <input type="checkbox" />
              </li>
              <li>
                <label htmlFor="">1 TI</label>
                <input type="checkbox" />
              </li>
              <li>
                <label htmlFor="">1 TI</label>
                <input type="checkbox" />
              </li>
            </ul>
          ) : null}
        </div>
      </div>
      <div className="usersVinculated">
        <div className="user">
          

          {vinculatedUsers.map((user) => (
            <React.Fragment>
              {userPhotos.map((userPhoto) => (
                <>
                  {user.user_id == userPhoto.user_id && user.check === true ? (
                    userPhoto.photo !== "" ? (
                      <div className="userControl">
                        <img
                          src={userPhoto.photo}
                          alt={user.name}
                          title={user.name}
                        />
                      </div>
                    ) : (
                      <div className="userControl">
                        {
                          <AiOutlineUser
                            size="35"
                            style={{
                              backgroundColor: "#353535",
                              borderRadius: "50%",
                            }}
                            alt={user.name}
                            title={user.name}
                          />
                        }
                      </div>
                    )
                  ) : null}
                </>
              ))}
            </React.Fragment>
          ))}
        </div>
        {/* <div className="addUser">
                <div>
                  <AiOutlineUserAdd size="20" />
                </div>
              </div> */}
      </div>
    </div>
  );
};

export default TaskInfo;

{
  /* <ul className="vinculatedList" >
          {vinculatedUsers.map((user) => (
            <React.Fragment>
              {userPhotos.map((userPhoto) => (
                <>
                  {user.user_id == userPhoto.user_id &&
                  user.check === true
                 ? (
                    <li>
                      <img
                        src={userPhoto.photo}
                        width="35"
                        height="35"
                        alt=""
                      />
                      <p>{user.name}</p>
                      {user.user_id != permissions.id ? (<button onClick={() => {}}>
                        Remover
                      </button>) : null}
                      
                    </li>
                  ) : null}
                </>
              ))}
            </React.Fragment>
          ))}
        </ul> */
}
