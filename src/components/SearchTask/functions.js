import api from '../../services/api';
import { showNotification } from '../../Utils/Notify';

export const searchByDescription = async (auth, page, description, adm) => {
  try {
    const { data } = await api.get('GTPP/_Task.php', {
      params: {
        AUTH: auth,
        app_id: 3,
        page: page,
        rows: 15,
        search: 1,
        description: description,
        administrator: adm === true ? 1 : 0,
      },
    });

    if (data.error === true) {
      // let msg = data.message;

      if (!data.data.length) {
        showNotification('Aviso', 'Nenhuma tarefa foi encontrada', 'warning');
      }
    }
    return data;
  } catch (error) {
    return [{}];
  }
};

export const searchByEmployee = async (auth, page, description, adm) => {
  try {
    const { data } = await api.get('GTPP/_Task.php', {
      params: {
        AUTH: auth,
        app_id: 3,
        page: page,
        rows: 15,
        search: 2,
        description: description,
        administrator: adm === true ? 1 : 0,
      },
    });

    if (data.error === true) {
      if (!data.data.length) {
        showNotification('Aviso', 'Nenhuma tarefa foi encontrada', 'warning');
      }
    }
    return data;
  } catch (error) {
    return [{}];
  }
};
