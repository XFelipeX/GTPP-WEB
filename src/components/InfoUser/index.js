import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import userEmpty from "../../assets/nullphoto.jpeg";
import useClickOutside from "../ClickOutside";
import { getUserInfo, getTask, updateTask, seeAdmin } from "../../redux";
import api from "../../services/api";
import Loading from '../Loading';
import "./style.css";


let InfoUser = () => {
  let dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state);
  const { permissions } = useSelector((state) => state);
  const { tasks } = useSelector((state) => state);
  const {seeAdminSet} = useSelector(state => state);
  const [showLoading,setShowLoading] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [seeAdm,setSeeAdm] = useState(false);
  const [info,setInfo] = useState([]);
  const AUTH = permissions.session;
  const [isConnected,setIsConnected] = useState(false);

  const [photo, setPhoto] = useState(userEmpty);

  //   console.log(userInfo)

  async function loadUserInfo() {
    const AUTH = permissions.session;
    let userId = permissions.id;
    try {
      let { data } = await api.get(
        "CCPP/Employee.php?AUTH=" + AUTH + "&app_id=3&id=" + userId
      );
      // console.log(data)
      return data;
    } catch (error) {
      // console.log(error)
      return [{}];
    }
  }

  async function loadAllTasks(){
    const AUTH = permissions.session;

    try {
      const {data} = await api.get('GTPP/Task.php?AUTH='+AUTH+"&app_id=3&administrator=1");

      if(data.error ===true){
        return null;
      }

      return data.data;
    } catch (error) {
      return null
    }
  }

  function seeHowAdm(){
    setShowLoading(true);
    dispatch(seeAdmin());
    if(seeAdm===false){
      setSeeAdm(true);
      loadAllTasks().then(response => dispatch(getTask(response)));
    }else{
      setSeeAdm(false);
      dispatch(updateTask());
    }

    setTimeout(() => {
      setShowLoading(false);
    },1000)
  }

  useEffect(() => {
    loadUserInfo().then(response => {
      dispatch(getUserInfo(response.data));
      setInfo(response.data);
    });
  }, []);

  async function loadUserPhoto() {
    const AUTH = permissions.session;
    const idUser = permissions.id;

    try {
      let { data } = await api.get(
        "CCPP/EmployeePhoto.php?AUTH=" + AUTH + "&app_id=3&id=" + idUser
      );

      // console.log(data);

      if (data.photo != null) {
        setPhoto(convertImage(data.photo));
        
      }
    } catch (error) {}finally{
      userInfo[0].photo = photo
      let info = [userInfo[0],userInfo[1]];
      dispatch(getUserInfo(info));
    }
  }

  // console.log(userInfo);

  function convertImage(src) {
    if (src != null) {
      var image = new Image();
      image.src = "data:image/jpeg;base64, " + src;
      return image.src;
    } else {
      return null;
    }
  }

  let domNode = useClickOutside(() => {
    setShowInfo(false);
  });

  useEffect(() => {
    loadUserPhoto();
  }, []);

  function Connect() {
    // let connection;
    let ws;
    let isConnected = false;
    let time_out;
  
    function Ping() {
      if (!isConnected) {
        return;
      }
      ws.send("__ping__");
      time_out = setTimeout(function () {
        // connection.innerText = "Sem conexão";
        // connection.style.color = "red";
        // status.style.background = "red";
      }, 5000);
    }
  
    //Pong para cancel o TimeOut que estava aguardando no Ping
    function Pong() {
      clearTimeout(time_out);
    }
    try {
      ws = new WebSocket("ws://192.168.0.99:3333");
      //ws = new WebSocket('ws://187.35.128.157:3333');
  
      ws.onopen = function () {
        // connection.innerText = "Connectado";
        // connection.style.color = "green";
        // status.style.background = "green";
  
        //Autenticar o usuário
        console.log('conexão aberta')
        setIsConnected('connected');
        // connection = "conexão aberta";
        let jsonString = {
          auth: AUTH,
          app_id: 3,
        };
        ws.send(JSON.stringify(jsonString));
  
        //Enviar um ping para o servidor a cada 10 segundos
        setInterval(Ping, 10000);
        isConnected = true;
      };
  
      ws.onerror = function (ev) {
        // connection.innerText = "Erro: " + ev.data;
        // connection.style.color = "yellow";
        // status.style.background = "yellow";
        console.log('error')
        console.log(ev.data)
        setIsConnected('tryload');
        // connection = "erro de conexão";
      };
  
      ws.onclose = function () {
        // connection.innerText = "Desconectado";
        // connection.style.color = "red";
  
        // status.style.background = "red";
  
        console.log('conexão fechada')
        setIsConnected('error')
        // connection = "conexão fechada";
  
        //Tentar reconectar o WebSocket a cada 1 segundo
        setTimeout(function () {
          Connect();
        }, 1000);
        // isConnected = false;
      };
  
      ws.onmessage = function (ev) {
        //Ao receber o pong do servidor, cancela o TimeOut
        if (ev.data.toString() === "__pong__") {
          Pong();
          return;
        }
        let response = JSON.parse(ev.data);
        
        // setIsConnected('tryload');

        alert(response.user_name+": "+response.message);
        console.log(response)
        //Ao receber mensagem que não seja pong
        // SetMessage(response);
      };
  
      
    } catch (error) {
      // connection.innerText = error;
      
    }
  }

  useEffect(() => {
    Connect(AUTH);
  },[])

  

  // console.log(photo);

  return (
    <div ref={domNode} className="user-info-area">
      {showLoading ===true ? (
        <Loading/>
      ): null}
      <div className="user-img">
        <img
        style={isConnected === 'connected' ? {border:'2px solid green'} : isConnected === 'error' ? {border:'2px solid red'} : isConnected === 'tryload' ? {border:'2px solid yellow'} : null }
          src={photo}
          width="60"
          height="60"
          onClick={() => setShowInfo(!showInfo)}
          alt="imagem do usuário logado"
        ></img>
      </div>
      {showInfo ? (
        <div className="user-info">
          <div className="user-info-content">
            <div className="user-img-card">
              <img
                src={photo}
                onClick={() => setShowInfo(!showInfo)}
                alt="imagem do usuário logado"
              ></img>
            </div>
            <div>
              <p style={{ fontSize: "20px",marginLeft:".3em" }}>
                <strong>{info[0].name} </strong>
              </p>

              <p>
                {info[0].company} - {info[0].shop}
              </p>
              <p>
                {info[0].departament} - {info[0].sub}
              </p>
              {info[1] ? (
                info[1].administrator != null && info[1].administrator ==1 ? (
                <>
                  <p>
                    <strong>Administrador</strong>
                  </p>
                  <p className="show-admin">
                    Visualizar como administrador
                    <input type="checkbox" checked={seeAdminSet} onChange={() => seeHowAdm()}/>
                  </p>
                </>
              ) : <p>
                  <strong>Usuário comum</strong>
              </p>
              ):  null}

             
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default InfoUser;
