import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./style.css";
import { AiOutlineClose } from "react-icons/ai";
import { IoMdSend } from "react-icons/io";
import { getWebSocketState, getWebSocketHistoric } from "../../redux";
import { getMessage } from "./functions";

function WebChat({ close }) {
  useEffect(() => {
    let chat = document.getElementById("chat");
    chat.classList.add("chat");
  }, []);

  const { taskVisible } = useSelector((state) => state);
  const { permissions } = useSelector((state) => state);
  const dispatch = useDispatch();
  const { webSocket } = useSelector((state) => state);
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([]);
  // const {permissions} = useSelector(state => state);
  const AUTH = permissions.session;

  // console.log(websocket.websocket);
  // console.log(webSocket)

  useEffect(() => {
    const mainChat = document.getElementById("mainChat");
    setTimeout(() => {
      setMessages(webSocket.historic);
      mainChat.scrollTop = 100000000;
    }, 500);
  }, [messages]);
  // useEffect(() => {
  //   getMessage(AUTH,250)
  // },[])

  function formatDate(dateFormat) {
    // date of database
    let info = dateFormat.split(" ");
    let date = info[0].split("-");
    let hour = info[1];
    date = date[2] + "/" + date[1] + "/" + date[0];

    //verify if today is same day of database
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();
    today = dd + "/" + mm + "/" + yyyy;

    if (date === today) {
      return hour;
    } else {
      return date;
    }
  }

  function SetMessage(response) {
    const taskId = response.task_id;

    if (taskId != taskVisible.info.task_id) {
      return;
    }

    const output = document.getElementById("mainChat");
    // console.log(response);
    let error = response.error;
    if (error) {
      dispatch(getWebSocketState("error"));
      return;
    }

    let uid = response.user_id;
    let user = response.user_name;
    let message = response.message.description;
    let nowResponse = response.date_time;

    const box = document.createElement("div");
    const author = document.createElement("span");
    const messageArea = document.createElement("span");
    const dateArea = document.createElement("h1");

    dateArea.textContent = formatDate(nowResponse);

    //Para mostrar a mensagem do usuário que enviou marcando em azul
    if (uid == permissions.id) {
      author.textContent = "Eu";
      author.setAttribute("class", "authorRight");
      messageArea.textContent = message;
      dateArea.setAttribute("class", "dateTextRight");
      messageArea.setAttribute("class", "textRight");
      box.setAttribute("class", "boxRight");
    }
    //Para mostrar as mensagens de outro usuários
    else {
      author.textContent = user;
      author.setAttribute("class", "authorLeft");
      messageArea.textContent = message;
      dateArea.setAttribute("class", "dateTextLeft");
      messageArea.setAttribute("class", "textLeft");
      box.setAttribute("class", "boxLeft");
    }

    box.append(author);
    box.append(messageArea);
    box.append(dateArea);
    output.append(box);
    output.scrollTop = 100000000;
  }

  function SendMessage(msg) {
    if (msg !== "" && webSocket.websocketState === "connected") {
      try {
        let jsonString = {
          task_id: taskVisible.info.task_id,
          message: msg,
          date_time: null,
          user_id: permissions.id,
          type: 1,
        };
        webSocket.websocket.send(JSON.stringify(jsonString));

        // console.log(jsonString);

        setMsg("");
      } catch (error) {
        alert(error);
      }
    }
  }

  useEffect(() => {
    // console.log(webSocket)
    if (webSocket.message !== "" && webSocket.message && webSocket.message.type===1) {
      SetMessage(webSocket.message);
    }
  }, [webSocket.message]);

  useEffect(() => {
    if (webSocket.historic) {
      webSocket.historic.map((historic) => {
        historic.task_id = taskVisible.info.task_id;
      });
    }
  }, [webSocket.historic]);

  return (
    <div id="chat">
      {/* <label id="connection"></label> */}
      <div className="headerChat">
        <div
          className="status"
          style={
            webSocket.websocketState === "connected"
              ? { backgroundColor: "green" }
              : webSocket.websocketState === "error"
              ? { backgroundColor: "red" }
              : webSocket.websocketState === "tryload"
              ? { backgroundColor: " yellow" }
              : null
          }
        ></div>
        <div
          onClick={() => {
            close();
            setTimeout(() => {
              document.getElementById("openChat").style.display = "block";
            }, 100);
            dispatch(getWebSocketHistoric([]));
          }}
        >
          <AiOutlineClose size={25} color="red" />
        </div>
      </div>
      <div className="mainChat" id="mainChat" onLoad={() => {}}>
        {messages &&
          messages.map((message) =>
            message.user_id === permissions.id ? (
              <div className="boxRight" key={message.id}>
                <span className="authorRight">Eu</span>
                <h1 className="textRight">{message.description}</h1>
                <span className="dateTextRight">
                  {formatDate(message.date_time)}
                </span>
              </div>
            ) : (
              <div className="boxLeft" key={message.id}>
                <span className="authorLeft">{message.user_name}</span>
                <h1 className="textLeft">{message.description}</h1>
                <span className="dateTextLeft">
                  {formatDate(message.date_time)}
                </span>
              </div>
            )
          )}
      </div>
      <div className="footerChat">
        <div>
          <input
            autoFocus
            type="text"
            id="msg"
            placeholder="Escreva sua mensagem"
            value={msg}
            onKeyPress={(e) => (e.key === "Enter" ? SendMessage(msg) : null)}
            onChange={(e) => setMsg(e.target.value)}
          />
          <button type="button" onClick={() => SendMessage(msg)}>
            <IoMdSend size={50} color="#ccc" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default WebChat;
