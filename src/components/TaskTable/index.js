import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import api from "../../services/api";
import "./style.css";

import Task from "../Task";
import {
  loadTask,
  loadTaskStates,
  loadCompanies,
  loadShop,
  loadDept,
} from "./functions";
import {
  getStates,
  setPhotos,
  getCompany,
  getTask,
  getDepts,
  getShop,
  loadingScreen,
} from "../../redux";

const TaskTable = () => {
  const { permissions } = useSelector((state) => state);
  const { stateUpdate } = useSelector((state) => state);
  const { visionMenu } = useSelector((state) => state);
  // const {updateTaskVisible} = useSelector(state => state);
  const { taskVisible } = useSelector((state) => state);
  const { vinculatedUsers } = useSelector((state) => state);
  const [takePhotos, setTakePhotos] = useState([]);
  const { tasks } = useSelector((state) => state);

  const dispatch = useDispatch();


  useEffect(() => {
    loadTask(permissions, visionMenu).then((response) => {
      if (response.error === true) {
        alert("error");
      } else {
        // setTasks(response.data);
        try {
          console.log(response)
          dispatch(getTask(response.data));
        } catch (error) {}
      }
    });
  }, [stateUpdate]);

  useEffect(() => {
    loadCompanies().then((response) => {
      if (response.error === true) {
        alert("error");
      } else {
        //console.log(response.data);
        try {
          dispatch(getCompany(response.data != "" ? response.data : []));
        } catch (error) {}
      }
    });
  }, []);

  useEffect(() => {
    loadShop().then((response) => {
      if (response.error === true) {
        alert("error");
      } else {
        //console.log(response.data);
        try {
          dispatch(getShop(response.data != "" ? response.data : []));
        } catch (error) {}
      }
    });
  }, []);

  useEffect(() => {
    loadTaskStates(permissions).then((response) => {
      if (response.error === true) {
        alert("error");
      } else {
        try {
          dispatch(getStates(response.data));
        } catch (error) {}
      }
    });
  }, []);

  useEffect(() => {
    loadDept().then((response) => {
      if (response.error === true) {
        alert("error");
      } else {
        try {
          dispatch(getDepts(response.data));
        } catch (error) {}
      }
    });
  }, []);

  const loadUserImages = async (idUser) => {
    const AUTH = sessionStorage.getItem("token");
    try {
      const { data } = await api.get(
        "http://192.168.0.99:71/GLOBAL/Controller/CCPP/EmployeePhoto.php?AUTH=" +
          AUTH +
          "&app_id=3&id=" +
          idUser
      );

   

      if (data) {
        if(data.photo==null){
          data.user_id = idUser;
          // console.log(data.user_id);
        }
        data.photo = convertImage(data.photo);
        setTakePhotos((oldarray) => [...oldarray, data]);
        
      }
      // console.log(data)
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    vinculatedUsers.forEach((user) => {
      loadUserImages(user.user_id);
    });
    // dispatch(loadingScreen())
  }, []);

  useEffect(() => {
    dispatch(setPhotos(takePhotos));
  }, [takePhotos]);

  function convertImage(src) {
    if (src != null) {
      var image = new Image();
      image.src = "data:image/jpeg;base64, " + src;
      return image.src;
    } else {
      return null;
    }
  }

  return (
    <ul className="taskList">
      {tasks ? tasks.map((task) => <Task task={task} key={task.id} />) : null}
    </ul>
  );
};

export default TaskTable;
