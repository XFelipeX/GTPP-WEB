import React from 'react';
import './style.css';

let ConfirmAction = (props) => {
    return (
      <div  className="modalConfirm">
              <div >
             
              <ul  className="menuConfirm">
              <li>
                  <h3>{props.question}?</h3>
                </li>
                <li>
                  <button
                    className="btnConfirm"
                    onClick={(e) =>
                      {
                        props.confirm();
                        props.action();
                      }
                    }
                    style={{marginTop:"0"}}
                  >
                    Confirmar
                  </button>
                  <button
                    className="btnCancel"
                    onClick={() =>
                      props.cancelAction()
                    }
                    style={{marginTop:"0"}}
                  >
                    Cancelar
                  </button>
                </li>
              </ul>
              </div>
              </div>
    )
  }



  export default ConfirmAction;