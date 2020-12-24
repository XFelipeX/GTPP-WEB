import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import "./style.css";
import api from "../../services/api";


const TaskShop = ({ task }) => {
  const { permissions } = useSelector((state) => state);
  const AUTH = permissions.session;
  const { tasks } = useSelector((state) => state);
  // const { stateUpdate } = useSelector((state) => state);
  // const initialState = () => [];
  const [shops, setShops] = useState([]);

  async function showShop() {
    try{
      const { data } = await api.get("CCPP/Com_sho_dep_sub.php", {
        params: { AUTH: AUTH, app_id: 3 },
      });
      if(data.error==true||data==null){
        console.log(data.error);
        return data;
      }
      setShops(data.data);
    }catch(error){
      console.log(error)
      return [{}];
    }
   
  }

  useEffect(() => {
    showShop();
  }, []);

  return (
    <div className="containerShop">
      <div className="shop">
       
        { shops ? 
          shops.map((shop) => {
          <React.Fragment key={shop.id}>
            {tasks.map((task) => {
              <>
                {shop.id === task.comshopdepsub_id ? (
                  <h1>{shop.shop_name}</h1>
                ) : null}
              </>;
            })}
          </React.Fragment>;
        }) : null}
      </div>

    </div>
  );
};

export default TaskShop;
