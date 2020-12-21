import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import api from "../../services/api";
import "./style.css";
import userEmpty from '../../assets/nullphoto.jpeg';
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
  getVinculatedUsers,
  getUserPhotos,
} from "../../redux";
import Loading from "../Loading";

const TaskTable = () => {
  const { permissions } = useSelector((state) => state);
  const { stateUpdate } = useSelector((state) => state);
  const { visionMenu } = useSelector((state) => state);
  // const {updateTaskVisible} = useSelector(state => state);
  const { userPhotos } = useSelector((state) => state);
  const [ vinculatedUsers,setVinculatedUsers ] = useState([]);
  const [takePhotos, setTakePhotos] = useState([]);
  const { tasks } = useSelector((state) => state);

  const[loading,setLoading] = useState(true);

  const dispatch = useDispatch();


  useEffect(() => {
    loadTask(permissions, visionMenu).then((response) => {
      if (response.error === true) {
        alert("error");
      } else {
        // setTasks(response.data);
        try {
          // console.log(response)
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

  async function loadVinculateUsers() {
    const AUTH = permissions.session;

    const { data } = await api.get("CCPP/User.php?AUTH="+AUTH+"&app_id=3");
    // console.log(data);
    try {
      dispatch(getVinculatedUsers(data.data));
      setVinculatedUsers(data.data);
      // vinculatedUsers.map(user => user.photo = null);
      // dispatch(getVinculatedUsers(vinculatedUsers))
      // console.log(vinculatedUsers)
      // setVinculatedUsers(data.data);
    } catch (error) {
      
    }
 
  
  }

  // console.log(vinculatedUsers)

  useEffect(() => {
    loadVinculateUsers();
  }, []);

  const loadUserImages = async (idUser) => {
    if(idUser){
      const AUTH = sessionStorage.getItem("token");
      try {
        const { data } = await api.get(
          "http://192.168.0.99:71/GLOBAL/Controller/CCPP/EmployeePhoto.php?AUTH=" +
            AUTH +
            "&app_id=3&id=" +
            idUser
        );
  
     
  
        if (data) {
          // console.log(data);
          if(data.photo==null||data.photo==""){
            
            data.user_id = idUser;
            // console.log(data.user_id);
            data.photo = userEmpty;
            setTakePhotos((oldarray) => [...oldarray, data]);
      
           
          }else{
            data.photo = convertImage(data.photo);
            setTakePhotos((oldarray) => [...oldarray, data]);
       
          }
         
          
        }
        
        return data;
      } catch (error) {
        console.log(error);
      }
    }
   
  };

  useEffect(() => {
    // let count=0;
    
      vinculatedUsers.forEach((user) => {
        // let user = vinculatedUsers.users.filter(user => user.id == task.user_id);
  
        // if(user[0].photo==null){
        //   loadUserImages(task.user_id)
        // }
        
        // console.log(user)

        loadUserImages(user.id)
     
      
      });
    
   

  

  }, [vinculatedUsers]);

  setTimeout(() => {
    setLoading(false)
  },1000)

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
    loading==true ? <Loading/> : (
      <ul className="taskList">
      {tasks ? tasks.map((task) => <Task task={task} key={task.id} />) : null}
    </ul>
    )
   
  );
};

export default TaskTable;
