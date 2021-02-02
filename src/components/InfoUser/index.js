import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import userEmpty from "../../assets/nullphoto.jpeg";
import useClickOutside from "../ClickOutside";
import {
  getUserInfo,
  updateTask,
  seeAdmin,
  updateStateAdmin,
  updateModal,
} from "../../redux";
import { store } from "react-notifications-component";
import api from "../../services/api";
import Loading from "../Loading";
import { RiLockPasswordFill } from "react-icons/ri";
import "./style.css";
import AlterPassword from "../AlterPassword";

let InfoUser = () => {
  let dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state);
  const { permissions } = useSelector((state) => state);
  const { seeAdminSet } = useSelector((state) => state);
  const { webSocket } = useSelector((state) => state);
  const [showLoading, setShowLoading] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [seeAdm, setSeeAdm] = useState(false);
  const [info, setInfo] = useState([]);
  const [photo, setPhoto] = useState(userEmpty);

  function showNotification(title, message, type) {
    store.addNotification({
      title: title,
      message: message,
      type: type,
      container: "top-center",
      insert: "top",
      animationIn: ["animate__animated animate__fadeIn"],
      animationOut: ["animate__animated animate__fadeOut"],
      dismiss: {
        duration: 2000,
      },
      width: 400,
    });
  }

  async function loadUserInfo() {
    const AUTH = permissions.session;
    let userId = permissions.id;
    try {
      let { data } = await api.get(
        "CCPP/Employee.php?AUTH=" + AUTH + "&app_id=3&id=" + userId
      );
      if (data.error === true) {
        showNotification("Erro", data.message, "danger");
        return {};
      }
      return data;
    } catch (error) {
      showNotification("Erro", error.message, "danger");
      return { data: {} };
    }
  }

  function seeHowAdm() {
    setShowLoading(true);
    dispatch(updateModal());
    dispatch(seeAdmin());
    if (seeAdm === false) {
      setSeeAdm(true);
      dispatch(updateStateAdmin());
      showNotification(
        "Sucesso",
        "Você está visualizando como administrador",
        "success"
      );
    } else {
      showNotification(
        "Sucesso",
        "Você está visualizando como um usuário comum",
        "success"
      );
      setSeeAdm(false);
      dispatch(updateTask());
    }

    setTimeout(() => {
      setShowLoading(false);
    }, 1000);
  }

  useEffect(() => {
    loadUserInfo()
      .then((response) => {
        dispatch(getUserInfo(response.data));
        setInfo(response.data);
      })
      .catch((error) => {
        dispatch(getUserInfo([{}]));
      });
  }, []);

  async function loadUserPhoto() {
    const AUTH = permissions.session;
    const idUser = permissions.id;

    try {
      let { data } = await api.get(
        "CCPP/EmployeePhoto.php?AUTH=" + AUTH + "&app_id=3&id=" + idUser
      );

      if (data.photo != null) {
        setPhoto(convertImage(data.photo));
      }

      if (data.error === true) {
        let msg = data.message;

        if (msg.includes("Authorization denied")) {
          showNotification("Erro", "Autorização negada", "danger");
        } else {
          showNotification("Erro", msg, "danger");
        }
      }
    } catch (error) {
      showNotification("Erro", error.message, "danger");
      dispatch(getUserInfo({}));
      return;
    }
    if (userInfo[0]) {
      userInfo[0].photo = photo;
      let info = [userInfo[0], userInfo[1]];
      dispatch(getUserInfo(info));
    }
  }

  function convertImage(src) {
    if (src != null) {
      var image = new Image();
      image.src = "data:image/jpeg;base64, " + src;
      return image.src;
    } else {
      return null;
    }
  }

  let domNode = useClickOutside(() => {
    setShowInfo(false);
  });

  useEffect(() => {
    loadUserPhoto();
  }, []);

  return (
    <div ref={domNode} className="user-info-area">
      {changePassword && (
        <AlterPassword
          closeModal={setChangePassword}
          defaultUser={permissions.user}
          oldPassword={""}
          userLogin={null}
          onlyRead={false}
        />
      )}
      {showLoading === true ? <Loading /> : null}
      <div className="user-img">
        <img
          style={
            webSocket.websocketState === "connected"
              ? { border: "3px solid green" }
              : webSocket.websocketState === "error"
              ? { border: "3px solid red" }
              : webSocket.websocketState === "tryload"
              ? { border: "3px solid yellow" }
              : null
          }
          src={photo}
          width="60"
          height="60"
          onClick={() => setShowInfo(!showInfo)}
          alt="imagem do usuário logado"
        ></img>
      </div>
      {showInfo && info[0] && info[1] ? (
        <div className="user-info">
          <div className="user-info-content">
            <div className="user-img-card">
              <img
                src={photo}
                onClick={() => setShowInfo(!showInfo)}
                alt="imagem do usuário logado"
              ></img>
            </div>
            <div>
              <p style={{ fontSize: "20px", marginLeft: ".3em" }}>
                <strong>{info[0].name} </strong>
              </p>

              <p>
                {info[0].company} - {info[0].shop}
              </p>
              <p>
                {info[0].departament} - {info[0].sub}
              </p>
              {info[1] ? (
                info[1].administrator != null && info[1].administrator == 1 ? (
                  <>
                    <p>
                      <strong>Administrador</strong>
                      <RiLockPasswordFill
                        className="password"
                        size={20}
                        color="#c9c9c9"
                        onClick={() => setChangePassword(true)}
                      />
                    </p>
                    <p className="show-admin">
                      Visualizar como administrador
                      <input
                        type="checkbox"
                        checked={seeAdminSet}
                        onChange={() => seeHowAdm()}
                      />
                    </p>
                  </>
                ) : (
                  <p>
                    <strong>Usuário comum</strong>
                    <RiLockPasswordFill
                      className="password"
                      size={20}
                      color="#c9c9c9"
                      onClick={() => setChangePassword(true)}
                    />
                  </p>
                )
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default InfoUser;
