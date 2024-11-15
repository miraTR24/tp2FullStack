const getSpectacle = async (token) => {
    try {
      const apiUrl =`http://10.130.163.58:8080/api/spectacles`;
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
  const getSpectacleById = async (token,id) => {
    try {
      const apiUrl =`http://10.130.163.58:8080/api/spectacles/${id}`;
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

  const getSpectaclesWithFavorites = async (token) => {
    try {
      const apiUrlSpectacles = 'http://10.130.163.58:8080/api/spectacles';
      const apiUrlFavorites = 'http://10.130.163.58:8080/api/favorite-spectacles';
  
      // Fetch both spectacles and favorites
      const [spectaclesResponse, favoritesResponse] = await Promise.all([
        fetch(apiUrlSpectacles, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        }),
        fetch(apiUrlFavorites, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        })
      ]);
  
      // Check for errors in responses
      if (!spectaclesResponse.ok) {
        throw new Error(`HTTP error! Status: ${spectaclesResponse.status}`);
      }
      if (!favoritesResponse.ok) {
        throw new Error(`HTTP error! Status: ${favoritesResponse.status}`);
      }
  
      // Extract data from responses
      const spectaclesData = await spectaclesResponse.json();
      const favoritesData = await favoritesResponse.json();
  
      // Mark favorites in spectacles data and add favoriteId
      const spectaclesWithFavorites = spectaclesData.map(spectacle => {
        const favorite = favoritesData.find(favorite => favorite.spectacleId === spectacle.id);
        return {
          ...spectacle,
          isFavoris: !!favorite,
          favoriteId: favorite ? favorite.id : null
        };
      });
  
      return spectaclesWithFavorites;
    } catch (error) {
      console.error('Erreur lors de la récupération des données :', error.message);
      return null;
    }
  };
  
  
  
  export default { getSpectacle ,getSpectacleById,getSpectaclesWithFavorites}; 