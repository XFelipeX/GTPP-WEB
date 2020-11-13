import React,{useState, useEffect} from 'react'
import {useSelector, useDispatch} from 'react-redux';
import {updateTask, getCompanies,} from '../../redux'
import './style.css';
import api from '../../services/api';
import './style.css';

const TaskCompany = ({task}) => {
    const {permissions} = useSelector(state => state);
    const dispatch = useDispatch();

    const {tasks} = useSelector( state => state);
    const {stateUpdate} = useSelector(state => state);
    const {taskCompanies} = useSelector(state => state);

    async function showCompany() {
        
        const {data} = await api.get('Com_sho_dep_sub.php',{params:{AUTH:permissions.session, app_id:3}});
          
        dispatch(getCompanies(data.data));
        //console.log(taskCompanies);

    }


    useEffect(() => {
        showCompany();
      }, [stateUpdate]);
    
    

    return(
        <div className="containerCompany">
           
            <div className="company">
                {taskCompanies.map(company => {
                    <React.Fragment>
                    {tasks.map( task => {
                        <>
                    {company.id === task.comshopdepsub_id ? (
                        <h1>{company.company_name}</h1>
                    ): null}
                    </>
                   
                    })}
                    </React.Fragment>
                })}
            </div>
              
        </div>
    )
}

export default TaskCompany;

