import React, { useState,useEffect } from "react";
import { useSelector,useDispatch } from "react-redux";
import "./style.css";
import lowPriority from '../../assets/Path1.png';
import medPriority from '../../assets/Path2.png';
import highPriority from '../../assets/Arrows.png';
import { updateTask } from "../../redux";
import useClickOutside from '../ClickOutside';
import { BiCommentAdd } from "react-icons/bi";

let CreateTask = () => {
  const dispatch = useDispatch();

  const [dateInitial, setDateInitial] = useState("");
  const [dateFinal, setDateFinal] = useState("");
  const [priority, setPriority] = useState("");
  const {permissions} = useSelector(state => state);

  const [open, setOpen] = useState(false);
  const [showPriority, setShowPriority] = useState(false);

  const auth = permissions.session;

  function showMenu() {
    setOpen(!open);
  }

  let domNode = useClickOutside(() =>{
    setOpen(false)
  })

  async function createTask() {
    let description = document.getElementById("taskDescription").value;

    if (description != '' && dateFinal != '' && dateInitial != '') {
      try {
        let data = {};

        (async () => {
          data = await fetch(
            "http://192.168.0.99:71/GLOBAL/Controller/GTPP/Task.php?AUTH=" +
              auth +
              "&mobile=1&app_id=3",
            {
              method: "post",
              body: JSON.stringify({
                description: description,
                priority: priority,
                initial_date: `${dateInitial}`,
                final_date: `${dateFinal}`,
              }),
            }
          )
            .then((response) => {
              return response.json();
            })
            .then((r) => {
              setOpen(false);
              dispatch(updateTask());
              return r;
            })

            console.log(data)
            
          if(data.error==true){
            let msg = data.message;

          if(msg.includes("Authorization denied")){
            alert("Autorização negada!")
          }else{
            alert(msg);
          }
          }
        })();
      } catch (error) {
       
        // console.log(error1.message);
      }
    }
  }

  let changePriority = (e) =>{
    let select = document.getElementById('selectOption');

    let selectValue = select.value;
    let selectText = select.innerHTML;
    
    let aux;

    aux = e.target.value;
    e.target.value = selectValue;
    select.value = aux;

    aux = e.target.innerHTML;
    e.target.innerText = selectText;
    select.innerHTML = aux;

    setShowPriority(false);
    setPriority(select.value);

  }

  return (
    <div ref={domNode} className="create-task-area">
      <ul onClick={() => showMenu()}><BiCommentAdd size={50} color="#959595"/></ul>

      {open ? (
        <li className="menuCreateTask">
          <label htmlFor="">Tarefa:</label>
          <input
            type="text"
            id="taskDescription"
            placeholder="Nome da tarefa"
          />
          <label htmlFor="">Data Ínicio</label>
          <input
            type="date"
            id="startDate"
            onChange={(e) => {
              setDateInitial(e.target.value);
            }}
          />
          <label htmlFor="">Data Fim</label>
          <input
            type="date"
            id="finalDate"
            onChange={(e) => {
              setDateFinal(e.target.value);
            }}
          />
          <label htmlFor="">Prioridade</label>
          <ul className="menuPriority">
            <li value="" onClick={() => setShowPriority(!showPriority)} id="selectOption">Selecione a prioridade</li>
            {showPriority ? (
              <>
              <li value="0" onClick={(e) => changePriority(e)}><img src={lowPriority} />Baixa</li>
            <li value="1" onClick={(e) => changePriority(e)}><img src={medPriority} />Média</li>
            <li value="2" onClick={(e) => changePriority(e)}><img src={highPriority} />Alta</li>
              </>
            )
             : null
            
            }
            
          </ul>
          <button type="button" onClick={createTask}>
            Criar
          </button>
        </li>
      ) : null}
    </div>
  );
};

export default CreateTask;
