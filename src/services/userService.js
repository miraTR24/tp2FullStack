const getUser = async (token) => {
    try {
      const apiUrl =`http://10.130.163.58:8080/api/account`;
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json(); 
      return data;
    } catch (error) {
      console.error("Erreur lors de la récupération des données :", error.message);
      return null;
    }
  };


 

  const changePassword = async (values,token) => {
    console.log("there"+JSON.stringify(values));
    const url = `http://10.130.163.58:8080/api/account/change-password`;
    console.log(url);
    const Response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(values),
    });
    return await Response.json(); // Retournez les données JSON de la réponse
  };
  
  const changeUserData = async (values,token) => {
    console.log("there"+JSON.stringify(values));
    const url = `http://10.130.163.58:8080/api/account`;
    console.log(url);
    const Response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(values),
    });
    return await Response.json(); // Retournez les données JSON de la réponse
  };


  const getReservation = async (token, userId) => {
    try {
        const apiUrl = `http://10.130.163.58:8080/api/reservations?userId=${userId}`;
        const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Erreur lors de la récupération des données :", error.message);
        return null;
    }
};
  
  export default { getUser ,changePassword,getReservation,changeUserData}; 