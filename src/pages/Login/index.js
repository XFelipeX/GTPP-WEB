import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logIn, logOff } from '../../redux/userAuth/userAuthActions';
import './style.css';
import img from '../../assets/art.png';
import logo from '../../assets/logo.png';
import api from '../../services/api';
import { store } from 'react-notifications-component';
import AlterPassword from '../../components/AlterPassword';

function showNotification(title, message, type) {
  store.addNotification({
    title: title,
    message: message,
    type: type,
    container: 'top-center',
    insert: 'top',
    animationIn: ['animate__animated animate__fadeIn'],
    animationOut: ['animate__animated animate__fadeOut'],
    dismiss: {
      duration: 4000,
    },
    width: 400,
  });
}

const Login = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [access, setAccess] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  useEffect(() => {
    dispatch(logOff());
  }, []);
  async function UserLogin() {
    verifyVersion();
    if (access) {
      try {
        let data = {};
        (async () => {
          data = await fetch(
            'http://192.168.0.99:71/GLOBAL/Controller/CCPP/Login.php?login&app_id=3',
            {
              method: 'post',
              body: JSON.stringify({
                user: document.getElementById('user_name').value,
                password: document.getElementById('password').value,
              }),
            },
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
                  'This user does not have access to this application',
                )
              ) {
                showNotification(
                  'Aviso',
                  'Este usuário não tem acesso a esta aplicação',
                  'warning',
                );
              } else if (msg.includes('User or password error')) {
                showNotification(
                  'Aviso',
                  'Usuário e/ou senha incorreto(s)',
                  'warning',
                );
              } else if (msg.includes('(user, password, app_id) is broken')) {
                showNotification(
                  'Aviso',
                  'Preencha todos os campos',
                  'warning',
                );
              } else if (msg.includes('Default password is not permited')) {
                setShowChangePassword(true);
              } else if (msg.includes('This password do is not match')) {
                showNotification('Aviso', 'Senha incorreta', 'warning');
              } else if (msg.includes('No data')) {
                showNotification('Aviso', 'Usuário não encontrado', 'warning');
              } else {
                showNotification('Aviso', msg, 'warning');
              }
            } else {
              localStorage.setItem('token', data.data.session);
              const object = { ...data.data };
              object.user = document.getElementById('user_name').value;
              object.token = sessionStorage.getItem('token');
              dispatch(logIn(object));
              history.push('/main');
            }
          } catch (error) {
            showNotification('erro', error.message, 'danger');
          }
        })();
      } catch (error) {
        showNotification('erro', error.message, 'danger');
      }
    }
  }

  async function verifyVersion() {
    const version = '1.5.0';

    try {
      let { data } = await api.get('CCPP/AppVersion.php?id=3');

      if (data.error !== true) {
        let versionApp = String(data.data[0].version);

        if (versionApp === version) {
          setAccess(true);
        } else {
          showNotification(
            'Aviso',
            'Aplicação desatualizada, a versão necessária é ' +
              versionApp +
              ', a versão atual é ' +
              version,
            'warning',
          );
          setAccess(false);
        }
      }
    } catch (error) {
      showNotification('erro', error.message, 'danger');
      return false;
    }
  }

  useEffect(() => {
    verifyVersion();
  }, []);

  return (
    <div className="container">
      {showChangePassword && (
        <AlterPassword
          closeModal={setShowChangePassword}
          defaultUser={document.getElementById('user_name').value}
          oldPassword={document.getElementById('password').value}
          userLogin={UserLogin}
          onlyRead={true}
        />
      )}
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
      <div className="version">
        <span>GTPP - App Web - Version 1.5.0 </span>
        <span> Created by:</span>
        <span>
          FrontEnd - <strong>Felipe</strong>
        </span>
        <span>
          BackEnd - <strong>Kyo</strong>
        </span>
      </div>

      <div className="divisor" />
      <div className="artSection">
        <img src={img} alt="" />
      </div>
    </div>
  );
};

export default Login;
