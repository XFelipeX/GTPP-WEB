import api from "../../services/api";
import { store } from "react-notifications-component";
// import Task from '../Task';


export function showNotification(title, message, type) {
  store.addNotification({
    title: title,
    message: message,
    type: type,
    container: "top-center",
    insert: "top",
    animationIn: ["animate__animated animate__fadeIn"],
    animationOut: ["animate__animated animate__fadeOut"],
    dismiss: {
      duration: 2000,
    },
    width: 400,
  });
}

export const loadTask = async (order, auth) => {
  const AUTH = auth;

  try {
    const { data } = await api.get("GTPP/Task.php", {
      params: { AUTH: AUTH, col: 1, order: "asc", app_id: 3 },
    });

    if(data.error===true){
      let msg = data.message;

      if(msg.includes('No data')){
        showNotification('Aviso','Você ainda não possui tarefas','warning');
      }else if(msg.includes('Authorization denied')){
        showNotification('Erro','Autorização negada','danger');
      }
      
      else{
        showNotification('Erro',msg,'danger');
      }
    }
    return data;
  } catch (error) {
    return [{}];
  }
};

export const loadTaskStates = async (auth) => {
  const AUTH = auth;
  try {
    const { data } = await api.get("GTPP/TaskState.php", {
      params: { AUTH: AUTH, app_id: 3 },
    });
    if(data.error===true){
      let msg = data.message;

      if(msg.includes('No data')){
        showNotification('Aviso','Você ainda não possui tarefas','warning');
      }else if(msg.includes('Authorization denied')){
        showNotification('Erro','Autorização negada','danger');
      }
      
      else{
        showNotification('Erro',msg,'danger');
      }
    }
    return data;
  } catch (error) {
    return [{}];
  }
};

export const loadUserImages = async (id, auth) => {
  const AUTH = auth;
  // console.log("chegou aqui")
  try {
    const {
      data,
    } = await api.get(
      "http://192.168.0.99:71/GLOBAL/Controller/CCPP/EmployeePhoto.php",
      { params: { AUTH: AUTH, id: id, app_id: 3 } }
    );

    if(data.error===true){
      let msg = data.message;

      if(msg.includes('No data')){
        showNotification('Aviso','Você ainda não possui tarefas','warning');
      }else if(msg.includes('Authorization denied')){
        showNotification('Erro','Autorização negada','danger');
      }
      
      else{
        showNotification('Erro',msg,'danger');
      }
    }
    return data;
  } catch (error) {
    console.log(error);
  }
};

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

  try {
    const { data } = await api.get("CCPP/Company.php", {
      params: { AUTH: AUTH, app_id: 3 },
    });
    if(data.error===true){
      let msg = data.message;

      if(msg.includes('No data')){
        showNotification('Aviso','Você ainda não possui tarefas','warning');
      }else if(msg.includes('Authorization denied')){
        showNotification('Erro','Autorização negada','danger');
      }
      
      else{
        showNotification('Erro',msg,'danger');
      }
    };
    return data;
  } catch (error) {
    return [{}];
  }
};

export const loadShop = async (auth) => {
  const AUTH = auth;

  try {
    const { data } = await api.get("CCPP/Shop.php", {
      params: { AUTH: AUTH, app_id: 3 },
    });
    if(data.error===true){
      let msg = data.message;

      if(msg.includes('No data')){
        showNotification('Aviso','Você ainda não possui tarefas','warning');
      }else if(msg.includes('Authorization denied')){
        showNotification('Erro','Autorização negada','danger');
      }
      
      else{
        showNotification('Erro',msg,'danger');
      }
    }
    return data;
  } catch (error) {
    return [{}];
  }
};

export const loadDept = async (auth) => {
  const AUTH = auth;

  try {
    const { data } = await api.get("CCPP/Department.php", {
      params: { AUTH: AUTH, app_id: 3 },
    });
    if(data.error===true){
      let msg = data.message;

      if(msg.includes('No data')){
        showNotification('Aviso','Você ainda não possui tarefas','warning');
      }else if(msg.includes('Authorization denied')){
        showNotification('Erro','Autorização negada','danger');
      }
      
      else{
        showNotification('Erro',msg,'danger');
      }
    }
    return data;
  } catch (error) {
    return [{}];
  }
};

