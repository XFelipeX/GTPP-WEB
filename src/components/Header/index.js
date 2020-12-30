import React from "react";
import ButtonLogoff from "../ButtonLogoff";
import CreateTask from "../CreateTask";
import VisionMenu from "../VisionMenu";
import ButtonFilter from "../ButtonFilter";
import InfoUser from '../InfoUser';
import LoadTasks from '../LoadTasks';
import OrderTasks from '../OrderTasks';


import "./style.css";

function Header() {
  return (
    <div className="header-area">
      <div className="container-custom">
        <div className="create-task">
          <InfoUser />
        </div>
        <div className="right-area">
          <CreateTask />
          <LoadTasks/>
          <VisionMenu />
          <OrderTasks/>
          <ButtonFilter />
          <ButtonLogoff />
        </div>
      </div>
    </div>
  );
}

export default Header;
