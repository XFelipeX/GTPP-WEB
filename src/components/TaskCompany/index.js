import react,{useState, useEffect} from 'react'
import {useSelector, useDispatch} from 'react-redux';
import {updateTask, getCompanies} from '../../redux'
import './style.css';
import loadCompanies from './functions'
import api from '../../services/api';

const TaskCompany = ({task}) => {
    const {permissions} = useSelector(state => state);
    const dispatch = useDispatch();

    const [companies, setCompanies] = useState([]);
    // const [open, setOpen] = useState(false);

    useEffect(() => {
        loadCompanies().then(response => {
            if(response.error === true){
                alert('error')
            }else{
                setCompanies(response.data);
            }
        });
    },[])

   

    return(
        <div>
            {companies.map(companie => 
                <li key={companie.id}>{companie.description}</li>
            )}
        </div>
    )
}

export default TaskCompany;