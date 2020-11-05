import React from "react";
import ButtonLogoff from "../ButtonLogoff";
import CreateTask from '../CreateTask'
import "./style.css";


function Header() {
  return (
    <div className="header-area">
      <div className="container-custom">
        <CreateTask /> 
         <ButtonLogoff />
      </div>
    </div>
  );
}

export default Header;

