import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logIn } from "../../redux/userAuth/userAuthActions";
import "./style.css";
import img from "../../assets/art.png";
import logo from "../../assets/logo.png";
import api from "../../services/api";
import {getUserInfo, loadingScreen} from '../../redux';


const Login = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [access, setAccess] = useState(false);

  const [ permissions,setPermissions ] = useState({session:"",id:""});
  // const [status,setStatus] = useState(false);
  // console.log(permissions);

  async function userInfo(){
    let AUTH = permissions.session;
    let userId = permissions.id;
    try {
      let {data} = await api.get('CCPP/Employee.php?AUTH='+AUTH+"&app_id=3&id="+userId);
      // console.log(data)
      dispatch(getUserInfo(data.data));
    } catch (error) {
      // console.log(error)
    }
    
  }

  useEffect(() => {
    userInfo();
  },[permissions])

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
                alert("usuário e/ou senha incorretos");
              }
            } else {
              sessionStorage.setItem("token", data.data.session);
              dispatch(logIn(data.data));
              dispatch(loadingScreen());
              setPermissions(data.data);
              history.push("/main");
            }
          } catch (error) {}
        })();
      } catch (error) {
        console.log(error);
        alert("Usuario o senha incorretos");
      }
    }
  }

  async function verifyVersion() {
    const version = 1.0;

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
      <div className="divisor" />
      <div className="artSection">
        <img src={img} alt="" />
      </div>
    </div>
  );
};

export default Login;

// function options(e){
//     console.log(e.value);
// }

/* <div>
<select id="opcoes" onChange={ () => options(document.getElementById('opcoes'))}>
    <option value="">selecione uma opcao</option>
    <option value="opcao1">opção 1</option>
    <option value="opcao2">opção 2</option>
</select>
</div> */
