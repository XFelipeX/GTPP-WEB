import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { loadShopsCompany, loadDeptsCompany } from "./functions";
import "./style.css";
import { AiTwotoneFilter } from "react-icons/ai";
import useClickOutside from "../ClickOutside";
import { getTaskFilter } from "../../redux";

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
  const [stateFilter, setStateFilter] = useState({
    fazer: true,
    fazendo: true,
    analise: true,
    parado: true,
    bloqueado: true,
    feito: false,
    cancelado: false,
  });
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
    setStateFilter({
      fazer: true,
      fazendo: true,
      analise: true,
      parado: true,
      bloqueado: true,
      feito: false,
      cancelado: false,
    });
  });

  // console.log(tasks);

  function taskFilter() {
    let filterDo = [];
    let filterDoing = [];
    let filterAnalyze = [];
    let filterStopped = [];
    let filterBlocked = [];
    let filterDone = [];
    let filterCanceled = [];

    if (company == "-1" || shop == "-1" || dept == "-1") {
      filterDo = tasks.filter((task) =>
        stateFilter.fazer ? task.state_id == 1 : null
      );
      filterDoing = tasks.filter((task) =>
        stateFilter.fazendo ? task.state_id == 2 : null
      );
      filterAnalyze = tasks.filter((task) =>
        stateFilter.analise ? task.state_id == 3 : null
      );
      filterStopped = tasks.filter((task) =>
        stateFilter.parado ? task.state_id == 4 : null
      );
      filterBlocked = tasks.filter((task) =>
        stateFilter.bloqueado ? task.state_id == 5 : null
      );
      filterDone = tasks.filter((task) =>
        stateFilter.feito ? task.state_id == 6 : null
      );
      filterCanceled = tasks.filter((task) =>
        stateFilter.cancelado ? task.state_id == 7 : null
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
          stateFilter.fazer ? task.state_id == 1 : null
        );
        filterDoing = tasksFilter.filter((task) =>
          stateFilter.fazendo ? task.state_id == 2 : null
        );
        filterAnalyze = tasksFilter.filter((task) =>
          stateFilter.analise ? task.state_id == 3 : null
        );
        filterStopped = tasksFilter.filter((task) =>
          stateFilter.parado ? task.state_id == 4 : null
        );
        filterBlocked = tasksFilter.filter((task) =>
          stateFilter.bloqueado ? task.state_id == 5 : null
        );
        filterDone = tasksFilter.filter((task) =>
          stateFilter.feito ? task.state_id == 6 : null
        );
        filterCanceled = tasksFilter.filter((task) =>
          stateFilter.cancelado ? task.state_id == 7 : null
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
    dispatch(getTaskFilter(finalFilter));
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
                checked={stateFilter.fazer}
                onChange={() => {
                  setStateFilter((prev) => ({
                    ...prev,
                    fazer: !prev.fazer,
                  }));
                }}
              />
              <label> Fazer</label>
            </li>
            <li>
              <input
                type="checkbox"
                checked={stateFilter.fazendo}
                onChange={() => {
                  setStateFilter((prev) => ({
                    ...prev,
                    fazendo: !prev.fazendo,
                  }));
                }}
              />
              <label> Fazendo</label>
            </li>
            <li>
              <input
                type="checkbox"
                checked={stateFilter.analise}
                onChange={() => {
                  setStateFilter((prev) => ({
                    ...prev,
                    analise: !prev.analise,
                  }));
                }}
              />
              <label> Análise</label>
            </li>
            <li>
              <input
                type="checkbox"
                checked={stateFilter.parado}
                onChange={() => {
                  setStateFilter((prev) => ({
                    ...prev,
                    parado: !prev.parado,
                  }));
                }}
              />
              <label> Parado</label>
            </li>
            <li>
              <input
                type="checkbox"
                checked={stateFilter.bloqueado}
                onChange={() => {
                  setStateFilter((prev) => ({
                    ...prev,
                    bloqueado: !prev.bloqueado,
                  }));
                }}
              />
              <label> Bloqueado</label>
            </li>
            <li>
              <input
                type="checkbox"
                checked={stateFilter.feito}
                onChange={() => {
                  setStateFilter((prev) => ({
                    ...prev,
                    feito: !prev.feito,
                  }));
                }}
              />
              <label> Feito</label>
            </li>
            <li>
              <input
                type="checkbox"
                checked={stateFilter.cancelado}
                onChange={() => {
                  setStateFilter((prev) => ({
                    ...prev,
                    cancelado: !prev.cancelado,
                  }));
                }}
              />
              <label> Cancelado</label>
            </li>
          </ul>

          <button type="button" onClick={() => taskFilter()}>
            Ok
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default ButtonFilter;
