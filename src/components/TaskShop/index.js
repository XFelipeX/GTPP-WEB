import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import "./style.css";
import api from "../../services/api";


const TaskShop = ({ task }) => {
  const { permissions } = useSelector((state) => state);

  const { tasks } = useSelector((state) => state);
  const { stateUpdate } = useSelector((state) => state);
  const [shops, setShops] = useState([]);

  async function showShop() {
    const { data } = await api.get("Com_sho_dep_sub.php", {
      params: { AUTH: permissions.session, app_id: 3 },
    });

    setShops(data.data);
  }

  useEffect(() => {
    showShop();
  }, []);

  return (
    <div className="containerShop">
      <div className="shop">
        {shops.map((shop) => {
          <React.Fragment>
            {tasks.map((task) => {
              <>
                {shop.id === task.comshopdepsub_id ? (
                  <h1>{shop.shop_name}</h1>
                ) : null}
              </>;
            })}
          </React.Fragment>;
        })}
      </div>

    </div>
  );
};

export default TaskShop;
