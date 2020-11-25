import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import api from "../../services/api";
import "./style.css";

import Task from "../Task";
import {
  loadTask,
  loadTaskStates,
  loadUserImages,
  loadCompanies,
  loadShop,
} from "./functions";
import {
  getStates,
  setPhotos,
  getCompany,
  getTask,
  getShop,
  getVinculatedUsers,
} from "../../redux";
import TaskCompany from "../TaskCompany";
import { BiPhotoAlbum } from "react-icons/bi";

const TaskTable = () => {
  const { permissions } = useSelector((state) => state);
  const { stateUpdate } = useSelector((state) => state);
  const { visionMenu } = useSelector((state) => state);
  const { taskVisible } = useSelector((state) => state);
  const { vinculatedUsers } = useSelector((state) => state);
  const [takePhotos, setTakePhotos] = useState([]);
  var takePhoto = [{}];
  // const [vinculatedUsers,setVinculatedUsers] = useState([{}]);

  // console.log(permissions)
  const dispatch = useDispatch();

  const [tasks, setTasks] = useState([]);
  // const [companies, setCompanies] = useState([]);

  useEffect(() => {
    loadTask(permissions, visionMenu).then((response) => {
      if (response.error === true) {
        alert("error");
      } else {
        setTasks(response.data);
        dispatch(getTask(response.data));
      }
    });
    // console.log('passou no loadtask')
  }, [stateUpdate]);

  useEffect(() => {
    loadCompanies().then((response) => {
      if (response.error === true) {
        alert("error");
      } else {
        //console.log(response.data);
        dispatch(getCompany(response.data));
      }
    });
  }, []);

  useEffect(() => {
    loadShop().then((response) => {
      if (response.error === true) {
        alert("error");
      } else {
        //console.log(response.data);
        dispatch(getShop(response.data));
      }
    });
  }, []);

  useEffect(() => {
    loadTaskStates(permissions).then((response) => {
      if (response.error === true) {
        alert("error");
      } else {
        dispatch(getStates(response.data));
      }
    });
  }, []);

  //   console.log(vinculatedUsers)

  // useEffect(() => {

  //     vinculatedUsers.map(user => {
  //         // loadUserImages(permissions,user.user_id).then(response => {
  //         //     if (response.error === true) {
  //         //       alert('teste')
  //         //     } else {
  //         //         // console.log(response.data)
  //         //         takePhoto.push(response.data);
  //         //         setPhotos(photos,response.data);
  //         //         // console.log(takePhoto)
  //         //         // setPhotos(...photos,response);
  //         //     //   dispatch(setPhotos(response))
  //         //     }
  //         //   });

  //         const data = loadUserImages(permissions,user.user_id);
  //           console.log(data);

  //     })

  //     // setPhotos(takePhoto);

  //   }, []);

  //   console.log(photos);
  //   console.log(takePhoto);

  async function loadImages(idUser) {
    try {
      const AUTH = sessionStorage.getItem("token");
      let data = {};
      (async () => {
        let {photo,user_id} = await fetch(
          "http://192.168.0.99:71/GLOBAL/Controller/EmployeePhoto.php?AUTH=" +
            AUTH +
            "&app_id=3&id=" +
            idUser,
          { method: "get"}
        )
          .then((response) => {
            return response.json();
          })
          .then((r) => {
            return r;
          })
          .catch((err) => {
            console.log(err);
          });

        // console.log(data);
        let obj;
        if(photo!=null && user_id!=null){
            obj = {"user_id":user_id,"photo":photo}
            setTakePhotos(takePhotos,obj);
        }
        // console.log(user_id,photo)

        // console.log(obj)
        takePhoto.push(obj);
        // setTakePhotos(takePhotos+1);  
        // console.log(takePhotos);

        // takePhoto.push(data);
        
        // takeData(data);

        // dispatch(setPhotos(data));
        if (data.error === true) {
          alert("error asasd");
     
          return;
        }else{
            return takePhoto;
        }
        // console.log(data);
    
       // dispatch(logIn(data.data));
  
      })();
    } catch (error) {
      console.log(error);
      alert("teste");
    }
  }

//   console.log(takePhotos);

  useEffect(() => {
    vinculatedUsers.forEach(user => {
     loadImages(user.user_id); 
 
    })

    // console.log(takePhoto)
    // dispatch(setPhotos)
  },[])


  function takeData(param){
    takePhoto.push(param);
    console.log(takePhoto);
  }

 
  console.log(takePhoto)

  return (
    <ul className="taskList">
      {tasks.map((task) => (
        <Task task={task} key={task.id} />
      ))}
    </ul>
  );
};

export default TaskTable;
