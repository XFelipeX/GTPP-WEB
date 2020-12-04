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
    console.log(error.message);
  }
};

export const updateCheckDept = async (taskId,deptId,shopId,companyId) => {
  const AUTH = sessionStorage.getItem("token");
  // console.log(taskId,deptId,shopId,companyId);
  try{
    const data = await api.post('GTPP/TaskCompany.php?AUTH='+AUTH+'&app_id=3',{
      task_id:taskId,
      company_id:companyId,
      shop_id:shopId,
      depart_id:deptId
    });

    // console.log(data);
    return data
  }catch(error){
    console.log(error.message)
    return [{}];
  }
}

export const loadShopsCompany = async (idCompany) => {
  const AUTH = sessionStorage.getItem("token");

  try {
    const {data} = await api.get('Shop.php?AUTH='+AUTH+'&app_id=3&company_id='+idCompany);

    // console.log(data);
    return data;
  } catch (error) {
    console.log(error.message)
    return [{}];
  }
}


export const loadDeptsCompany = async (idCompany,idShop,idTask) => {
  const AUTH = sessionStorage.getItem("token");

  try {
    const {data} = await api.get('Departament.php?AUTH='+AUTH+'&app_id=3&company_id='+idCompany+"&shop_id="+idShop+"&task_id="+idTask);

    // console.log(data.data);
    return data.data;
  } catch (error) {
    console.log(error.message)
    return [{}];
  }
}

export function formatDate(props) {
    const date = new Date(props)
    var day = date.getDate();
    day++
    if(day < 10){
      day = "0" + day
    }
    var month = date.getMonth();
    month++
    if(month < 10){
      month = "0" + month
    }
    var year = date.getFullYear();
    return day +  "/" + month + "/" + year;
  }
