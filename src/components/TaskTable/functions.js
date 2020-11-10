import api from '../../services/api';
// import Task from '../Task';

export const loadTask = async (params, order) => {
  const AUTH = sessionStorage.getItem('token');

  try {
    const { data } = await api.get('Task.php', { params: { AUTH: AUTH, col: order.col, order: order.order } });
    console.log(data)
    return data;
  } catch (error) {
    return [{}];
  }
}

export const loadTaskStates = async params => {
  const AUTH = params.session

  try {
    const { data } = await api.get('TaskState.php', { params: { AUTH: AUTH } })
    return data;
  } catch (error) {
    return [{}];
  }
}

export const loadUserImages = async params => {
  const AUTH = params.session

  try {
    const { data } = await api.get('http://192.168.0.99:71/GLOBAL/Controller/EmployeePhoto.php', {params: {"AUTH": AUTH, "all": 1}})
    return data;
  } catch (error) {
    console.log(error)
  }
}

