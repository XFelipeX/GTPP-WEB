import api from "../../services/api";

export const updateDescription = async (taskId, description) => {
  const AUTH = sessionStorage.getItem("token");

  try {
    const data = await api
      .put(`GTPP/Task.php?AUTH=${AUTH}&app_id=3`, {
        id: taskId,
        full_description: description,
      })
      .then((response) => {
        return response;
      });

    // console.log(data);
  } catch (error) {
    let msg = String(error.message);
    // console.log(msg);
    if(msg.includes("Request failed with status code 403")){
      alert("Somente o criador da tarefa ou administrador pode fazer isto!");
    }
  }
};

export const updateCheckDept = async (taskId, deptId, shopId, companyId) => {
  const AUTH = sessionStorage.getItem("token");
  // console.log(taskId,deptId,shopId,companyId);
  try {
    const data = await api.post(
      "GTPP/TaskCompany.php?AUTH=" + AUTH + "&app_id=3",
      {
        task_id: taskId,
        company_id: companyId,
        shop_id: shopId,
        depart_id: deptId,
      }
    );

    // console.log(data);
    return data;
  } catch (error) {
    console.log(error.message);
    return [{}];
  }
};

export const loadShopsCompany = async (idCompany) => {
  const AUTH = sessionStorage.getItem("token");

  try {
    const { data } = await api.get(
      "CCPP/Shop.php?AUTH=" + AUTH + "&app_id=3&company_id=" + idCompany
    );

    // console.log(data);
    return data;
  } catch (error) {
    console.log(error.message);
    return [{}];
  }
};

export const loadDeptsCompany = async (idCompany, idShop, idTask) => {
  const AUTH = sessionStorage.getItem("token");

  try {
    const { data } = await api.get(
      "CCPP/Department.php?AUTH=" +
        AUTH +
        "&app_id=3&company_id=" +
        idCompany +
        "&shop_id=" +
        idShop +
        "&task_id=" +
        idTask
    );

    // console.log(data.data);
    return data.data;
  } catch (error) {
    console.log(error.message);
    return [{}];
  }
};

export const updateStateTask = async (idTask,reason,days) => {
  const AUTH = sessionStorage.getItem("token");

  try {
    const data = await api
      .put(`GTPP/_TaskState.php?AUTH=${AUTH}&app_id=3`, {
        task_id: idTask,
        reason:reason,
        days:days
      })
      .then((response) => {
        // console.log(response)
        return response;
      });

    // console.log(data.data);
    return data.data;
  } catch (error) {
    let msg = String(error.message);
    // console.log(msg);
    if(msg.includes("Request failed with status code 403")){
      alert("Somente o criador da tarefa ou administrador pode fazer isto!");
    }
  }
}

export const cancelStateTask = async (idTask,reason) => {
  const AUTH = sessionStorage.getItem("token");


  
  try {
    const data = await api
      .put(`GTPP/_TaskState.php?AUTH=${AUTH}&app_id=3`, {
        task_id: idTask,
        reason:reason,
        cancel:1
      })
      .then((response) => {
         console.log(response)
        debugger
       
        return response;
      });

    console.log(data.data);
    return data.data;
  } catch (error) {
    let msg = String(error.message);
    // console.log(msg);
    if(msg.includes("Request failed with status code 403")){
      alert("Somente o criador da tarefa ou administrador pode fazer isto!");
    }
  }
}

// export const updateStateTask = async (idTask, days, reason) => {
//   const AUTH = sessionStorage.getItem("token");

//   try {
//     let data = {};
//     (async () => {
//       data = await fetch(
//         "http://192.168.0.99:71/GLOBAL/Controller/GTPP/_TaskState.php?AUTH="+AUTH+"&app_id=3",
//         {
//           method: "PUT",
//           body: JSON.stringify({
//             task_id: idTask,
//           })
//         }
//       )
//         .then((response) => {
//           console.log(response)
//           return response.json();
//         })
//         .then((r) => {
//           return r;
//         })
//         .catch((err) => {
//           console.log(err+"aqui");
//         });

    
//       console.log(data);
//     })();
//   } catch (error) {
//     console.log(error);
//   }
// };

export function formatDate(props) {
  const date = new Date(props);
  var day = date.getDate();
  day++;
  if (day < 10) {
    day = "0" + day;
  }
  var month = date.getMonth();
  month++;
  if (month < 10) {
    month = "0" + month;
  }
  var year = date.getFullYear();
  return day + "/" + month + "/" + year;
}
