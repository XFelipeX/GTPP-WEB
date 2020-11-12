import api from '../../services/api';

const loadCompanies = async () => {
    const AUTH = sessionStorage.getItem('token');

    try{
        const {data} = await api.get('Company.php',{params:{AUTH:AUTH, app_id:3}});
        console.log(data);
        return data;
    }catch(error){
        return [{}];
    }
}

export default loadCompanies;