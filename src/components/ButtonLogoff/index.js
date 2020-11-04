import React from "react";
import {useDispatch} from 'react-redux';
import { logoffRequest } from '../../redux/modules/Login/userLoginActions';
import {useHistory} from 'react-router-dom';

import './index.css'

const ButtonLogoff = () => {

  const history = useHistory();
  let dispatch = useDispatch();

  function UserLogoff() {
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