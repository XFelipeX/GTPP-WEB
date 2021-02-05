import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getWebSocketState, getWebSocket } from "../../redux";
import Header from "../../components/Header/index";
import TaskTable from "../../components/TaskTable";
import { getWebSocketMessage } from "../../redux/webSocket/webSocketActions";
import api from "../../services/api";
// import socket from "../../utils/socketConfig";

function Main() {
  const dispatch = useDispatch();
  const { permissions } = useSelector((state) => state);
  const { webSocket } = useSelector((state) => state);
  // const [token,setToken] = useState(sessionStorage.getItem("token"));
  const AUTH = permissions.session;

 
  useEffect(() => {
    dispatch(getWebSocketState("error"));
  }, []);
  let socket;
  let token;

  React.useMemo(() => {
    token = sessionStorage.getItem("token");
  },[])

  // useEffect(() => {
  //   setToken(sessionStorage.getItem("token"));
  // },[])

  function Connect() {
    // console.log("nova conexão criada");

    // console.log(token);
    
    // setToken(sessionStorage.getItem("token"));
    if (token && token !== undefined) {
      socket = new WebSocket("ws://192.168.0.99:3333");

      let isConnected = false;
      let time_out;

      function Ping() {
        if (!isConnected) {
          return;
        }
        socket.send("__ping__");
        time_out = setTimeout(function () {
          dispatch(getWebSocketState("error"));
        }, 5000);
      }

      //Pong para cancel o TimeOut que estava aguardando no Ping
      function Pong() {
        clearTimeout(time_out);
        dispatch(getWebSocketState("connected"));
      }
      try {
        socket.onopen = function () {
          //Autenticar o usuário
          // console.log("conexão aberta");
          let jsonString = {
            auth: AUTH,
            app_id: 3,
          };
          dispatch(getWebSocketState("connected"));
          dispatch(getWebSocket(socket));
          socket.send(JSON.stringify(jsonString));

          //Enviar um ping para o servidor a cada 10 segundos
          setInterval(Ping, 10000);
          isConnected = true;
        };

        socket.onerror = function (ev) {
          // console.log(ev.data);
          dispatch(getWebSocketState("tryload"));
        };

        socket.onclose = function () {
          dispatch(getWebSocketState("error"));
          dispatch(getWebSocket({}));
          //Tentar reconectar o WebSocket a cada 1 segundo
          setTimeout(function () {
            Connect();
          }, 1000);
          isConnected = false;
        };

        socket.onmessage = function (ev) {
          //Ao receber o pong do servidor, cancela o TimeOut
          if (ev.data.toString() === "__pong__") {
            Pong();
            return;
          }
          let response = JSON.parse(ev.data);

          dispatch(getWebSocketMessage(response));
          // console.log(response);
          //Ao receber mensagem que não seja pong
        };
      } catch (error) {
        // connection.innerText = error;
      }
    }
  }

  // useEffect(() => {
  //   SendMessage();
  // },[]);

  // useEffect(() => {
  //   async function getNotifications() {
  //     try {
  //       const {data} = await api.get("GTPP/Notify.php?AUTH="+AUTH+"&app_id=3&"+"user_id="+permissions.id);

  //       console.log(data);
  //     } catch (error) {
  //       alert(error);
  //     }
  //   }

  //   getNotifications();
  // },[])

  useEffect(() => {
    Connect();
  }, []);
  

  return (
    <div>
      <Header />
      <TaskTable websocket={socket} />
    </div>
  );
}

export default Main;
