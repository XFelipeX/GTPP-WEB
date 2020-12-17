import React from "react";
import {useDispatch} from 'react-redux';
import { logOff } from '../../redux/userAuth/userAuthActions';
import {useHistory} from 'react-router-dom';
import {BiExit} from 'react-icons/bi';


import './style.css'
import { rgba } from "polished";

const ButtonLogoff = () => {

  const history = useHistory();
  let dispatch = useDispatch();

  function UserLogoff() {
    sessionStorage.removeItem('token');
    dispatch(logOff());
    history.push("/");
  }

  return (
    <div>

      <button type="button" onClick={() => {UserLogoff()}} className="buttonLogoff">
        <BiExit size={50} color="#959595"/>
      </button>
    </div>
  );
}

export default ButtonLogoff;