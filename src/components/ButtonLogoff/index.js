import React,{useState} from "react";
import {useDispatch} from 'react-redux';
import { logOff } from '../../redux/userAuth/userAuthActions';
import {useHistory} from 'react-router-dom';
import {BiExit} from 'react-icons/bi';
import ConfirmAction from '../ConfirmAction';

import './style.css'
import { rgba } from "polished";

const ButtonLogoff = () => {
  const [showConfirmAction,setShowConfirmAction] = useState();
  const history = useHistory();
  let dispatch = useDispatch();

  function UserLogoff() {
    sessionStorage.removeItem('token');
    dispatch(logOff());
    history.push("/");
  }

  return (
    <div>

      <button type="button" onClick={() => {setShowConfirmAction(true)}} className="buttonLogoff">
        <BiExit size={50} color="#959595"/>
      </button>

      {showConfirmAction ? (
        <ConfirmAction confirm={() => {}} question="Tem certeza que deseja sair" action={() => UserLogoff()} cancelAction={() => setShowConfirmAction(false)}/>
      ):null}
    </div>
  );
}

export default ButtonLogoff;