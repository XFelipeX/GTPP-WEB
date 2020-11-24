import React,{useState} from 'react'
import { AiOutlineUserAdd } from "react-icons/ai";
import { BiEdit } from "react-icons/bi";
import { useDispatch,useSelector} from 'react-redux';
import {updateTask} from '../../redux';
import {updateDescription,formatDate} from './functions';
import userImg from "../../assets/user@2x.png";
import './style.css';

const TaskInfo = () => {

    const dispatch = useDispatch();
    const { taskStates } = useSelector((state) => state);
    const {taskVisible} = useSelector(state => state);
    const [fullDescription,setFullDescription] = useState(taskVisible.full_description);
    const [showDesc, setShowDesc] = useState(false);
    const [showDept, setShowDept] = useState(false);

    //formatando datas
    const dateInitial = formatDate(taskVisible.initial_date);
    const dateFinal = formatDate(taskVisible.final_date);

    function updateFullDescription(taskId,description){
        updateDescription(taskId,description);
        setShowDesc(false);
        dispatch(updateTask());
      }

    return(
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
                        <button className="btnSaveDescription" onClick={() => updateFullDescription(taskVisible.id,fullDescription)}>Salvar</button>
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

              {/* <div className="rowControlDescription">
                <button className="btnSaveDescription">Salvar</button>
                <button className="btnEditDescription">Editar</button>
              </div> */}
            </div>
            <div className="usersVinculated">
              <div className="user">
                <div>
                  <img src={userImg} alt="" width="" />
                </div>
              </div>
              <div className="addUser">
                <div>
                  <AiOutlineUserAdd size="20" />
                </div>
              </div>
            </div>
          </div>
    )
}

export default TaskInfo;