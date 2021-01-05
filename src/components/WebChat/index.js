import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./style.css";

function WebChat() {
  useEffect(() => {
    let chat = document.getElementById("chat");
    chat.classList.add("chat");
  }, []);

  const { taskVisible } = useSelector((state) => state);
  const { permissions } = useSelector((state) => state);

  //Para mostrar as mensagens recebidas
//   const output = document.querySelector("output");

//   //Constantes que devem ser obtidas pelo login
//   const task_id = taskVisible.info.task_id;
//   const user_id = permissions.id;
//   const auth = permissions.session;

//   const text_box_message = document.getElementById("message");
//   const button_send = document.getElementById("send");

//   //Display de conexão
//   const connection = document.getElementById("connection");
//   console.log(connection)
//   const status = document.getElementById("status");
// //   connection.style.color = "yellow";
//   status.style.background = "yellow";
//   let isConnected = false;

//   const ip = document.getElementById("ip");
//   ip.innerText = "External";

//   //Para instanciar o WebSocket
//   let ws;
//   //TimeOut para verificar se a conexão está OK
//   let time_out;

//   //Envio da mensagem por 'enter' ou pelo botão de enviar
//   text_box_message.addEventListener("keypress", (e) => {
//     if (e.key === "Enter") {
//       if (Verify()) {
//         SendMessage();
//       }
//     }
//   });
//   button_send.onclick = function () {
//     if (Verify()) {
//       SendMessage();
//     }
//   };

//   //Para criar todas as dependencias do WebSocket e conectar
//   function Connect() {
//     try {
//       ws = new WebSocket("ws://192.168.0.99:3333");
//       //ws = new WebSocket('ws://187.35.128.157:3333');

//       ws.onopen = function () {
//         connection.innerText = "Connectado";
//         connection.style.color = "green";
//         status.style.background = "green";

//         //Autenticar o usuário
//         let jsonString = {
//           auth: auth,
//           app_id: 1,
//         };
//         ws.send(JSON.stringify(jsonString));

//         //Enviar um ping para o servidor a cada 10 segundos
//         setInterval(Ping, 10000);
//         isConnected = true;
//       };

//       ws.onerror = function (ev) {
//         connection.innerText = "Erro: " + ev.data;
//         connection.style.color = "yellow";

//         status.style.background = "yellow";
//       };

//       ws.onclose = function () {
//         connection.innerText = "Desconectado";
//         connection.style.color = "red";

//         status.style.background = "red";

//         //Tentar reconectar o WebSocket a cada 1 segundo
//         setTimeout(function () {
//           Connect();
//         }, 1000);
//         isConnected = false;
//       };

//       ws.onmessage = function (ev) {
//         //Ao receber o pong do servidor, cancela o TimeOut
//         if (ev.data.toString() === "__pong__") {
//           Pong();
//           return;
//         }
//         let response = JSON.parse(ev.data);

//         //Ao receber mensagem que não seja pong
//         SetMessage(response);
//       };
//     } catch (error) {
//       connection.innerText = error;
//     }
//   }
//   Connect();

//   //Formatar JSON e enviar mensagem
//   function SendMessage() {
//     try {
//       let jsonString = {
//         task_id: task_id.value,
//         message: text_box_message.value,
//         date_time: null,
//       };
//       ws.send(JSON.stringify(jsonString));

//       text_box_message.value = "";
//     } catch (error) {
//       alert(error);
//     }
//   }

//   //Verificar campos obrigatórios
//   function Verify() {
//     if (task_id.value === "") {
//       alert("Insira o ID da tarefa");
//       return false;
//     }
//     if (text_box_message.value === "") {
//       alert("Insira uma mensagem");
//       return false;
//     }
//     return true;
//   }

//   //Inserir no output as mensagens recebidas
//   function SetMessage(response) {
//     let error = response.error;
//     if (error) {
//       connection.innerText = response.message;
//       connection.style.color = "yellow";

//       status.style.background = "yellow";
//       return;
//     }
//     connection.innerText = "Conectado";
//     connection.style.color = "green";

//     status.style.background = "green";

//     let uid = response.user_id;
//     let user = response.user_name;
//     let message = response.message;
//     let date = response.date_time;

//     const div1 = document.createElement("div");
//     const div2 = document.createElement("div");
//     const div3 = document.createElement("div");

//     div1.style.color = "#ffffff";
//     div2.style.color = "#ffffff";
//     div2.textContent = date;

//     //Para mostrar a mensagem do usuário que enviou marcando em azul
//     if (user_id === uid) {
//       div1.textContent = "Eu : " + message;
//       div1.style.backgroundColor = "#0c71e0";
//       div2.style.backgroundColor = "#0c71e0";
//     }
//     //Para mostrar as mensagens de outro usuários
//     else {
//       div1.textContent = user + ": " + message;
//       div1.style.backgroundColor = "#333333";
//       div2.style.backgroundColor = "#333333";
//     }

//     div3.textContent = "space here";
//     div3.style.color = "#111111";

//     output.append(div1);
//     output.append(div2);
//     output.append(div3);
//   }

//   //Ping do TimeOut que aguarda 5 segundos antes de mostrar a falta de conexão
//   function Ping() {
//     if (!isConnected) {
//       return;
//     }
//     ws.send("__ping__");
//     time_out = setTimeout(function () {
//       connection.innerText = "Sem conexão";
//       connection.style.color = "red";

//       status.style.background = "red";
//     }, 5000);
//   }

//   //Pong para cancel o TimeOut que estava aguardando no Ping
//   function Pong() {
//     clearTimeout(time_out);
//   }

  return (
    <div id="chat">
     {/* <label id="connection"></label> */}
      <div className="headerChat">
        {" "}
        {/* <canvas
          id="status"
          width="20"
          height="20"
          style="border:1px solid"
        ></canvas> */}
       
      </div>
      <div className="mainChat">
        <output></output>
      </div>
      <div className="footerChat">
        <div>
          <input type="text" />
        </div>
        <div>
          <button type="button">Enviar</button>
        </div>
      </div>
    </div>
  );
}

export default WebChat;
