import api from '../../services/api';
// import Task from '../Task';

export const loadTask = async (params, order) => {
  const AUTH = sessionStorage.getItem('token');

  try {
    const { data } = await api.get('GTPP/Task.php', { params: { AUTH: AUTH, col: 1, order: order.order, app_id: 3 } });
    // console.log(data)
    return data;
  } catch (error) {
    return [{}];
  }
}

export const loadTaskStates = async params => {
  const AUTH = sessionStorage.getItem('token');
  try {
    const { data } = await api.get('GTPP/TaskState.php', { params: { AUTH: AUTH, app_id:3 } })
    // console.log(data)
    return data;
  } catch (error) {
    return [{}];
  }
}

export const loadUserImages = async params => {
  const AUTH = params.session

  try {
    const { data } = await api.get('http://192.168.0.99:71/GLOBAL/Controller/EmployeePhoto.php', {params: {"AUTH": AUTH, "all": 1, "app_id":3}})
    return data;
  } catch (error) {
    console.log(error)
  }
}

export const loadCompanies = async () => {
  const AUTH = sessionStorage.getItem('token');

  try{
      const {data} = await api.get('Company.php',{params:{AUTH:AUTH, app_id:3}});
       //console.log(data);
      return data;
  }catch(error){
      return [{}];
  }
}

export const loadShop = async () => {
  const AUTH = sessionStorage.getItem('token');

  try{
      const {data} = await api.get('Shop.php',{params:{AUTH:AUTH, app_id:3}});
      // console.log(data);
      return data;
  }catch(error){
      return [{}];
  }
}

