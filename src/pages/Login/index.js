import React from 'react';
import {useHistory} from 'react-router-dom';
import { useDispatch } from 'react-redux';

import './style.css';
import img from '../../assets/art.png';
import logo from '../../assets/logo.png';
import api from '../../services/api';
import { loginRequest } from '../../redux/modules/Login/userLoginActions';

import auth from './auth'


const Login = () => {

 
  
  const history = useHistory();
  const dispatch = useDispatch();


  function UserLogin(){
    auth(document.getElementById('user_id'),document.getElementById('password'));
    let token = sessionStorage.getItem('token');
    if(token.session!=''){
      dispatch(loginRequest(token))
      history.push('/main');  
    } 
  }
 
      
  

  return (
    <div className="container">
      <form className="formSection" onSubmit={e => e.preventDefault()}>
        <img src={logo} alt=""/>
        <h2>Gerenciador de Tarefas</h2>
        <h1>Login</h1>
        <label htmlFor="">Usuario</label>
        <input type="text" id="user_name" autoFocus />
        <label htmlFor="">Senha</label>
        <input type="password" id="password"/>
        <button onClick={() => UserLogin()}>Entrar</button>
      </form>
      <div className="divisor"/>
      <div className="artSection">
        <img src={img} alt=""/>
      </div>
    </div>
  );
}

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