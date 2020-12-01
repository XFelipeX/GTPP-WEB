import React, { useState, useEffect } from "react";
import { AiOutlineUserAdd } from "react-icons/ai";
import { AiOutlineUser } from "react-icons/ai";
import { BiEdit } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { setCompanyVisi, updateTask,updateModal } from "../../redux";
import { updateDescription, formatDate,updateCheckDept } from "./functions";
import userImg from "../../assets/user@2x.png";
import api from "../../services/api";
import "./style.css";
import { copyFile } from "fs";
import { loadDept } from "../TaskTable/functions";

const TaskInfo = () => {
  const dispatch = useDispatch();
  const { taskStates } = useSelector((state) => state);
  const { taskVisible } = useSelector((state) => state);
  // const { stateUpdate } = useSelector((state) => state);
  const { userPhotos } = useSelector((state) => state);
  // const { permissions } = useSelector((state) => state);
  const { taskCompanies } = useSelector((state) => state);
  const { taskShop } = useSelector((state) => state);
  const { taskDepts } = useSelector((state) => state);
  const {modalUpdate} = useSelector(state => state);

  const { taskCsds } = useSelector((state) => state);


  // if(taskCsds.csds!=null){
  //    taskCsds.csds.map((csds) => {
  //   setTaskCompany(csds)
  // })
  // }

  const csds = taskCsds.csds;

  // console.log(csds);

  const [fullDescription, setFullDescription] = useState(
    taskVisible.full_description
  );
  const [vinculatedUsers, setVinculatedUsers] = useState([]);
  const [showDesc, setShowDesc] = useState(false);
  const [showDept, setShowDept] = useState(false);
  const {stateUpdate} = useSelector(state => state);

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

  // function verifyCheck(idDept) {
  //   if (csds != null) {
  //     let check;

  //     for (let i = 0; i < csds.length; i++) {
  //       if (csds[i].depart_id == idDept) {
  //         // console.log(idDept)
  //         check = true;
  //         break;
  //       } else {
  //         check = false;
  //       }
  //     }

  //     return check;
  //   }

  //   return false;
  // }

  function verifyCheck(idDept) {
    if (csds != null) {
      let check;

      for (let i = 0; i < csds.length; i++) {
        if (csds[i].depart_id == idDept) {
          // console.log(idDept)
          check = true;
          break;
        } else {
          check = false;
        }
      }

      return check;
    }

    return false;
  }


  let loadDepts = () => {
    let depts = [];
    for(let i =0 ;i<taskDepts.length;i++){
      // let check = "check":false;
      taskDepts[i].check = verifyCheck(taskDepts[i].id);
      depts.push(taskDepts[i]);
    }

    return depts;
    // console.log(depts);
  }

  useEffect(() => {
    loadDepts();
  },[modalUpdate])


  function changeCheckDept(taskId,deptId,shopName,companyName){
    if(shopName==''||companyName==''){
      alert('Selecione companhia e loja!')
    }else{

    
    try {
      let company = taskCompanies.filter((company) => company.description == companyName);
      let shop = taskShop.filter((shop) => shop.description == shopName);
  
      updateCheckDept(taskId,deptId,shop[0].id,company[0].id).then(response => {})
  
      // console.log(company,shop)
  
      dispatch(updateModal());
    } catch (error) {
      console.log('Erro ao selecionar departamento!');
    }
  }
   
    // console.log(e.target.checked);
  }

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
            <select onChange={(e) => {}} id="company">
              {csds == null ? (
                <option selected value=''>Selecione uma Companhia</option>
              ) : null}
              {taskCompanies.map((company) => (
                <>
                  {csds != null && csds[0].company_id == company.id ? (
                    <option selected={true} key={company.id}>
                      {company.description}
                    </option>
                  ) : (
                    <option key={company.id}>{company.description}</option>
                  )}
                </>
              ))}
            </select>
            <select id="shop">
              {csds === null ? (
                <option selected value=''>Selecione uma Loja</option>
              ) : null}
              {taskShop.map((shop) => (
                <>
                  {csds != null && shop.id == csds[0].shop_id ? (
                    <option selected={true} key={shop.id}>
                      {shop.description}
                    </option>
                  ) : (
                    <option key={shop.id}>{shop.description}</option>
                  )}
                </>
              ))}
            </select>
          </div>
        </div>
        <div className="rowDept">
          <p onClick={() => setShowDept(!showDept)}>
            Selecione os departamentos
          </p>

          {showDept ? (
            <ul className="menuDept">
              {loadDepts().map((dept) => (
                <li key={dept.id}>
                  <>
                    <label htmlFor="">{dept.description}</label>
                    <input type="checkbox" checked={dept.check} onChange={ 
                      e => changeCheckDept(taskVisible.id,dept.id,document.getElementById('shop').value,document.getElementById('company').value)} onClick={(e) => {} }/>
                  </>
                </li>
              ))}
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

{
  /* <>
                  <label htmlFor="">{dept.description}</label>
                  <input type="checkbox" />
                  </> */
}
