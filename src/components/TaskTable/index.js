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
  taskVisibleUpdate,
  taskInfoShow
} from "../../redux";
import TaskCompany from "../TaskCompany";
import { BiPhotoAlbum } from "react-icons/bi";


const TaskTable = () => {
  const { permissions } = useSelector((state) => state);
  const { stateUpdate } = useSelector((state) => state);
  const { visionMenu } = useSelector((state) => state);
  const {updateTaskVisible} = useSelector(state => state);
  const { taskVisible } = useSelector((state) => state);
  const { vinculatedUsers } = useSelector((state) => state);
  const [takePhotos, setTakePhotos] = useState([]);
  const {tasks} = useSelector(state => state);
  // var takePhoto = [{}];
  // const [vinculatedUsers,setVinculatedUsers] = useState([{}]);

  // console.log(permissions)
  const dispatch = useDispatch();

  // const [tasks, setTasks] = useState([]);
  // const [companies, setCompanies] = useState([]);

  useEffect(() => {
    loadTask(permissions, visionMenu).then((response) => {
      if (response.error === true) {
        alert("error");
      } else {
        // setTasks(response.data);
        dispatch(getTask(response.data));
        console.log(tasks);
        //    tasks.map((task) =>
        //   task.id === taskVisible.id
        //     ? dispatch(taskInfoShow(task))
        //     : // console.log(task.progress)
        //       null
        // );
      }
    });
    // console.log('passou no loadtask')
  }, [stateUpdate,updateTaskVisible]);

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
        let data = await fetch(
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
        // if(data.photo!==null){
        //   data.photo = convertImage(data.photo);
        //   setTakePhotos(oldarray => [...oldarray,data]);
        // }

   
          data.photo = convertImage(data.photo);
          setTakePhotos(oldarray => [...oldarray,data]);
        
        
        // take.push(data);
        // let obj;
        // if(photo!=null && user_id!=null){
        //     obj = {"user_id":user_id,"photo":photo}
        //     setTakePhotos(takePhotos,obj);
        // }
        // // console.log(user_id,photo)

        // // console.log(obj)
        // takePhoto.push(obj);
        // setTakePhotos(takePhotos+1);  
        // console.log(takePhotos);

        // takePhoto.push(data);

        // callback(data);
        
        // takeData(data);

        // dispatch(setPhotos(data));
        if (data.error === true) {
          alert("error asasd");
     
          return;
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

    // takePhoto.push(response);
    // console.log(takePhotos)
    // dispatch(setPhotos(takePhotos));
  },[])

  useEffect(() => {
    dispatch(setPhotos(takePhotos));
  },[takePhotos])


  function convertImage(src){
    if(src!=null){
      var image = new Image();
    image.src = 'data:image/jpeg;base64, '+src;
    return image.src;
    }else{
      return null;
    }
    

  }

  function showImages(){

  }


  return (
    <ul className="taskList">
      { tasks ?
        tasks.map((task) => (
        <Task task={task} key={task.id} />
      )) : null}
    </ul>
  );
};

export default TaskTable;
