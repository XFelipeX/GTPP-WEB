import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import api from "../../services/api";
import "./style.css";
import userEmpty from "../../assets/nullphoto.jpeg";
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
  getVinculatedUsers,
  getTaskFilter,
} from "../../redux";
import Loading from "../Loading";

const TaskTable = (props) => {
  const { permissions } = useSelector((state) => state);
  const { filterTask } = useSelector((state) => state);
  const { stateAdmin } = useSelector((state) => state);
  const { seeAdminSet } = useSelector((state) => state);
  const AUTH = permissions.session;
  const { stateUpdate } = useSelector((state) => state);
  const { visionMenu } = useSelector((state) => state);
  // const {updateTaskVisible} = useSelector(state => state);
  // const { userPhotos } = useSelector((state) => state);
  const [vinculatedUsers, setVinculatedUsers] = useState([]);
  const [takePhotos, setTakePhotos] = useState([]);
  const { tasks } = useSelector((state) => state);

  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();

  useEffect(() => {
    loadTask(visionMenu, AUTH).then((response) => {
      if (response.error === true) {
        // alert(response.error);
      } else {
        // setTasks(response.data);
        try {
          // console.log(response.data)
          dispatch(getTask(response.data));
        } catch (error) {}
      }
    });
  }, [stateUpdate]);

  useEffect(() => {
    async function loadAllTasks() {
      const AUTH = permissions.session;

      try {
        const { data } = await api.get(
          "GTPP/Task.php?AUTH=" + AUTH + "&app_id=3&administrator=1"
        );

        if (data.error === true) {
          return null;
        }

        return data.data;
      } catch (error) {
        return null;
      }
    }
    if (seeAdminSet === true) {
     
      loadAllTasks().then((response) => dispatch(getTask(response)));
    }
  }, [stateAdmin]);

  function taskFilter() {
    let filter = tasks.filter(
      (task) =>
        task.state_id == 1 ||
        task.state_id == 2 ||
        task.state_id == 3 ||
        task.state_id == 4 ||
        task.state_id == 5
    );

    // console.log(filter)
    dispatch(getTaskFilter(filter));
  }

  useEffect(() => {
    tasks.map(
      (task) =>
        (task.notifications = [
          { type: "messages", amount: 0, message: "" },
          { type: "priority", amount: 0, message: "" },
          { type: "state", amount: 0, message: "" },
          { type: "description", amount: 0, message: "" },
          { type: "itens", amount: 0, message: "" },
          { type: "users", amount: 0, message: "" },
          { amount: 0 },
        ],
        task.warning = { expire: 0, due_date: 0, initial: 0 })
        
        
    );
    // console.log(filterTask.length)
    if (filterTask.filter.length == 0) {
      taskFilter();
    }
  }, [tasks]);


  useEffect(() => {
    loadCompanies(AUTH).then((response) => {
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
    loadShop(AUTH).then((response) => {
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
    loadTaskStates(AUTH).then((response) => {
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
    loadDept(AUTH).then((response) => {
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
    // const AUTH = permissions.session;

    const { data } = await api.get("CCPP/User.php?AUTH=" + AUTH + "&app_id=3");
    // console.log(data);
    try {
      dispatch(getVinculatedUsers(data.data));
      setVinculatedUsers(data.data);
      // vinculatedUsers.map(user => user.photo = null);
      // dispatch(getVinculatedUsers(vinculatedUsers))
      // console.log(vinculatedUsers)
      // setVinculatedUsers(data.data);
    } catch (error) {}
  }

  // console.log(vinculatedUsers)

  useEffect(() => {
    loadVinculateUsers();
  }, []);

  const loadUserImages = async (idUser) => {
    if (idUser) {
      // const AUTH = sessionStorage.getItem("token");
      try {
        const { data } = await api.get(
          "http://192.168.0.99:71/GLOBAL/Controller/CCPP/EmployeePhoto.php?AUTH=" +
            AUTH +
            "&app_id=3&id=" +
            idUser
        );

        if (data) {
          // console.log(data);
          if (data.photo == null || data.photo == "") {
            data.user_id = idUser;
            // console.log(data.user_id);
            data.photo = userEmpty;
            setTakePhotos((oldarray) => [...oldarray, data]);
          } else {
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

      loadUserImages(user.id);
    });
  }, [vinculatedUsers]);

  setTimeout(() => {
    setLoading(false);
  }, 1000);

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

  // console.log(filterTask);

  return loading == true ? (
    <Loading />
  ) : (
    <ul className="taskList">
      {/* {tasks ? tasks.map((task) => <Task task={task} key={task.id} />) : null} */}
      {filterTask.filter
        ? filterTask.filter.map((task) => (
            <Task websocket={props} task={task} key={task.id} />
          ))
        : null}
    </ul>
  );
};

export default TaskTable;
