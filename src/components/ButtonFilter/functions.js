import api from '../../services/api';

export const loadShopsCompany = async (idCompany, auth) => {
    const AUTH = auth;
  
    try {
      const { data } = await api.get(
        "CCPP/Shop.php?AUTH=" + AUTH + "&app_id=3&company_id=" + idCompany
      );
  
      // console.log(data);
      return data;
    } catch (error) {
      console.log(error.message);
      return [{}];
    }
  };
  
  export const loadDeptsCompany = async (idCompany, idShop, auth) => {
    const AUTH = auth;
  
    try {
      const { data } = await api.get(
        "CCPP/Department.php?AUTH=" +
          AUTH +
          "&app_id=3&company_id=" +
          idCompany +
          "&shop_id=" +
          idShop
      );
  
      // console.log(data.data);
      return data.data;
    } catch (error) {
      console.log(error.message);
      return [{}];
    }
  };