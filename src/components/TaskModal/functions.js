import api from '../../services/api';

export const updateDescription = async (taskId, description, priority) => {
    const AUTH = sessionStorage.getItem("token");
  
    try {
      const data = await api.put(`GTPP/Task.php?AUTH=${AUTH}&app_id=3`, {
        id: taskId,
        description: description,
        priority:priority
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
  }