import api from '../../services/api';
// import Task from '../Task';


export const loadTask = async (order,auth) => {
  const AUTH = auth;

  try {
    const { data } = await api.get('GTPP/Task.php', { params: { AUTH: AUTH, col: 1, order: order.order, app_id: 3 } });
    // console.log(data)
    return data;
  } catch (error) {
    return [{}];
  }
}

export const loadTaskStates = async auth => {
  const AUTH = auth;
  try {
    const { data } = await api.get('GTPP/TaskState.php', { params: { AUTH: AUTH, app_id:3 } })
    // console.log(data)
    return data;
  } catch (error) {
    return [{}];
  }
}

export const loadUserImages = async (id,auth) => {
  const AUTH = auth
  // console.log("chegou aqui")
  try {
    const  {data}  = await api.get('http://192.168.0.99:71/GLOBAL/Controller/CCPP/EmployeePhoto.php', {params: {"AUTH": AUTH, "id": id, "app_id":3}})
    return data;
  } catch (error) {
    console.log(error)
  }
}

// export const loadUserImages = async params => {
//   const AUTH = params.session

//   try {
//     const { data } = await api.get('http://192.168.0.99:71/GLOBAL/Controller/EmployeePhoto.php', {params: {"AUTH": AUTH, "all": 1, "app_id":3}})
//     return data;
//   } catch (error) {
//     console.log(error)
//   }
// }


export const loadCompanies = async (auth) => {
  const AUTH = auth;

  try{
      const {data} = await api.get('CCPP/Company.php',{params:{AUTH:AUTH, app_id:3}});
       //console.log(data);
      return data;
  }catch(error){
      return [{}];
  }
}

export const loadShop = async (auth) => {
  const AUTH = auth;

  try{
      const {data} = await api.get('CCPP/Shop.php',{params:{AUTH:AUTH, app_id:3}});
      // console.log(data);
      return data;
  }catch(error){
      return [{}];
  }
}

export const loadDept = async (auth) => {
  const AUTH = auth;

  try{
      const {data} = await api.get('CCPP/Department.php',{params:{AUTH:AUTH, app_id:3}});
      // console.log(data);
      return data;
  }catch(error){
      return [{}];
  }
}



