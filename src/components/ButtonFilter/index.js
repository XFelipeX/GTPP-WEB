import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { loadShopsCompany, loadDeptsCompany } from "./functions";
import "./style.css";
import { AiTwotoneFilter } from "react-icons/ai";
import useClickOutside from "../ClickOutside";
import { getTaskFilter, setAnalyzeVisi, setBlockedVisi, setCanceledVisi, setDoingVisi, setDoneVisi, setDoVisi, setStoppedVisi } from "../../redux";



const ButtonFilter = () => {
  const dispatch = useDispatch();
  const { taskCompanies } = useSelector((state) => state);
  const { tasks } = useSelector((state) => state);
  const [showModal, setShowModal] = useState(false);
  const [company, setCompany] = useState(-1);
  const [shop, setShop] = useState(-1);
  const [dept, setDept] = useState(-1);
  const [depts, setDepts] = useState([]);
  const [shops, setShops] = useState([]);
  const {filterTask} = useSelector(state => state)
  const { permissions } = useSelector((state) => state);
  const AUTH = permissions.session;

  useEffect(() => {
    // console.log(company)
    function loadShops() {
      if (company != "-1") {
        // dispatch(getDepts([]));

        loadShopsCompany(company, AUTH).then((response) => {
          setShops(response.data);
        });
      } else {
        setShops([]);
      }
    }

    loadShops();
  }, [company]);

  useEffect(() => {
    loadDeptsCompany(company, shop, AUTH).then((response) => {
      setDepts(response);
    });
  }, [shop]);

  let domNode = useClickOutside(() => {
    setShowModal(false);
    setCompany("-1");
    setShop("-1");
    setDept("-1");
    setDepts([]);
    setShops([]);
    // setStateFilter({
    //   fazer: true,
    //   fazendo: true,
    //   analise: true,
    //   parado: true,
    //   bloqueado: true,
    //   feito: false,
    //   cancelado: false,
    // });
  });

  // const [filter,setFilter] = useState([]);

  useEffect(() => {
    taskFilterAction();
  },[tasks])

  // console.log(tasks);

 

  function taskFilterAction() {
    // console.log(filterTask)
    let filterDo = [];
    let filterDoing = [];
    let filterAnalyze = [];
    let filterStopped = [];
    let filterBlocked = [];
    let filterDone = [];
    let filterCanceled = [];

    if (company == "-1" || shop == "-1" || dept == "-1") {
      filterDo = tasks.filter((task) =>
      filterTask.do ? task.state_id == 1 : null
      );
      filterDoing = tasks.filter((task) =>
      filterTask.doing ? task.state_id == 2 : null
      );
      filterAnalyze = tasks.filter((task) =>
      filterTask.analyze ? task.state_id == 3 : null
      );
      filterStopped = tasks.filter((task) =>
      filterTask.stopped ? task.state_id == 4 : null
      );
      filterBlocked = tasks.filter((task) =>
      filterTask.blocked ? task.state_id == 5 : null
      );
      filterDone = tasks.filter((task) =>
      filterTask.done ? task.state_id == 6 : null
      );
      filterCanceled = tasks.filter((task) =>
      filterTask.canceled ? task.state_id == 7 : null
      );
    } else {
      let filterCsds = [];
      let tasksFilter = [];
      filterCsds = tasks.filter((task) => task.csds.length>0);  
      // console.log(filterCsds)
      filterCsds.forEach(task => {
        task.csds.forEach(csds => {
          if(company == csds.company_id && shop == csds.shop_id && dept == csds.depart_id){
            tasksFilter.push(task);
          }
        })
      })

      if (tasksFilter.length > 0) {
        filterDo = tasksFilter.filter((task) =>
        filterTask.do ? task.state_id == 1 : null
        );
        filterDoing = tasksFilter.filter((task) =>
        filterTask.doing ? task.state_id == 2 : null
        );
        filterAnalyze = tasksFilter.filter((task) =>
        filterTask.analyze ? task.state_id == 3 : null
        );
        filterStopped = tasksFilter.filter((task) =>
        filterTask.stopped ? task.state_id == 4 : null
        );
        filterBlocked = tasksFilter.filter((task) =>
        filterTask.blocked ? task.state_id == 5 : null
        );
        filterDone = tasksFilter.filter((task) =>
        filterTask.done ? task.state_id == 6 : null
        );
        filterCanceled = tasksFilter.filter((task) =>
        filterTask.canceled ? task.state_id == 7 : null
        );
      }
    }

    let finalFilter = [
      ...filterDo,
      ...filterDoing,
      ...filterAnalyze,
      ...filterStopped,
      ...filterBlocked,
      ...filterDone,
      ...filterCanceled,
    ];
    // setFilter([...finalFilter]);
    dispatch(getTaskFilter(finalFilter));
  }

  const setDoVisibility = (value) => {
    dispatch(setDoVisi(value))
  }
  const setDoingVisibility = (value) => {
    dispatch(setDoingVisi(value))
  }
  const setAnalyzeVisibility = (value) => {
    dispatch(setAnalyzeVisi(value))
  }
  const setStoppedVisibility = (value) => {
    dispatch(setStoppedVisi(value))
  }
  const setBlockedVisibility = (value) => {
    dispatch(setBlockedVisi(value))
  }
  const setDoneVisibility = (value) => {
    dispatch(setDoneVisi(value))
  }
  const setCanceledVisibility = (value) => {
    dispatch(setCanceledVisi(value))
  }

  // console.log(depts)

  return (
    <div className="buttonFilterArea" ref={domNode}>
      <button className="buttonFilter" onClick={() => setShowModal(!showModal)}>
        <AiTwotoneFilter size={50} style={{ color: "#959595" }} />
      </button>
      {showModal ? (
        <div className="modal-filter">
          <p>Filtrar Por</p>

          <ul className="company-info">
            <li>
              Companhia
              <select
                value={company}
                onChange={(e) => {
                  setCompany(e.target.value);
                  setShop("-1");
                  setDept("-1");
                  setDepts([]);
                  setShops([]);
                }}
              >
                <option value="-1">Selecione</option>
                {taskCompanies.map((comp) => (
                  
                    <option key={comp.id} value={comp.id}>
                      {comp.description}
                    </option>
                  
                ))}
              </select>
            </li>
            <li>
              Loja
              <select value={shop} onChange={(e) => setShop(e.target.value)}>
                <option value="-1">Selecione</option>
                {shops
                  ? shops.map((shop) => (
                      <option key={shop.id} value={shop.id}>
                        {shop.description}
                      </option>
                    ))
                  : null}
              </select>
            </li>
            <li>
              Departamento
              <select value={dept} onChange={(e) => setDept(e.target.value)}>
                <option value="-1">Selecione</option>
                {depts
                  ? depts.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.description}
                      </option>
                    ))
                  : null}
              </select>
            </li>
          </ul>
          <ul className="state-filter">
            <p>Estado</p>
            <li>
              <input
                type="checkbox"
                checked={filterTask.do}
                onChange={() => {
                 setDoVisibility(!filterTask.do)
                }}
              />
              <label> Fazer</label>
            </li>
            <li>
              <input
                type="checkbox"
                checked={filterTask.doing}
                onChange={() => {
                  setDoingVisibility(!filterTask.doing)
                }}
              />
              <label> Fazendo</label>
            </li>
            <li>
              <input
                type="checkbox"
                checked={filterTask.analyze}
                onChange={() => {
                  setAnalyzeVisibility(!filterTask.analyze)
                }}
              />
              <label> Análise</label>
            </li>
            <li>
              <input
                type="checkbox"
                checked={filterTask.stopped}
                onChange={() => {
                  setStoppedVisibility(!filterTask.stopped)
                }}
              />
              <label> Parado</label>
            </li>
            <li>
              <input
                type="checkbox"
                checked={filterTask.blocked}
                onChange={() => {
                  setBlockedVisibility(!filterTask.blocked)
                }}
              />
              <label> Bloqueado</label>
            </li>
            <li>
              <input
                type="checkbox"
                checked={filterTask.done}
                onChange={() => {
                  setDoneVisibility(!filterTask.done)
                }}
              />
              <label> Feito</label>
            </li>
            <li>
              <input
                type="checkbox"
                checked={filterTask.canceled}
                onChange={() => {
                  setCanceledVisibility(!filterTask.canceled)
                }}
              />
              <label> Cancelado</label>
            </li>
          </ul>

          <button type="button" onClick={() => {
            taskFilterAction();
            setShowModal(false);
          }}>
            Ok
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default ButtonFilter;
