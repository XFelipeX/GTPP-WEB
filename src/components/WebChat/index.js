import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./style.css";
import { AiOutlineClose } from "react-icons/ai";
import { IoMdSend } from "react-icons/io";
import { getWebSocketState, getWebSocketHistoric } from "../../redux";
import { createMessage, createMessageWithImage } from "./functions";
import { AiOutlinePaperClip } from "react-icons/ai";
import api from "../../services/api";

function WebChat({ close }) {
  useEffect(() => {
    let chat = document.getElementById("chat");
    chat.classList.add("chat");
  }, []);

  const { taskVisible } = useSelector((state) => state);
  const { permissions } = useSelector((state) => state);
  const { vinculatedUsers } = useSelector((state) => state);
  const dispatch = useDispatch();
  const { webSocket } = useSelector((state) => state);
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([]);
  const [showImage, setShowImage] = useState(false);
  const [imageMessage, setImageMessage] = useState(null);
  // const {permissions} = useSelector(state => state);
  const AUTH = permissions.session;

  // console.log(websocket.websocket);
  // console.log(webSocket)

  useEffect(() => {
    const mainChat = document.getElementById("mainChat");
    setTimeout(() => {
      setMessages(webSocket.historic);

      mainChat.scrollTop = 100000000;
    }, 60);
  }, [webSocket.historic]);
  // useEffect(() => {
  //   getMessage(AUTH,250)
  // },[])

  // console.log(webSocket.historic)

  function formatDate(dateFormat) {
    if (dateFormat !== undefined) {
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
  }

  function SetMessage(response) {

    // console.log(response)
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

    let uid = response.send_user_id;
    let user = response.user_name;
    let message = response.object.description;
    let nowResponse = response.object.date_time;
    let image = response.object.image;
    let haveImage = false;

    let userAuthor = vinculatedUsers.filter(
      (user) => Number(user.id) === Number(uid)
    );

    user = userAuthor[0].name;

    // console.log(response)

    if (image === 1) {
      loadImage(response.object.last_id);
      // dispatch(getH)
      haveImage = true;
    }

    if (haveImage === true) {
      // console.log('tem imagem')
      setMessages([
        ...webSocket.historic,
        { ...response.object, user_id:uid,user_name: user },
      ]);
      // console.log(messages);
      setTimeout(() => {
        document.getElementById("mainChat").scrollTop = 10000000000;
      }, 60);
    } else {
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
    }

    output.scrollTop = 100000000;
  }

  // console.log(messages)

  function SendMessage(msg) {
    let image = document.getElementById("upload-photo").files[0];

    if (image) {
      // console.log(image);

      // image = convertBase64(image);
      convertBase64(image)
        .then((data) => (image = data))
        .then(() => {
          createMessageWithImage(
            msg,
            image,
            taskVisible.info.task_id,
            AUTH
          ).then((response) => {
            // console.log(response)

            try {
              let jsonString = {
                task_id: taskVisible.info.task_id,
                object: {
                  description: msg,
                  id: response.last_id,
                  date_time: response.date_time,
                  image:1
                },
                user_id: permissions.id,
                type: 1,
              };
              webSocket.websocket.send(JSON.stringify(jsonString));

    
              document.getElementById("upload-photo").value = "";
              setMsg("");
            } catch (error) {
              alert(error);
            }
          });
        });
    } else if (msg !== "" && webSocket.websocketState === "connected") {
      createMessage(msg, taskVisible.info.task_id, AUTH).then((response) => {
        // console.log(response);

        try {
          let jsonString = {
            task_id: taskVisible.info.task_id,
            object: {
              description: msg,
              id: response.last_id,
              date_time: response.date_time,
              image:0
            },
            user_id: permissions.id,
            type: 1,
          };
          webSocket.websocket.send(JSON.stringify(jsonString));


          setMsg("");
        } catch (error) {
          alert(error);
        }
      });
    }
  }

  useEffect(() => {
    // console.log(webSocket)
    if (
      webSocket.message !== "" &&
      webSocket.message &&
      webSocket.message.type === 1
    ) {
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

  async function loadImage(id) {
    try {
      const { data } = await api.get(
        `GTPP/Message.php?AUTH=${AUTH}&app_id=3&id=${id}`
      );

      // console.log(data);

      setImageMessage(convertImage(data.data));
    } catch (error) {
      console.log(error);
    }
  }

  function convertImage(src) {
    if (src != null) {
      var image = new Image();
      image.src = "data:image/jpeg;base64, " + src;
      return image.src;
    } else {
      return null;
    }
  }

  function convertBase64(file) {
    // console.log(file);

    if (file !== null) {

      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
        ;
      });

      // console.log(reader);
    }

    // if (file != null) {
    //   var image = new Image();
    //   image.src = "data:image.jpeg;base64, " + file;
    //   return image.src;
    // } else {
    //   return null;
    // }
  }

  // console.log(messages);

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
        {showImage===true ? (
          <div
            className="showImageMessage"
            style={
              imageMessage === null
                ? { backgroundColor: "transparent", zIndex: -10 }
                : {}
            }
            onClick={() => setImageMessage(null)}
          >
            <img src={imageMessage} alt="" />
          </div>
        ) : (
          ""
        )}

        {messages &&
          messages.map((message) =>
            message.user_id === permissions.id ? (
              <div className="boxRight" key={message.id}>
                <div
                  className="infoMessage"
                  style={{ justifyContent: "flex-end" }}
                >
                  <span
                    className="authorRight"
                    style={
                      message.image === 1 ? { marginRight: "-.1em" } : {}
                    }
                  >
                    Eu
                  </span>
                  {message.image === 1 && (
                    <span
                      className="clipImageRight"
                      onClick={() => {
                       
                        loadImage(message.id).then(() =>  setShowImage(true))}}
                    >
                      <AiOutlinePaperClip size={18} />
                    </span>
                  )}
                </div>
                <h1 className="textRight">{message.description}</h1>
                <span className="dateTextRight">
                  {formatDate(message.date_time)}
                </span>
              </div>
            ) : (
              <div className="boxLeft" key={message.id}>
                <div className="infoMessage">
                  <span className="authorLeft">{message.user_name} </span>
                  {message.image === 1 && (
                    <span
                      className="clipImage"
                      onClick={() => {
                        
                        loadImage(message.id).then(() =>setShowImage(true) )
                        
                        }}
                    >
                      <AiOutlinePaperClip size={18} />
                    </span>
                  )}
                </div>

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
          <textarea
            type="text"
            id="msg"
            value={msg}
            onKeyPress={(e) => (e.key === "Enter" ? SendMessage(msg) : null)}
            onChange={(e) => setMsg(e.target.value)}
          />
          <div>
            <label className="upload" htmlFor="upload-photo">
              <AiOutlinePaperClip size={37} />
            </label>
            <input type="file" name="photo" id="upload-photo" />
          </div>

          <button type="button" onClick={() => SendMessage(msg)}>
            <IoMdSend size={50} color="#ccc" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default WebChat;
