import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
// import {getTask, taskInfoShow} from '../../redux';
import { logIn, logOff } from "../../redux/userAuth/userAuthActions";
import "./style.css";
import img from "../../assets/art.png";
import logo from "../../assets/logo.png";
import api from "../../services/api";

const Login = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [access, setAccess] = useState(false);
  // const {taskVisible} = useSelector(state => state);
  useEffect(() => {
    dispatch(logOff());
    // dispatch(getTask([{}]));
  }, []);

  // console.log(taskVisible)

  async function UserLogin() {
    verifyVersion();
    if (access) {
      try {
        let data = {};
        (async () => {
          data = await fetch(
            "http://192.168.0.99:71/GLOBAL/Controller/CCPP/Login.php?login&app_id=3",
            {
              method: "post",
              body: JSON.stringify({
                user: document.getElementById("user_name").value,
                password: document.getElementById("password").value,
              }),
            }
          )
            .then((response) => {
              return response.json();
            })
            .then((r) => {
              return r;
            })
            .catch((err) => {
              console.log(err);
            });

          try {
            if (data.error === true) {
              let msg = data.message;
              if (
                msg.includes(
                  "This user does not have access to this application"
                )
              ) {
                alert("Este usuário não tem acesso a esta aplicação!");
              } else if (msg.includes("User or password error")) {
                alert("Usuário e/ou senha incorreto(s)");
              } else if (msg.includes("(user, password, app_id) is broken")) {
                alert("Preencha todos os campos");
              }
            } else {
              sessionStorage.setItem("token", data.data.session);
              dispatch(logIn(data.data));
              // dispatch(loadingScreen());
              // console.log(loading)
              // setPermissions(data.data);
              history.push("/main");
            }
          } catch (error) {}
        })();
      } catch (error) {
        console.log(error);
        alert("usuário e/ou senha incorreto(s)");
      }
    }
  }

  async function verifyVersion() {
    const version = 0.82;

    try {
      let { data } = await api.get("CCPP/AppVersion.php?id=3");

      if (data.error !== true) {
        let versionApp = data.data[0].version;

        if (versionApp == version) {
          setAccess(true);
        } else {
          alert(
            "Aplicação desatualizada, a versão necessária é " +
              versionApp +
              ", a versão atual é " +
              version
          );
          setAccess(false);
        }
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  useEffect(() => {
    verifyVersion();
  }, []);

  return (
    <div className="container">
      <form className="formSection" onSubmit={(e) => e.preventDefault()}>
        <img src={logo} alt="" />
        <h2>Gerenciador de Tarefas</h2>
        <h1>Login</h1>
        <label htmlFor="">Usuario</label>
        <input type="text" id="user_name" autoFocus />
        <label htmlFor="">Senha</label>
        <input type="password" id="password" />
        <button onClick={() => UserLogin()}>Entrar</button>
      </form>
      <span className="version">Task - App version 0.82 Created by Felipe</span>
      <div className="divisor" />
      <div className="artSection">
        <img src={img} alt="" />
      </div>
    </div>
  );
};

export default Login;
