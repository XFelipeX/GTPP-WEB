import React from "react";
import ButtonLogoff from "../ButtonLogoff";
import CreateTask from "../CreateTask";
import VisionMenu from "../VisionMenu";
import ButtonFilter from "../ButtonFilter";
import "./style.css";

function Header() {
  return (
    <div className="header-area">
      <div className="container-custom">
        <div className="create-task">
          <CreateTask />
        </div>
        <div className="right-area">
        <ButtonFilter/>
          <VisionMenu />
          <ButtonLogoff />
        </div>
      </div>
    </div>
  );
}

export default Header;
