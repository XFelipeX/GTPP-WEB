import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import userEmpty from "../../assets/nullphoto.jpeg";
import useClickOutside from "../ClickOutside";
import { getUserInfo } from "../../redux";
import api from "../../services/api";
import "./style.css";

let InfoUser = () => {
  let dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state);
  const { permissions } = useSelector((state) => state);
  const [showInfo, setShowInfo] = useState(false);

  const [photo, setPhoto] = useState(userEmpty);

  //   console.log(userInfo)

  async function loadUserInfo() {
    let AUTH = permissions.session;
    let userId = permissions.id;
    try {
      let { data } = await api.get(
        "CCPP/Employee.php?AUTH=" + AUTH + "&app_id=3&id=" + userId
      );
      // console.log(data)
      dispatch(getUserInfo(data.data));
    } catch (error) {
      // console.log(error)
    }
  }

  useEffect(() => {
    loadUserInfo();
  }, []);

  async function loadUserPhoto() {
    const AUTH = permissions.session;
    const idUser = permissions.id;

    try {
      let { data } = await api.get(
        "CCPP/EmployeePhoto.php?AUTH=" + AUTH + "&app_id=3&id=" + idUser
      );

      // console.log(data);

      if (data.photo != null) {
        setPhoto(convertImage(data.photo));
      }
    } catch (error) {}
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

  // console.log(photo);

  return (
    <div ref={domNode} className="user-info-area">
      <div className="user-img">
        <img
          src={photo}
          width="60"
          height="60"
          onClick={() => setShowInfo(!showInfo)}
        ></img>
      </div>
      {showInfo ? (
        <div className="user-info">
          <div className="user-info-content">
            <div className="user-img-card">
              <img
                src={photo}
                onClick={() => setShowInfo(!showInfo)}
              ></img>
            </div>
            <div>
              <p style={{ fontSize: "20px",marginLeft:".3em" }}>
                <strong>{userInfo[0].name} </strong>
              </p>

              <p>
                {userInfo[0].company} - {userInfo[0].shop}
              </p>
              <p>
                {userInfo[0].departament} - {userInfo[0].sub}
              </p>

              {userInfo[1].administrator ? (
                <>
                  <p>
                    <strong>Administrador</strong>
                  </p>
                  <p className="show-admin">
                    Visualizar como administrador
                    <input type="checkbox" />
                  </p>
                </>
              ) : <p>
                  <strong>Usuário comum</strong>
              </p>}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default InfoUser;
