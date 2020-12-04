import React, { useState, useEffect } from "react";
import { AiOutlineUserAdd } from "react-icons/ai";
import { AiOutlineUser } from "react-icons/ai";
import { BiEdit } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import {
  setCompanyVisi,
  updateTask,
  updateModal,
  getDepts,
  getShop,
  getTaskCsds,
} from "../../redux";
import {
  updateDescription,
  formatDate,
  updateCheckDept,
  loadShopsCompany,
  loadDeptsCompany,
} from "./functions";
import userImg from "../../assets/user@2x.png";
import api from "../../services/api";
import "./style.css";
import useClickOutside from '../ClickOutside';


const TaskInfo = () => {
  const dispatch = useDispatch();
  const { taskStates } = useSelector((state) => state);
  const { taskVisible } = useSelector((state) => state);
  const { userPhotos } = useSelector((state) => state);
  const { taskCompanies } = useSelector((state) => state);
  const { taskShop } = useSelector((state) => state);
  const { taskDepts } = useSelector((state) => state);
  const { modalUpdate } = useSelector((state) => state);

  const [shops, setShops] = useState(false);
  const [depts, setDepts] = useState(false);
  const [company, setCompany] = useState(false);
  const [shop, setShop] = useState({});


  const [taskcsds, setTaskCsds] = useState([]);

  const [fullDescription, setFullDescription] = useState(
    taskVisible.full_description
  );
  const [vinculatedUsers, setVinculatedUsers] = useState([]);
  const [showDesc, setShowDesc] = useState(false);
  const [showDept, setShowDept] = useState(false);
  const { stateUpdate } = useSelector((state) => state);

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
      }else{
        setDepts(false);
        setShops(false);
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
  },[company])

  useEffect(() => {
   
    loadShopsCompany(company).then((response) => {
      setShops(response.data);
    });
  }, [company]);

  useEffect(() => {
      loadDeptsCompany(company, shop, taskVisible.id).then((response) => {
        setDepts(response);
      });
  },[shop])


  function changeCheckDept(taskId, deptId, shopId, companyId) {
    if (shopId == "-1" || companyId == "-1") {
      alert("Selecione companhia e loja!");
    } else {
      try {
           if(taskcsds != null && companyId!=taskcsds[0].company_id){
      for(let i = 0; i<taskcsds.length;i++){
        changeCheckDept(taskVisible.id,taskcsds[i].depart_id,taskcsds[i].shop_id,taskcsds[i].company_id)
      }
    }

          updateCheckDept(taskId, deptId, shopId, companyId).then((response) => {
          // console.log(response)
          dispatch(updateModal());

        });
      } catch (error) {
        console.log("Erro ao selecionar departamento!");
      }
    }
  }

  let domNode = useClickOutside(() =>{
    setShowDesc(false)
  })

  let domNodeDept = useClickOutside(() =>{
    setShowDept(false)
  })

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
          <div ref={domNode} className="col taskDescription">
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
            ) : null}
          </div>
        </div>
        <div className="row">
          <div className="col">
            <select onChange={(e) => setCompany(e.target.value)} id="company">
             
                <option selected value="-1">Selecione uma Companhia</option>
            
              {taskCompanies.map((comp) => (
                <>
                  {taskcsds != null && company == comp.id ? (
                    <option selected key={comp.id} value={comp.id}>
                      {comp.description}
                    </option>
                  ) : (
                    <option key={comp.id} value={comp.id}>
                      {comp.description}
                    </option>
                  )}
                </>
              ))}
            </select>
            <select
              id="shop"
              onClick={(e) =>
                setShop(e.target.value)
              }
            >
             
                <option selected value="-1">Selecione uma Loja</option>
           
              {shops
                ? shops.map((shop) => (
                    <>
                      {taskcsds != null && shop.id == taskcsds[0].shop_id ? (
                        <option selected={true} key={shop.id} value={shop.id}>
                          {shop.description}
                        </option>
                      ) : (
                        <option key={shop.id} value={shop.id}>
                          {shop.description}
                        </option>
                      )}
                    </>
                  ))
                : null}
            </select>
          </div>
        </div>
        <div ref={domNodeDept} className="rowDept">
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
      <div className="usersVinculated">
        <div className="user">
          {vinculatedUsers
            ? vinculatedUsers.map((user) => (
                <React.Fragment>
                  {userPhotos.map((userPhoto) => (
                    <>
                      {user.user_id == userPhoto.user_id &&
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
                    </>
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
