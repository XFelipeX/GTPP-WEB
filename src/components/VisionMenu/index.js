import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setStateVisi,
  setDateVisi,
  setVincVisi,
  setPriorityVisi
} from "../../redux";
import "./style.css";
import useClickOutside from "../ClickOutside";
import { CgViewComfortable } from "react-icons/cg";

let VisionMenu = () => {
  const [open, setOpen] = useState(false);

  const { visionMenu } = useSelector((state) => state);
  const dispatch = useDispatch();

  function showMenu() {
    setOpen(!open);
  }

  const setStateVisibility = (value) => {
    dispatch(setStateVisi(value));
  };

  const setDateVisibility = (value) => {
    dispatch(setDateVisi(value));
  };

  const setVincVisibility = (value) => {
    dispatch(setVincVisi(value));
  };

  const setPriorityVisibility = (value) => {
    dispatch(setPriorityVisi(value));
  };

  let domNode = useClickOutside(() => {
    setOpen(false);
  });

  return (
    <div ref={domNode} className="visionMenu">
      <p onClick={() => showMenu()} style={{ width: "64px" }}>
        <CgViewComfortable size={64} color="#959595" />
      </p>

      {open ? (
        <ul className="menuExpanded">
          <p htmlFor="">Itens na linha: </p>
          <label htmlFor="">
            <input
              type="checkbox"
              id="priority"
              onChange={(e) => setPriorityVisibility(e.target.checked)}
              checked={visionMenu.priority}
            />
            Prioridade
          </label>
          <label htmlFor="">
            <input
              type="checkbox"
              id="state"
              onChange={(e) => setStateVisibility(e.target.checked)}
              checked={visionMenu.state}
            />
            Estado
          </label>
          <label htmlFor="">
            <input
              type="checkbox"
              id="date"
              onChange={(e) => setDateVisibility(e.target.checked)}
              checked={visionMenu.date}
            />
            Data
          </label>
          <label htmlFor="">
            <input
              type="checkbox"
              id="userVinculated"
              onChange={(e) => setVincVisibility(e.target.checked)}
              checked={visionMenu.vinc}
            />
            Usuários vinculados
          </label>
        </ul>
      ) : null}
    </div>
  );
};

export default VisionMenu;
