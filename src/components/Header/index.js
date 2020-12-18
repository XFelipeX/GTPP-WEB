import React, { useEffect, useState } from "react";
import ButtonLogoff from "../ButtonLogoff";
import CreateTask from "../CreateTask";
import VisionMenu from "../VisionMenu";
import ButtonFilter from "../ButtonFilter";
import { useSelector, useDispatch } from "react-redux";
import userEmpty from "../../assets/nullphoto.jpeg";
import api from "../../services/api";
import "./style.css";
import Loading from "../Loading";

let UserInfo = () => {
  let dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state);
  const { permissions } = useSelector((state) => state);
  

  const [photo,setPhoto] = useState(null);

  // console.log(userInfo)

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

  useEffect(() => {
    loadUserPhoto();
  }, []);

  // console.log(photo);

  return (
    <div
      className="user-info-area"
      style={{ display: "flex", alignItems: "center" }}
    >
      <div className="user-info">
        <img
          src={photo != null ? photo : userEmpty}
          width="50"
          height="50"
          style={{ borderRadius: "50%", marginLeft: "20px" }}
        ></img>
      </div>
    </div>
  );
};

function Header() {
  const [loading, setLoading] = useState(true);

  return (
    <div className="header-area">
      <div className="container-custom">
        <div className="create-task">
          <UserInfo />
        </div>
        <div className="right-area">
          <CreateTask />

          <VisionMenu />
          <ButtonFilter />

          <ButtonLogoff />
        </div>
      </div>
    </div>
  );
}

export default Header;
