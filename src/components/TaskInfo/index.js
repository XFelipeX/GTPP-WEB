import React, { useState, useEffect } from "react";
import { AiOutlineUserAdd } from "react-icons/ai";
import { AiOutlineUser } from "react-icons/ai";
import { BiEdit } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import {
  updateTask,
  updateModal,
} from "../../redux";
import {
  updateDescription,
  formatDate,
  updateCheckDept,
  loadShopsCompany,
  loadDeptsCompany,
  updateStateTask
} from "./functions";
import userImg from "../../assets/user@2x.png";
import api from "../../services/api";
import "./style.css";
import useClickOutside from "../ClickOutside";

const TaskInfo = () => {
  const dispatch = useDispatch();
  const { taskStates } = useSelector((state) => state);
  const { taskVisible } = useSelector((state) => state);
  const { userPhotos } = useSelector((state) => state);
  const { taskCompanies } = useSelector((state) => state);
  const { modalUpdate } = useSelector((state) => state);
  // const {vinculatedUsers} = useSelector(state => state);

  const [shops, setShops] = useState(false);
  const [depts, setDepts] = useState(false);
  const [company, setCompany] = useState(false);
  const [shop, setShop] = useState({});

  const [taskcsds, setTaskCsds] = useState([]);
  const [showReasonModal,setShowReasonModal] = useState(false);
  const [showDayModal,setShowDayModal] = useState(false);
  
  const [days,setDays] = useState(1);

  const [fullDescription, setFullDescription] = useState(
    taskVisible.full_description
  );
  const [reason,setReason] = useState("");
  const [vinculatedUsers, setVinculatedUsers] = useState([]);
  const [showDesc, setShowDesc] = useState(false);
  const [showDept, setShowDept] = useState(false);
  const { stateUpdate } = useSelector((state) => state);

  // console.log(vinculatedUsers)

  useEffect(() => {
    async function loadTaskVisible() {
      let AUTH = sessionStorage.getItem("token");
      let { data } = await api.get(
        "GTPP/Task.php?AUTH=" +
          AUTH +
          "&app_id=3&mobile=1&task_id=" +
          taskVisible.id
      );
      setTaskCsds(data.data.csds);

      if (data.data.csds !== null) {
        loadShopsCompany(data.data.csds[0].company_id).then((response) => {
          setShops(response.data);
        });
        loadDeptsCompany(
          data.data.csds[0].company_id,
          data.data.csds[0].shop_id,
          taskVisible.id
        ).then((response) => {
          setDepts(response);
        });
        setCompany(data.data.csds[0].company_id);
        setShop(data.data.csds[0].shop_id);
      } else {
        setDepts(false);
        setShops([]);
        setCompany(false);
        setShowDept(false);
      }
    }

    loadTaskVisible();
  }, [modalUpdate]);

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
  }, []);

  useEffect(() => {
    // console.log(company)
    function loadShops() {
      if (company != "-1") {
        // dispatch(getDepts([]));
        setDepts(false);
        setShowDept(false);
        setCompany(company);
        loadShopsCompany(company).then((response) => {
          setShops(response.data);
        });
      }
    }

    loadShops();
  }, [company]);

  // useEffect(() => {
  //   loadShopsCompany(company).then((response) => {
  //     setShops(response.data);
  //   });
  // }, []);

  useEffect(() => {
    loadDeptsCompany(company, shop, taskVisible.id).then((response) => {
      setDepts(response);
    });
  }, [shop,modalUpdate]);

  function changeCheckDept(taskId, deptId, shopId, companyId) {
    if (shopId == "-1" || companyId == "-1") {
      alert("Selecione companhia e loja!");
    } else {
      try {
        if (taskcsds != null && companyId != taskcsds[0].company_id) {
          for (let i = 0; i < taskcsds.length; i++) {
            changeCheckDept(
              taskVisible.id,
              taskcsds[i].depart_id,
              taskcsds[i].shop_id,
              taskcsds[i].company_id
            );
          }
        }

        updateCheckDept(taskId, deptId, shopId, companyId).then((response) => {
          // console.log(response)
          dispatch(updateModal());
          // setShop(shop);
        });
      } catch (error) {
        console.log("Erro ao selecionar departamento!");
      }
    }
  }

  let domNodeDept = useClickOutside(() => {
    setShowDept(false);
  });

  function updateState(stateId,reason,days){
    if(stateId==1 || stateId==2){
      if(reason==null){
        setShowReasonModal(true);
      } else if( reason === ""){
        alert("o motivo é obrigatório!")
      }else{
        updateStateTask(taskVisible.id,reason).then(response => taskVisible.state_id = response.state_id);
        dispatch(updateTask());
        dispatch(updateModal());
        setShowReasonModal(false);
        setReason("");
      }
    }else if(stateId==5){
      if(days==null){
        setShowDayModal(true);
      }else{
        updateStateTask(taskVisible.id,reason,days).then(response =>  (
          taskVisible.state_id = response.state_id,
          taskVisible.final_date = response.final_date
        ) );
      dispatch(updateTask());
      dispatch(updateModal());
      setShowDayModal(false);
      setDays("");
      }

    }
    else{
      updateStateTask(taskVisible.id).then(response => taskVisible.state_id = response.state_id);
      dispatch(updateTask());
      dispatch(updateModal());
    }
  }

  return (
    <div className="taskInfo">
      {showReasonModal ? (
        <div  className="modalState">
              <div >
             
              <ul  className="menuState">
              <li>
                  <h3>Alterar tarefa para o estado <strong>parado</strong>?</h3>
                  <h2>*Informe o motivo:</h2>
                  <textarea
                    spellcheck="false"
                    rows="5"
                    onChange={(e) => setReason(e.target.value)}
                  ></textarea>
                </li>
                <li>
                  <button
                    className="btnConfirm"
                    onClick={(e) =>
                      updateState(taskVisible.state_id,reason)
                    }
                  >
                    Confirmar
                  </button>
                  <button
                    className="btnCancel"
                    onClick={() =>
                      setShowReasonModal(false)
                    }
                  >
                    Cancelar
                  </button>
                </li>
              </ul>
              </div>
              </div>
      ) : null}

      {showDayModal ? (
        <div  className="modalDays">
              <div >
             
              <ul  className="menuDays">
              <li>
                  <h3>Informe a quantidade de dias que deseja prolongar esta tarefa:</h3>
                  <input type="number"
                    min="1"
                    value={days}
                    spellcheck="false"
                    rows="5"
                    onChange={(e) => setDays(e.target.value)}
                  ></input>
                </li>
                <li>
                  <button
                    className="btnConfirm"
                    onClick={(e) =>
                      updateState(taskVisible.state_id,reason,days)
                    }
                  >
                    Confirmar
                  </button>
                  <button
                    className="btnCancel"
                    onClick={() =>
                      setShowDayModal(false)
                    }
                  >
                    Cancelar
                  </button>
                </li>
              </ul>
              </div>
              </div>
      ) : null}

      <div className="row">
        <h1>Início : {dateInitial}</h1>
        <h1>Fim : {dateFinal}</h1>

        {taskStates.map((state) => (
          <React.Fragment key={state.id}>
            {state.id == taskVisible.state_id ? (
              <button
                onKeyPress={() => {}}
                onClick={() => updateState(state.id)}
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
              <div  className="modalDescription">
              <div >
             
              <ul  className="menuDescription">
                <li>
                  <h2>Descrição da tarefa</h2>
                  <textarea
                    placeholder="Esta tarefa tem como objetivo..."
                    spellcheck="false"
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
              </div>
              </div>
            ) : null}
          </div>
        </div>
        <div className="rowCompShop">
          <div>
            <select value={company} onChange={(e) => setCompany(e.target.value)} id="company">
              <option value="-1">
                Selecione uma Companhia
              </option>

              {taskCompanies.map((comp) => (
                <>              
                    <option key={comp.id} value={comp.id}>
                      {comp.description}
                    </option>               
                </>
              ))}
            </select>
          </div>

          <div>
            <select id="shop" value={shop} onChange={(e) => setShop(e.target.value)}>
              <option value="-1">
                Selecione uma Loja
              </option>

              {shops
                ? shops.map((shop) => (
                    <>
                   
                        <option key={shop.id} value={shop.id}>
                          {shop.description}
                        </option>
                      
                    </>
                  ))
                : null}
            </select>
          </div>

          <div>
            <div ref={domNodeDept} className="depts">
              <p onClick={() => (depts ? setShowDept(!showDept) : null)}>
                Selecione os departamentos
              </p>

              {showDept ? (
                <ul className="menuDept">
                  {depts
                    ? depts.map((dept) => (
                        <li key={dept.id}>
                          <>
                            <label htmlFor="">{dept.description}</label>
                            <input
                              type="checkbox"
                              checked={dept.check}
                              onChange={(e) => {
                                changeCheckDept(
                                  taskVisible.id,
                                  dept.id,
                                  shop,
                                  company
                                );
                              }}
                            />
                          </>
                        </li>
                      ))
                    : null}

                  {/* <li>
                <label htmlFor="">1 TI</label>
                <input type="checkbox" />
              </li> */}
                </ul>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <div className="usersVinculated">
        <div className="user">
          {vinculatedUsers
            ? vinculatedUsers.map((user) => (
                <React.Fragment key={user.user_id}>
                  {userPhotos.map((userPhoto) => (
                    <React.Fragment key={userPhoto.user_id}>
                      {user.user_id === userPhoto.user_id &&
                      user.check === true ? (
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
                    </React.Fragment>
                  ))}
                </React.Fragment>
              ))
            : null}
        </div>
        {/* <div className="addUser">
                <div>
                  <AiOutlineUserAdd size="20" />
                </div>
              </div>
              </div> */}
      </div>
    </div>
  );
};

export default TaskInfo;
