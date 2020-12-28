import api from "../../services/api";

export const updateFullDescription = async (taskId, description,auth) => {
  const AUTH = auth;

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
    let msg = String(error.response.data.message);
    // console.log(error.response.data.message);
    if(msg.includes("Only the task creator or administrator can do this")){
      alert("Somente o criador da tarefa ou administrador pode fazer isto!");
    }else if(msg.includes("The full description cannot be empty")){
      alert("A descrição completa não pode estar vazia!");
    }else if(msg.includes("Task with this state cannot be modified")){
      alert("Tarefa neste estado não pode ser modificada!")
    }
  }
};



export const updateCheckDept = async (taskId, deptId, shopId, companyId,auth) => {
  const AUTH = auth;
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

    // console.log(data);
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

export const loadShopsCompany = async (idCompany,auth) => {
  const AUTH = auth;

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

export const loadDeptsCompany = async (idCompany, idShop, idTask,auth) => {
  const AUTH = auth;

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

export const updateStateTask = async (idTask,reason,days,auth) => {
  const AUTH = auth;

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

    // console.log(data);
    return data.data;
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

export const cancelStateTask = async (idTask,reason,auth) => {
  const AUTH = auth;
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

    // console.log(data);
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
  var month = date.getMonth();
  day++;
  if (day < 10) {
    day = "0" + day;
  }else if(day==32){
    day = "0"+1;
    if(month<12){
    month++;}else{
      month = 0;
    }
  }
  
  if(month<12){
    month++;}
  if (month < 10) {
    month = "0" + month;
  }
  var year = date.getFullYear();
  return day + "/" + month + "/" + year;
}
