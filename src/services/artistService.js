const getArtists = async (page = 0, size = 10) => {
    try {
      const BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8080';
      const apiUrl = `${BASE_URL}/artists?page=${page}&size=${size}`;
  
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        },
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
      }
  
      const data = await response.json();
  
      const artists = data.content?.map(event => ({
        id: event.id || null,
        name: event.label || "Nom indisponible",
        eventsLabels: event.events?.map(event => event.label) || [] 
      })) || [];
  
      return {
        artists,
        totalPages: data.totalPages,
        totalElements: data.totalElements,
        currentPage: data.number
      };
    } catch (error) {
      console.error("Erreur lors de la récupération des données :", error.message);
      return null;
    }
  };

  const getSearchedArtists = async ( searchName = "") => {
    try {
      const BASE_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080";
      const apiUrl = `${BASE_URL}/artists`;
  
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
      }
  
      const data = await response.json();
  
      // Filtrer les résultats localement par le nom si `searchName` est fourni
      let filteredArtists = data.content || [];
      if (searchName) {
        filteredArtists = filteredArtists.filter(artist =>
          artist.label.toLowerCase().includes(searchName.toLowerCase())
        );
      }
  
      return {
        artists: filteredArtists.map(event => ({
          id: event.id || null,
          name: event.label || "Nom indisponible",
          eventsLabels: event.events?.map(event => event.label) || [],
        })),
        totalPages: data.totalPages,
        totalElements: data.totalElements,
        currentPage: data.number,
      };
    } catch (error) {
      console.error("Erreur lors de la récupération des données :", error.message);
      return null;
    }
  };
  
  export default { getArtists,getSearchedArtists};