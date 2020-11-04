import api from '../../services/api';
 
 async function auth(user,password) {
    try {
      const {data} = await api.post('http://192.168.0.99:71/GLOBAL/Controller/Login.php?login', {
        "user": user,
        "password": password
      })
      if(data.error === true){
        alert(data.message)
        console.log('entrei no error')
        return false;
      }
      return true;
      
    } catch (error) {
        return false;
      alert("Usuario o senha incorretos")
    }
    
  }

  export default auth;


//   export const UserLogin = async (user,password) => {
//     try {
//       const {data} = await api.post('http://192.168.0.99:71/GLOBAL/Controller/Login.php?login', {
//         "user": document.getElementById('user_name').value,
//         "password": document.getElementById('password').value
//       })
//       if(data.error === true){
//         alert(data.message)
//         console.log('entrei no error')
//         return false;
//       }
//       return true;
      
//     } catch (error) {
//       alert("Usuario o senha incorretos")
//     }
    
//   }