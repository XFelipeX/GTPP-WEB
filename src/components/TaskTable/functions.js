import api from "../../services/api";
// import Task from '../Task';

export const loadTask = async (order, auth) => {
  const AUTH = auth;

  try {
    const { data } = await api.get("GTPP/Task.php", {
      params: { AUTH: AUTH, col: 1, order: "asc", app_id: 3 },
    });
    // console.log(data)
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
    // console.log(data)
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
    //console.log(data);
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
    // console.log(data);
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
    // console.log(data);
    return data;
  } catch (error) {
    return [{}];
  }
};

// export function Connect(auth) {
//   let connection;
//   let ws;
//   let isConnected = false;
//   let time_out;

//   function Ping() {
//     if (!isConnected) {
//       return;
//     }
//     ws.send("__ping__");
//     time_out = setTimeout(function () {
//       // connection.innerText = "Sem conexão";
//       // connection.style.color = "red";
//       // status.style.background = "red";
//     }, 5000);
//   }

//   //Pong para cancel o TimeOut que estava aguardando no Ping
//   function Pong() {
//     clearTimeout(time_out);
//   }
//   try {
//     ws = new WebSocket("ws://192.168.0.99:3333");
//     //ws = new WebSocket('ws://187.35.128.157:3333');

//     ws.onopen = function () {
//       // connection.innerText = "Connectado";
//       // connection.style.color = "green";
//       // status.style.background = "green";

//       //Autenticar o usuário
//       // console.log('conexão aberta')
//       connection = "conexão aberta";
//       let jsonString = {
//         auth: auth,
//         app_id: 3,
//       };
//       ws.send(JSON.stringify(jsonString));

//       //Enviar um ping para o servidor a cada 10 segundos
//       setInterval(Ping, 10000);
//       isConnected = true;
//     };

//     ws.onerror = function (ev) {
//       // connection.innerText = "Erro: " + ev.data;
//       // connection.style.color = "yellow";
//       // status.style.background = "yellow";
//       // console.log('error')
//       connection = "erro de conexão";
//     };

//     ws.onclose = function () {
//       // connection.innerText = "Desconectado";
//       // connection.style.color = "red";

//       // status.style.background = "red";

//       // console.log('conexão fechada')
//       connection = "conexão fechada";

//       //Tentar reconectar o WebSocket a cada 1 segundo
//       setTimeout(function () {
//         Connect();
//       }, 1000);
//       // isConnected = false;
//     };

//     ws.onmessage = function (ev) {
//       //Ao receber o pong do servidor, cancela o TimeOut
//       if (ev.data.toString() === "__pong__") {
//         Pong();
//         return;
//       }
//       let response = JSON.parse(ev.data);

//       //Ao receber mensagem que não seja pong
//       // SetMessage(response);
//     };

    
//   } catch (error) {
//     // connection.innerText = error;
    
//   }
// }
