import React, { useState } from "react";
import './style.css'

let VisionMenu = () =>{
  const [open, setOpen] = useState(false);

  function showMenu() {
    setOpen(!open);
  }
  return (
    <div className="visionMenu">
      <p onClick={() => showMenu()}>Visualização</p>

      {open ? (
       
        <ul className="menuExpanded">
          <p htmlFor="">Itens na linha: </p>
          <label htmlFor="">
          <input type="checkbox" id="company"/>
          Companhia
          </label>
          <label htmlFor="">
          <input type="checkbox" id="shop"/>
          Loja
          </label>
          <label htmlFor="">
          <input type="checkbox" id="priority"/>
          Prioridade
          </label>
          <label htmlFor="">
          <input type="checkbox" id="state"/>
          Estado
          </label>
          <label htmlFor="">
          <input type="checkbox" id="date"/>
          Data
          </label>
          <label htmlFor="">
          <input type="checkbox" id="userVinculated"/>
          Usuários vinculados
          </label>
          <p>Ordenar por:</p>
          <select>
            <option value="">Selecione uma opção</option>
            <option value="priority">Prioridade</option>
            <option value="state">Estado</option>
          </select>
          <select>
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