import React from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginRequest } from "../../redux/modules/login/userLoginActions";
import "./style.css";
import img from "../../assets/art.png";
import logo from "../../assets/logo.png";
// import api from "../../services/api";
import axios from 'axios';

// import auth from './auth'

const Login = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  const { permissions } = useSelector((state) => state);
  // console.log(permissions);

  const UserLogin = () => {
    try {
      let data = {};
        (async () => { data = await fetch(
        "http://192.168.0.99:71/GLOBAL/Controller/Login.php?login&app_id=2",
        { method:"post",
        body:JSON.stringify(({"user":"felipe","password":1234}))
        }
      ).then(response =>  response.json()).then( body => data = body.data)})() ;
        
      
    //   (async () => {
    //     dia_do_mes = await fetch('https://api.myjson.com/bins/dhhvz')
    //         .then(response => {
    //         return response.json();
    //         })
    //         .then(r => {
    //              return r;
    //         })
    //         .catch(err => {
    //             // Do something for an error here
    //         });
    //     console.log("Exemplo com async/await", dia_do_mes);
    // })();
    











      console.log(data);
    
      // console.log(data);
      if (data.error === true) {
        // alert(data.message)
        console.log("entrei no error");
        return;
      }
      // console.log(data);
      sessionStorage.setItem("token", data.data.session);
      dispatch(loginRequest(data.data));
      history.push("/main");
    } catch (error) {
      console.log(error)
      alert("Usuario o senha incorretos");
    }
  };
  
  
  
  
  
  
  // async function UserLogin(){
  //   try {
  //     await axios.post(
  //       'http://187.35.128.157:71/GLOBAL/Controller/Login.php?login&app_id=2',

  //       //  {user:"felipe",password:1234} 
  //       {user:"felipe",password:1234}
  //     ).then(response => console.log(response.data));
  //     // console.log(data);
  //     // if (data.error === true) {
  //     //   // alert(data.message)
  //     //   console.log("entrei no error");
  //     //   return;
  //     // }
  //     // // console.log(data);
  //     // sessionStorage.setItem("token", data.data.session);
  //     // dispatch(loginRequest(data.data));
  //     // history.push("/main");
  //   } catch (error) {
  //     console.log(error)
  //     alert("Usuario o senha incorretos");
  //   }
  // };

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
