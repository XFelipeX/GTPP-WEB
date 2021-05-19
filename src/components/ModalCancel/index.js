import React from 'react';

let ModalCancel = ({reason,setReason,ask,cancelTask,close}) => {
    return (
      <div className="modalAsk">
        <div>
          <ul className="menuAsk">
            <li>
              <h3>{ask}, tem certeza?</h3>
              <h2>*Informe o motivo:</h2>
              <textarea
                value={reason}
                spellCheck="false"
                rows="5"
                onChange={(e) => setReason(e.target.value)}
              ></textarea>
            </li>
            <li>
              <button
                className="btnConfirm"
                onClick={(e) =>
                  cancelTask()
                }
              >
                Confirmar
              </button>
              <button
                className="btnCancel"
                onClick={() => close()}
              >
                Cancelar
              </button>
            </li>
          </ul>
        </div>
      </div>
    );
  };

  export default ModalCancel;