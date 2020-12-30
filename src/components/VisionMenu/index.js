import React, { useState } from "react";
import {useDispatch, useSelector} from 'react-redux';
import {setCol, setOrder, updateTask, setStateVisi, setDateVisi, setVincVisi, setPriorityVisi, setCompanyVisi,setShopVisi} from '../../redux';
import './style.css';
import useClickOutside from '../ClickOutside';
import {CgViewComfortable} from 'react-icons/cg';

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

  const setShopVisibility = (value) => {
    dispatch(setShopVisi(value))
  }

  // const setCompanyVisibility = (value) => {
  //   dispatch(setCompanyVisi(value))
  // }

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


  let domNode = useClickOutside(() =>{
    setOpen(false)
  })

  return (
    <div ref={domNode} className="visionMenu">
      <p onClick={() => showMenu()} style={{width:"64px"}}><CgViewComfortable size={64} color="#959595"/></p>

      {open ? (
       
        <ul className="menuExpanded">
          <p htmlFor="">Itens na linha: </p>
          {/* <label htmlFor="">
          <input type="checkbox" id="company" onChange={e => setCompanyVisibility(e.target.checked)} checked={visionMenu.company} />
          Companhia
          </label>
          <label htmlFor="">
          <input type="checkbox" id="shop" onChange={e => setShopVisibility(e.target.checked)} checked={visionMenu.shop}/>
          Loja
          </label> */}
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
          {/* <p>Ordenar por:</p>
          <select onChange={ e => changeCol(e.target.value)}>
            <option value="">Selecione uma opção</option>
            <option value="1">Prioridade</option>
            <option value="3">Estado</option>
          </select>
          <select onChange={ e => changeOrder(e.target.value)}>
            <option value="">Selecione uma opção</option>
            <option value="asc">Ascendente</option>
            <option value="desc">Descendente</option>
          </select> */}
        </ul>
      ) : null}
    </div>
  );
}


export default VisionMenu;