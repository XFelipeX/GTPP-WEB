import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { AiFillShop } from "react-icons/ai";
import "./style.css";
import useClickOutside from "../ClickOutside";

const ComShopDept = ({ task }) => {
  const [showComp, setShowComp] = useState(false);
  const { taskShop } = useSelector((state) => state);
  const { taskCompanies } = useSelector((state) => state);
  const { taskDepts } = useSelector((state) => state);
  const [csds, setCsds] = useState([]);

  // useEffect(() => {

  // },[])

  function loadCsds() {
    const taskCsds = task.csds;
    let amount = [];

    if (taskCsds.length > 0) {
      taskCsds.map((csds) => {
        let company = taskCompanies.filter(
          (company) => company.id === csds.company_id
        );
        let shop = taskShop.filter(
          (shop) => shop.id === csds.shop_id
        );
        let dept = taskDepts.filter(
          (dept) => dept.id === csds.depart_id
        );
            
        const object = {"company":company[0].description,"shop":shop[0].description,"department":dept[0].description};

        amount.push(object);
      });

      setCsds(amount);

    }
  }

  let domNode = useClickOutside(() => {
    setShowComp(false);
  });

  return (
    <div className="compContainer">
      {showComp && csds.length>0 && (
        <ul className="compShopDeptList" ref={domNode}>
          {csds.map(csds => (
              <li key={csds.shop+csds.department}><span className="companyCsds">{csds.company}</span> - <span className="companyCsds">{csds.shop}</span> - <span className="companyCsds">{csds.department}</span></li>
          ))}
        </ul>
      )}

      <div
        className="box"
        onClick={() => {
          loadCsds();
          setShowComp(!showComp);
        }}
      >
        <AiFillShop size={18} color={task.csds.length===0 ? "#696969" : "#000"}/>
      </div>
    </div>
  );
};

export default ComShopDept;
