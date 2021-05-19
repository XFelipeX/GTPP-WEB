import api from '../../services/api';
import { showNotification } from '../../Utils/Notify';

export const loadTask = async (order, auth, page) => {
  const AUTH = auth;

  try {
    const { data } = await api.get('GTPP/_Task.php', {
      params: { AUTH: AUTH, app_id: 3, page: page, rows: 15 },
    });

    if (data.error === true) {
      let msg = data.message;

      if (msg.includes('No data')) {
        showNotification('Aviso', 'Você ainda não possui tarefas', 'warning');
      } else if (msg.includes('Authorization denied')) {
        showNotification('Erro', 'Autorização negada', 'danger');
      } else {
        showNotification('Erro', msg, 'danger');
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
    const { data } = await api.get('GTPP/TaskState.php', {
      params: { AUTH: AUTH, app_id: 3 },
    });
    if (data.error === true) {
      let msg = data.message;

      if (msg.includes('No data')) {
        showNotification('Aviso', 'Você ainda não possui tarefas', 'warning');
      } else if (msg.includes('Authorization denied')) {
        showNotification('Erro', 'Autorização negada', 'danger');
      } else {
        showNotification('Erro', msg, 'danger');
      }
    }
    return data;
  } catch (error) {
    return [{}];
  }
};

export const loadUserImages = async (id, auth) => {
  const AUTH = auth;
  try {
    const { data } = await api.get(
      'http://192.168.0.99:71/GLOBAL/Controller/CCPP/EmployeePhoto.php',
      { params: { AUTH: AUTH, id: id, app_id: 3 } },
    );

    if (data.error === true) {
      let msg = data.message;

      if (msg.includes('No data')) {
        showNotification('Aviso', 'Você ainda não possui tarefas', 'warning');
      } else if (msg.includes('Authorization denied')) {
        showNotification('Erro', 'Autorização negada', 'danger');
      } else {
        showNotification('Erro', msg, 'danger');
      }
    }
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const loadCompanies = async (auth) => {
  const AUTH = auth;

  try {
    const { data } = await api.get('CCPP/Company.php', {
      params: { AUTH: AUTH, app_id: 3 },
    });
    if (data.error === true) {
      let msg = data.message;

      if (msg.includes('No data')) {
        showNotification('Aviso', 'Você ainda não possui tarefas', 'warning');
      } else if (msg.includes('Authorization denied')) {
        showNotification('Erro', 'Autorização negada', 'danger');
      } else {
        showNotification('Erro', msg, 'danger');
      }
    }
    return data;
  } catch (error) {
    return [{}];
  }
};

export const loadShop = async (auth) => {
  const AUTH = auth;

  try {
    const { data } = await api.get('CCPP/Shop.php', {
      params: { AUTH: AUTH, app_id: 3 },
    });
    if (data.error === true) {
      let msg = data.message;

      if (msg.includes('No data')) {
        showNotification('Aviso', 'Você ainda não possui tarefas', 'warning');
      } else if (msg.includes('Authorization denied')) {
        showNotification('Erro', 'Autorização negada', 'danger');
      } else {
        showNotification('Erro', msg, 'danger');
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
    const { data } = await api.get('CCPP/Department.php', {
      params: { AUTH: AUTH, app_id: 3 },
    });
    if (data.error === true) {
      let msg = data.message;

      if (msg.includes('No data')) {
        showNotification('Aviso', 'Você ainda não possui tarefas', 'warning');
      } else if (msg.includes('Authorization denied')) {
        showNotification('Erro', 'Autorização negada', 'danger');
      } else {
        showNotification('Erro', msg, 'danger');
      }
    }
    return data;
  } catch (error) {
    return [{}];
  }
};

export const loadNotifications = async (auth) => {
  const AUTH = auth;

  try {
    const { data } = await api.get(`GTPP/Notify.php?AUTH=${AUTH}&app_id=3`);
    if (data.error === true) {
      let msg = data.message;
      if (msg.includes('No data')) {
      } else {
        showNotification('Erro', msg, 'danger');
      }

      return [];
    } else {
      return data.data;
    }
  } catch (error) {
    showNotification('Erro', String(error.message), 'danger');
    return [];
  }
};
