import api from '../../services/api';

export const loadTaskItems = async  taskId => {
    const AUTH = sessionStorage.getItem('token');
    try {
      const { data } = await api.get('GTPP/TaskItem.php', { params: { AUTH: AUTH, app_id:3, task_id:taskId } })
      // console.log(data)
      return data;
    } catch (error) {
      return [{}];
    }
  }

  export const changeItemChecked = async  (taskId,itemId,check) => {
    const AUTH = sessionStorage.getItem('token');
    try {
      const { data } = await api.put('GTPP/TaskItem.php?AUTH='+AUTH+'&app_id=3',{"task_id":taskId,"id":itemId,"check":check})
      console.log(data)
      return data;
    } catch (error) {
      return [{}];
    }
  }

  export const loadTask = async (params, order) => {
    const AUTH = sessionStorage.getItem('token');
  
    try {
      const { data } = await api.get('GTPP/Task.php', { params: { AUTH: AUTH, col: 1, order: 'asc', app_id: 3 } });
      // console.log(data)
      return data;
    } catch (error) {
      return [{}];
    }
  }