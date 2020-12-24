import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./style.css";
import api from "../../services/api";

const TaskCompany = ({ task }) => {
  const { permissions } = useSelector((state) => state);
  const dispatch = useDispatch();

  const { tasks } = useSelector((state) => state);
  // const { stateUpdate } = useSelector((state) => state);
  const [companies, setCompanies] = useState([]);

  async function updateCompany() {
    const { data } = await api.get("CCPP/Com_sho_dep_sub.php", {
      params: { AUTH: permissions.session, app_id: 3 },
    });

    setCompanies(data.data);
    // console.log(...companies);
  }

  useEffect(() => {
    updateCompany();
  }, []);

  return (
    <div className="containerCompany">
      <div className="company">
        {companies
          ? companies.map((company) => {
              <React.Fragment>
                {tasks.map((task) => {
                  <>
                    {company.id === task.comshopdepsub_id ? (
                      <h1>{company.company_name}</h1>
                    ) : null}
                  </>;
                })}
              </React.Fragment>;
            })
          : null}
      </div>
    </div>
  );
};

export default TaskCompany;
