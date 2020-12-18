import React, { useState, useEffect } from "react";
import { AiOutlineUserAdd } from "react-icons/ai";
import { AiOutlineUser } from "react-icons/ai";
import ConfirmAction from '../ConfirmAction';
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
  updateStateTask,
  cancelStateTask
} from "./functions";
import userImg from "../../assets/user@2x.png";
import userEmpty from '../../assets/nullphoto.jpeg';
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
  // const {permissions} = useSelector(state => state);
  // const {vinculatedUsers} = useSelector(state => state);

  const [shops, setShops] = useState(false);
  const [depts, setDepts] = useState(false);
  const [company, setCompany] = useState(false);
  const [shop, setShop] = useState({});

  const [taskcsds, setTaskCsds] = useState([]);
  const [showReasonModal,setShowReasonModal] = useState(false);
  const [showDayModal,setShowDayModal] = useState(false);
  
  const [days,setDays] = useState(1);

  // console.log(taskVisible)

  const [fullDescription, setFullDescription] = useState("");

  // useEffect(() => {
  //   setFullDescription();
  // },[])

  const [reason,setReason] = useState("");
  // const [vinculatedUsers, setVinculatedUsers] = useState([]);
  const {vinculatedUsers} = useSelector(state => state);
  const [showDesc, setShowDesc] = useState(false);
  const [showDept, setShowDept] = useState(false);
  const { stateUpdate } = useSelector((state) => state);
  const [users,setUsers] = useState([]);

  // console.log(taskVisible)
  
  const [showModalAsk,setShowModalAsk] = useState(false);

  const {permissions} = useSelector(state => state);


  useEffect(() => {
    async function loadTaskVisible() {
      let AUTH = sessionStorage.getItem("token");
      let { data } = await api.get(
        "GTPP/Task.php?AUTH=" +
          AUTH +
          "&app_id=3&id=" +
          taskVisible.info.task_id
      );

      // console.log(taskVisible)
      //   console.log(data);

      if(data)

      setTaskCsds(data.data.csds);

      if (data.data.csds !== null) {
        loadShopsCompany(data.data.csds[0].company_id).then((response) => {
          setShops(response.data);
        });
        loadDeptsCompany(
          data.data.csds[0].company_id,
          data.data.csds[0].shop_id,
          taskVisible.info.task_id
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
  const dateInitial = formatDate(taskVisible.info ? taskVisible.info.initial_date : "");
  const dateFinal = formatDate(taskVisible.info ? taskVisible.info.final_date : "");

  function updateFullDescription(taskId, description) {
    updateDescription(taskId, description);
    setShowDesc(false);
    dispatch(updateTask());
  }

  async function loadVinculateUsers() {
    const { data } = await api.get("GTPP/Task_User.php", {
      params: {
        AUTH: permissions.session,
        task_id: taskVisible.info.task_id,
        list_user:0,
        app_id: 3,
      },
    });
    // console.log(data);
    try {
      // dispatch(getVinculatedUsers(data.data));
      setUsers(data.data);
    } catch (error) {
      
    }
 
    // console.log(users)
    // console.log(task.id)
  }

  useEffect(() => {
    loadVinculateUsers();
  },[])

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
    loadDeptsCompany(company, shop, taskVisible.info.task_id).then((response) => {
      setDepts(response);
    });
  }, [shop,modalUpdate]);

  // function loadCsds(){
  //   for (let i = 0; i < taskcsds.length; i++) {
  //     changeCheckDept(
  //       taskVisible.info.task_id,
  //       taskcsds[i].depart_id,
  //       taskcsds[i].shop_id,
  //       taskcsds[i].company_id
  //     );
  //   }
  // }

  function changeCheckDept(taskId, deptId, shopId, companyId) {
    if (shopId == "-1" || companyId == "-1") {
      alert("Selecione companhia e loja!");
    } else {
      try {
       
          updateCheckDept(taskId, deptId, shopId, companyId).then((response) => {
            if(response==null){
              setShowDept(false);
              // loadCsds();
            }
            
            // setShop(shop);
          });
        

        dispatch(updateModal());
        
      } catch (error) {
        console.log("Erro ao selecionar departamento!");
      }
    }
  }

  let domNodeDept = useClickOutside(() => {
    setShowDept(false);
  });

  function updateState(stateId,reason,days){
    // console.log("estado atual é o "+taskVisible);
    if(taskVisible.info.state_id==1 || taskVisible.info.state_id==2){
      if(reason==null){
        setShowReasonModal(true);
      } else if( reason === ""){
        alert("o motivo é obrigatório!")
      }else{
        updateStateTask(taskVisible.info.task_id,reason).then(response => taskVisible.info.state_id = response.id).catch(error => {});
        dispatch(updateTask());
        dispatch(updateModal());
        setShowReasonModal(false);
        setReason("");
      }
    }else if(taskVisible.info.state_id==5){
      if(days==null){
        setShowDayModal(true);
      }else{
        updateStateTask(taskVisible.info.task_id,reason,days).then(response =>  ( 
          console.log(response.id),
          taskVisible.info.state_id = response.id,
          taskVisible.info.final_date = response.final_date
        ) ).catch(error => {
          // console.log(error.message);
         
        });
      dispatch(updateTask());
      dispatch(updateModal());
      setShowDayModal(false);
      setDays("");
      }

    }
    else if(taskVisible.info.state_id!==5){
      if(confirm==false){
        setShowConfirmAction(true);
        return;
      }else if (confirm ==true){
        updateStateTask(taskVisible.info.task_id).then(response => taskVisible.info.state_id = response.id).then(response => {
          dispatch(updateTask());
          dispatch(updateModal());
          setShowConfirmAction(false)
          setShowConfirmAction(false)
        }).catch(error => {console.log(error)});
     
      return;
      }
      updateStateTask(taskVisible.info.task_id).then(response => taskVisible.info.state_id = response.id);
      dispatch(updateTask());
      dispatch(updateModal());
    }
  }

  function cancelTask(taskId,reason){

    // console.log("estado atual é o "+stateId);
    if( reason === ""){
      alert("o motivo é obrigatório!")
      return;
    }

    
      // console.log('aqui')
      cancelStateTask(taskId,reason).then(response => taskVisible.info.state_id = response.id).catch(error => {
        // console.log(error);
      });
      dispatch(updateTask());
      dispatch(updateModal());
      setShowModalAsk(false);
    
  }

  // console.log(permissions)
  // console.log(taskVisible)  

  //contador button estados
  let count = 0;


  const [showConfirmAction,setShowConfirmAction] = useState(false);
  const [confirm,setConfirm] = useState(false);


  let ModalCancel = (props) => {
    const [reason,setReason] = useState("");
    return(
      <div  className="modalAsk">
      <div >
     
      <ul  className="menuAsk">
      <li>
          <h3>{props.ask} tem certeza?</h3>
          <h2>*Informe o motivo:</h2>
          <textarea
            spellCheck="false"
            rows="5"
            onChange={(e) => setReason(e.target.value)}
          ></textarea>
        </li>
        <li>
          <button
            className="btnConfirm"
            onClick={(e) =>
              cancelTask(taskVisible.info.task_id,reason)
            }
          >
            Confirmar
          </button>
          <button
            className="btnCancel"
            onClick={() =>
              setShowModalAsk(false)
            }
          >
            Cancelar
          </button>
        </li>
      </ul>
      </div>
      </div>
    )
  } 

  if(users.length>0){
    users.map((user) => {
 
      let result = vinculatedUsers.filter(users => users.id == user.user_id);
    
      
      user.name = result[0].user;
      // console.log(user.name)
    })
  }

  // console.log(vinculatedUsers);
  // console.log(taskVisible)

  return (
    <div className="taskInfo">
      {showConfirmAction ? (
        <>
        {taskVisible.info.state_id == 6 || taskVisible.info.state_id == 4 ? ( <ConfirmAction confirm={() => setConfirm(true)} question="Tem certeza que deseja reabrir esta tarefa" action={() => updateState(taskVisible.info.state_id)} cancelAction={() => setShowConfirmAction(false)}/> ) : (null)}
        {taskVisible.info.state_id == 3 ? (<ConfirmAction confirm={() => setConfirm(true)} question="Tem certeza que deseja finalizar esta tarefa" action={() => updateState(taskVisible.info.state_id)} cancelAction={() => setShowConfirmAction(false)}/> ) : null}
        {/* {taskVisible.state_id == 7 ? (<ConfirmAction confirm={() => setConfirm(true)} question="Tem certeza que deseja finalizar esta tarefa" action={() => updateState(taskVisible.state_id)} cancelAction={() => setShowConfirmAction(false)}/> ) : null} */}
        </>
      ) : null}

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
                      updateState(taskVisible.info.state_id,reason)
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
                    spellCheck="false"
                    rows="5"
                    onChange={(e) => setDays(e.target.value)}
                  ></input>
                </li>
                <li>
                  <button
                    className="btnConfirm"
                    onClick={(e) =>
                      updateState(taskVisible.info.state_id,reason,days)
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

      {showModalAsk ? (
        taskVisible.info.state_id != 7 ? <ModalCancel ask="Cancelando a tarefa"/> : <ModalCancel ask="Retomando a tarefa"/>
      ) : null}

      <div className="row">
        <h1>Início : {dateInitial}</h1>
        <h1>Fim : {dateFinal}</h1>

        {taskStates.map((state) => (
          <React.Fragment key={state.id}>
          {taskVisible.info ? (
            state.id == taskVisible.info.state_id ? (
              <button
                onClick={() => {
                  count++;

                  setTimeout(() => {
                    if(count==1 && state.id!==7){
                      if(state.id==6||state.id==3 || state.id==4){
                        setShowConfirmAction(true);
                      }else{
                        updateState(state.id)
                      }              
                  } else if(count ==2){
                    setShowModalAsk(true);
                    return;
                  }

                  },500)

                  setTimeout(() => {
                    count = 0;
                  },500)             
                
                }}
                className="buttonState stateControl"
                style={{ backgroundColor: "#" + state.color }}
              >
                {/* {console.log(state.color)} */}
                <h2>{state.description}</h2>
              </button>
            ) : null
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
                    spellCheck="false"
                    rows="5"
                    value={taskVisible.task.full_description!=null ? taskVisible.task.full_description : fullDescription}
                    onChange={(e) => permissions.id === taskVisible.info.user_id || permissions.administrator ===1 ? setFullDescription(e.target.value) : null}
                  ></textarea>
                </li>
                <li>
                  <button
                    className="btnSaveDescription"
                    onClick={() =>
                      updateFullDescription(taskVisible.info.task_id, fullDescription)
                    }
                  >
                    Salvar
                  </button>

                  <button
                    className="btnCancel"
                    onClick={() => {
                      setShowDesc(false);
                      setFullDescription(fullDescription);
                    }
                    
                      
                    }
                    style={{margin:0}}
                  >
                    Cancelar
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
                                  taskVisible.info.task_id,
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
        {users.map((user) => (
            
            <React.Fragment key={user.user_id}>
              {userPhotos.map((userPhoto) => (
               
                <React.Fragment key={userPhoto.user_id}>
                  {user.user_id == userPhoto.user_id 
                 ? (
                
               

                      <div className="userControl">

                      <img
                      
                        src={userPhoto.photo}
                        width="35"
                        height="35"
                        alt={user.name}
                        title={user.name}
                      />
                     
                     </div>
                    
                      
                 
                  ) : null}
                </React.Fragment>
              ))}
            </React.Fragment>
          ))}
         
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
