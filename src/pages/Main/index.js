import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getWebSocketState, getWebSocket } from '../../redux';
import Header from '../../components/Header/index';
import TaskTable from '../../components/TaskTable';
import { getWebSocketMessage } from '../../redux/webSocket/webSocketActions';
import './style.css';

function Main() {
  const dispatch = useDispatch();
  const { permissions } = useSelector((state) => state);
  const AUTH = permissions.session;

  useEffect(() => {
    dispatch(getWebSocketState('error'));
  }, []);
  let socket;

  function Connect() {
    let token = localStorage.getItem('token');
    if (token && token !== undefined && permissions && permissions.id) {
      socket = new WebSocket('ws://192.168.0.99:3333');

      let isConnected = false;
      let time_out;

      function Ping() {
        if (!isConnected) {
          return;
        }
        socket.send('__ping__');
        time_out = setTimeout(function () {
          dispatch(getWebSocketState('error'));
        }, 5000);
      }

      //Pong para cancel o TimeOut que estava aguardando no Ping
      function Pong() {
        clearTimeout(time_out);
        dispatch(getWebSocketState('connected'));
      }
      try {
        socket.onopen = function () {
          //Autenticar o usuário
          let jsonString = {
            auth: AUTH,
            app_id: 3,
          };
          dispatch(getWebSocketState('connected'));
          dispatch(getWebSocket(socket));
          socket.send(JSON.stringify(jsonString));

          //Enviar um ping para o servidor a cada 10 segundos
          setInterval(Ping, 10000);
          isConnected = true;
        };

        socket.onerror = function (ev) {
          dispatch(getWebSocketState('tryload'));
        };

        socket.onclose = function () {
          dispatch(getWebSocketState('error'));
          dispatch(getWebSocket({}));
          //Tentar reconectar o WebSocket a cada 1 segundo
          setTimeout(function () {
            Connect();
          }, 1000);
          isConnected = false;
        };

        socket.onmessage = function (ev) {
          //Ao receber o pong do servidor, cancela o TimeOut
          if (ev.data.toString() === '__pong__') {
            Pong();
            return;
          }
          let response = JSON.parse(ev.data);

          dispatch(getWebSocketMessage(response));
          //Ao receber mensagem que não seja pong
        };
      } catch (error) {
        // connection.innerText = error;
      }
    }
  }

  useEffect(() => {
    Connect();
  }, []);

  return (
    <div className="main">
      <Header />
      <TaskTable websocket={socket} />
    </div>
  );
}

export default Main;
