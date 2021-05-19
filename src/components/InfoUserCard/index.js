import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { useSelector } from "react-redux";
import userEmpty from "../../assets/nullphoto.jpeg";
import useClickOutside from "../ClickOutside";
import {showNotification} from '../../Utils/Notify';
import "./style.css";


let InfoUserCard = ({ id, close }) => {
  const { permissions } = useSelector((state) => state);
  const { userPhotos } = useSelector((state) => state);
  const [userInfo, setInfoUser] = useState({});
  const [photo, setPhoto] = useState(userEmpty);

  let domNode = useClickOutside(() => {
    close();
  });

  async function loadUserInfo() {
    let AUTH = permissions.session;
    let userId = id;
    try {
      let { data } = await api.get(
        "CCPP/Employee.php?AUTH=" + AUTH + "&app_id=3&id=" + userId
      );

      if (data.error === true) {
        let msg = data.message;

        if (msg.includes("No data")) {
        } else if (msg.includes("Authorization denied")) {
          showNotification("Erro", "Autorização negada", "danger");
        } else {
          showNotification("Erro", msg, "danger");
        }
      } else {
        setInfoUser(data.data);
      }
    } catch (error) {
      showNotification("Erro", error.message, "danger");
    }
  }

  useEffect(() => {
    let photoUser = userPhotos.filter((photo) => photo.user_id == id);
    let auxPhoto = photoUser[0].photo;

    if (auxPhoto != null) {
      setPhoto(auxPhoto);
    }

    loadUserInfo();
  }, []);

  return (
    <div className="info-user-task" ref={domNode}>
      {userInfo[0] ? (
        <div className="user-info-task">
          <div className="user-info-content-task">
            <div className="user-img-card-task">
              <img src={photo}></img>
            </div>
            <div>
              <p style={{ fontSize: "18px", marginLeft: ".4em" }}>
                <strong>{userInfo[0].name} </strong>
              </p>

              <p>
                {userInfo[0].company} - {userInfo[0].shop}
              </p>
              <p>
                {userInfo[0].departament} - {userInfo[0].sub}
              </p>

              {userInfo[1].administrator != null &&
              userInfo[1].administrator == 1 ? (
                <p>
                  <strong>Administrador</strong>
                </p>
              ) : (
                <p>
                  <strong>Usuário comum</strong>
                </p>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default InfoUserCard;
