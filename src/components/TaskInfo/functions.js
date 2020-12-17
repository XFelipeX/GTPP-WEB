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

    console.log(data);
  } catch (error) {
    let msg = String(error.response.data.message);
    // console.log(error.response.data.message);
    if(msg.includes("Only the task creator or administrator can do this")){
      alert("Somente o criador da tarefa ou administrador pode fazer isto!");
    }else if(msg.includes("The full description cannot be empty")){
      alert("A descrição completa não pode estar vazia!");
    }
  }
};

export const updateCheckDept = async (taskId, deptId, shopId, companyId) => {
  const AUTH = sessionStorage.getItem("token");
  // console.log(taskId,deptId,shopId,companyId);
  try {
    const data = await api.post(
      "GTPP/TaskComShoDepSub.php?AUTH=" + AUTH + "&app_id=3",
      {
        task_id: taskId,
        company_id: companyId,
        shop_id: shopId,
        depart_id: deptId,
      }
    );

    console.log(data);
    return data;
  } catch (error) {
    let msg = String(error.response.data.message);
    // console.log(error.response.data.message);
    if(msg.includes("Task with this state cannot be modified")){
      alert("Tarefa com este estado não pode ser modificada!");
    }else if(msg.includes("Only the task creator or administrator can do this")){
      alert("Somente o criador da tarefa ou administrador pode fazer isto!");
    }
    return null;
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
    const {data} = await api
      .put(`GTPP/TaskState.php?AUTH=${AUTH}&app_id=3`, {
        task_id: idTask,
        reason:reason,
        days:days
      })
      .then((response) => {
        // console.log(response)
        return response;
      });

    console.log(data.data[0]);
    return data.data[0];
  } catch (error) {
    let msg = String(error.response.data.message);
    // console.log(error.response.data.message);
    if(msg.includes("This user can not do this")){
      alert("Somente o criador da tarefa ou administrador pode fazer isto!");
    }else if(msg.includes("Days cannot be negative")){
      alert("A quantidade de dias não pode ser negativa!");
    }
  }
}

export const cancelStateTask = async (idTask,reason) => {
  const AUTH = sessionStorage.getItem("token");
  try {
    const {data} = await api
      .put(`GTPP/TaskState.php?AUTH=${AUTH}&app_id=3`, {
        task_id: idTask,
        reason:reason,
        cancel:1

      })
      .then((response) => {
        // console.log(response)
       
        return response;
      });

    console.log(data);
    return data.data[0];
  } catch (error) {
    let msg = String(error.response.data.message);
    console.log(error.response.data.message);
    if(msg.includes("This user can not do this")){
      alert("Somente o criador da tarefa ou administrador pode fazer isto!");
    } else if(msg.includes("This state can not modified")){
      alert("Este estado não pode ser cancelado!")
    }
  }
}


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
