import React, { useState } from "react";
import "./style.css";
const TaskDate = ({ task }) => {
  // console.log(task);

  // const { permissions } = useSelector(state => state);
  const [open, setOpen] = useState(false);
  const initial_date = formatDate(task.initial_date);
  const final_date = formatDate(task.final_date);
  // const dispatch = useDispatch();

  function formatDate(props) {
   
    let data = props.split("-");
    // const date = new Date(props);
    var day = data[2];
    var month = data[1];
    var year = data[0];
    return day + "/" + month + "/" + year;
  }

  // function formatDate(props) {
  //   const date = new Date(props);
  //   var day = date.getDate();
  //   var month = date.getMonth();
  //   day++;
  //   if (day < 10) {
  //     day = "0" + day;
  //   }else if(day==32){
  //     day = "0"+1;
  //     if(month<12){
  //     month++;}else{
  //       month = 0;
  //     }
  //   }
    
  //   if(month<12){
  //     month++;}
  //   if (month < 10) {
  //     month = "0" + month;
  //   }
  //   var year = date.getFullYear();
  //   return day + "/" + month + "/" + year;
  // }

  //   let domNode = useClickOutside(() =>{
  //     setShow(false)
  //   })

  return (
    <div className="containerDate">
      <div className="initialDate">
        <h2>{initial_date}</h2>
      </div>

      <div onClick={() => setOpen(!open)} className="dataShow">
        <h2>{final_date}</h2>
      </div>
    </div>
  );
};

export default TaskDate;
