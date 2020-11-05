import React from "react";
import {useDispatch} from 'react-redux';
import { logoffRequest } from '../../redux/modules/login/userLoginActions';
import {useHistory} from 'react-router-dom';

import './style.css'

const ButtonLogoff = () => {

  const history = useHistory();
  let dispatch = useDispatch();

  function UserLogoff() {
    sessionStorage.removeItem('token');
    dispatch(logoffRequest());
    history.push("/");
  }

  return (
    <div>

      <button type="button" onClick={() => UserLogoff()} className="buttonLogoff">
        sair
      </button>
    </div>
  );
}

export default ButtonLogoff;