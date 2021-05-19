import React, { useState } from "react";
import useClickOutside from "../ClickOutside";
import "./style.css";
import {showNotification} from '../../Utils/Notify';

const AlterPassword = ({
  defaultUser,
  oldPassword,
  userLogin,
  closeModal,
  onlyRead,
}) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userName, setUserName] = useState(defaultUser);
  const [password, setPassword] = useState(oldPassword);

  function changePassword() {
    if (newPassword === "" || confirmPassword === "") {
      showNotification("Aviso", "Preencha todos os campos", "warning");
    } else if (!(newPassword === confirmPassword)) {
      showNotification("Aviso", "As senhas não coincidem", "warning");
    } else {
      try {
        let data;
        (async () => {
          data = await fetch(
            "http://192.168.0.99:71/GLOBAL/Controller/CCPP/Login.php?login",
            {
              method: "PUT",
              body: JSON.stringify({
                user: userName,
                password: password,
                new_password: newPassword,
              }),
            }
          );

          const json = await data.json();

          if (json.error === true) {
            let msg = json.message;

            if (msg.includes("Password require minimum 8 digits")) {
              showNotification(
                "Aviso",
                "A senha precisa ter pelo menos 8 dígitos",
                "warning"
              );
            } else if (msg.includes("This password do is not match")) {
              showNotification("Aviso", "Senha incorreta", "warning");
            } else if (msg.includes("Both is the same password")) {
              showNotification(
                "Aviso",
                "A nova senha não pode ser igual a anterior",
                "warning"
              );
            } else {
              showNotification("Aviso", msg, "warning");
            }
          } else if (userLogin !== null) {
            document.getElementById("password").value = newPassword;
            userLogin();
          } else {
            showNotification("Sucesso", "A senha foi alterada", "success");
            closeModal(false);
          }
        })();
      } catch (error) {
        showNotification("erro", error.message, "danger");
      }
    }
  }

  let domNode = useClickOutside(() => {
    closeModal(false);
  });

  return (
    <div className="changePasswordContainer">
      <div ref={domNode} className="changePasswordModal">
        <div className="changePasswordModalTop">
          <h2>Redefina sua senha</h2>
        </div>

        <div className="changePasswordModalCenter">
          <div>
            <span htmlFor="name">Usuário</span>
            <input
              readOnly
              defaultValue={userName}
              onChange={({ target }) => setUserName(target.value)}
              type="text"
              id="name"
              name="name"
            />
          </div>
          <div>
            <span htmlFor="oldPassword">Senha antiga</span>
            <input
              readOnly={onlyRead}
              defaultValue={password}
              onChange={({ target }) => setPassword(target.value)}
              type="password"
              id="oldPassword"
              name="oldPassword"
            />
          </div>

          <div>
            <span htmlFor="newPassword">Nova senha</span>
            <input
              value={newPassword}
              onChange={({ target }) => setNewPassword(target.value)}
              type="password"
              id="newPassword"
              name="newPassword"
            />
          </div>

          <div>
            <span htmlFor="confirmPassword">Confirmar senha</span>
            <input
              value={confirmPassword}
              onChange={({ target }) => setConfirmPassword(target.value)}
              type="password"
              id="confirmPassword"
              name="confirmPassword"
            />
          </div>
        </div>

        <div className="changePasswordModalFooter">
          <button type="button" onClick={changePassword}>
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlterPassword;
