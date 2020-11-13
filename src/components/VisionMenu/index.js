import React, { useState } from "react";
import {useDispatch, useSelector} from 'react-redux';
import {setCol, setOrder, updateTask, setStateVisi, setDateVisi, setVincVisi, setPriorityVisi, setCompanyVisi} from '../../redux';
import './style.css'

let VisionMenu = () =>{
  const [open, setOpen] = useState(false);
  
  const {visionMenu} = useSelector(state => state);
  const dispatch = useDispatch();

  function showMenu() {
    setOpen(!open);
  }

  const changeCol = (value) => {
    if(value !== 'vazio'){
      dispatch(setCol(value));
      dispatch(updateTask());
    }
  }

  const changeOrder = (value) => {
    if(value !== 'vazio'){
      dispatch(setOrder(value));
      dispatch(updateTask());
    }
  }

  const setStateVisibility = (value) => {
    dispatch(setStateVisi(value))
  }

  const setCompanyVisibility = (value) => {
    dispatch(setCompanyVisi(value))
  }

  const setDateVisibility = (value) => {
    dispatch(setDateVisi(value))
  }

  const setVincVisibility = (value) => {
    dispatch(setVincVisi(value))
  }

  const setPriorityVisibility = (value) => {
    // console.log(value);
    dispatch(setPriorityVisi(value))
  }

  return (
    <div className="visionMenu">
      <p onClick={() => showMenu()}>Visualização</p>

      {open ? (
       
        <ul className="menuExpanded">
          <p htmlFor="">Itens na linha: </p>
          <label htmlFor="">
          <input type="checkbox" id="company" onChange={e => setCompanyVisibility(e.target.checked)} checked={visionMenu.company} />
          Companhia
          </label>
          <label htmlFor="">
          <input type="checkbox" id="shop"/>
          Loja
          </label>
          <label htmlFor="">
          <input type="checkbox" id="priority" onChange={e => setPriorityVisibility(e.target.checked)} checked={visionMenu.priority} />
          Prioridade
          </label>
          <label htmlFor="">
          <input type="checkbox" id="state"  onChange={e => setStateVisibility(e.target.checked)} checked={visionMenu.state}/>
          Estado
          </label>
          <label htmlFor="">
          <input type="checkbox" id="date" onChange={e => setDateVisibility(e.target.checked)} checked={visionMenu.date}/>
          Data
          </label>
          <label htmlFor="">
          <input type="checkbox" id="userVinculated" onChange={e => setVincVisibility(e.target.checked)} checked={visionMenu.vinc}/>
          Usuários vinculados
          </label>
          <p>Ordenar por:</p>
          <select onChange={ e => changeCol(e.target.value)}>
            <option value="">Selecione uma opção</option>
            <option value="priority">Prioridade</option>
            <option value="state">Estado</option>
          </select>
          <select onChange={ e => changeOrder(e.target.value)}>
            <option value="">Selecione uma opção</option>
            <option value="asc">Ascendente</option>
            <option value="desc">Descendente</option>
          </select>
        </ul>
      ) : null}
    </div>
  );
}


export default VisionMenu;