import React from 'react';


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
                  >
                    Confirmar
                  </button>
                  <button
                    className="btnCancel"
                    onClick={() =>
                      props.cancelAction()
                    }
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