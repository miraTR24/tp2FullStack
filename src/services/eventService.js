const getEvents = async (page = 0, size = 10,navigate) => {
  try {
    const BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8080';
    const apiUrl = `${BASE_URL}/events?page=${page}&size=${size}`;

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
    });

    if (!response.ok) {
      if (response.status === 500 && navigate) {
        navigate("/error"); // Redirige vers la page d'erreur
      }
      const errorText = await response.text();
      throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    const events = data.content?.map(event => ({
      id: event.id || null,
      name: event.label || "Nom indisponible",
      dateDebut: event.startDate || null,
      dateFin: event.endDate || null,
      nombreArtistes: event.artists?.length || 0,
      artistesLabels: event.artists?.map(artist => artist.label) || [] 
    })) || [];

    return {
      events,
      totalPages: data.totalPages,
      totalElements: data.totalElements,
      currentPage: data.number
    };
  } catch (error) {
    if (error.message.includes("Failed to fetch")) {
      console.error("Serveur inaccessible. Vérifiez que le backend est en cours d'exécution.");
      navigate("/erreur", { state: { errorCode: "CONN_REFUSED", errorMessage: "Connexion refusée au serveur." } });
    } else {
      console.error("Erreur inconnue :", error.message);
    }
  }
};

const getEventById = async (id, navigate) => {
  try {
    const BASE_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080";
    const apiUrl = `${BASE_URL}/events/${id}`;

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status !== 200 && navigate) {
        navigate("/*"); // Redirection vers PageNotFound
        return null;
      }
      const errorText = await response.text();
      throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    return {
      id: data.id || null,
      name: data.label || "Nom indisponible",
      dateDebut: data.startDate || null,
      dateFin: data.endDate || null,
      nombreArtistes: data.artists?.length || 0,
      artistes: data.artists?.map((artist) => ({
        id: artist.id || null,
        label: artist.label || "Label indisponible",
      })) || [],
    };
  } catch (error) {
    if (error.message.includes("Failed to fetch")) {
      console.error("Serveur inaccessible. Vérifiez que le backend est en cours d'exécution.");
      navigate("/erreur", { state: { errorCode: "CONN_REFUSED", errorMessage: "Connexion refusée au serveur." } });
    } else {
      console.error("Erreur inconnue :", error.message);
    }
  }
};

const updateEvent = async (id, eventData,navigate) => {
  try {

    const BASE_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080";
    const apiUrl = `${BASE_URL}/events/${id}`;
    
    const response = await fetch(apiUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(eventData), // Conversion des données en JSON
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
    }

    const updatedEvent = await response.json(); // Récupère les données mises à jour
    return updatedEvent;
  } catch (error) {
    if (error.message.includes("Failed to fetch")) {
      console.error("Serveur inaccessible. Vérifiez que le backend est en cours d'exécution.");
      navigate("/erreur", { state: { errorCode: "CONN_REFUSED", errorMessage: "Connexion refusée au serveur." } });
    } else {
      console.error("Erreur inconnue :", error.message);
    }
  }
};

const removeArtistFromEvent = async (eventId, artistId,navigate) => {
  try {
    const BASE_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080";
    const apiUrl = `${BASE_URL}/events/${eventId}/artists/${artistId}`;

    const response = await fetch(apiUrl, {
      method: 'DELETE',
    });

    // Vérifier le statut de la réponse
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erreur HTTP ! Status: ${response.status} - ${errorText}`);
    }

    return null; 
  } catch (error) {
    if (error.message.includes("Failed to fetch")) {
      console.error("Serveur inaccessible. Vérifiez que le backend est en cours d'exécution.");
      navigate("/erreur", { state: { errorCode: "CONN_REFUSED", errorMessage: "Connexion refusée au serveur." } });
    } else {
      console.error("Erreur inconnue :", error.message);
    }
  }
};

const getAllArtists = async (eventId,navigate) => {
  try {
    const BASE_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080";
    
    const eventApiUrl = `${BASE_URL}/events/${eventId}`;
    const eventResponse = await fetch(eventApiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!eventResponse.ok) {
      const errorText = await eventResponse.text();
      throw new Error(`Erreur HTTP lors de la récupération de l'événement : ${eventResponse.status} - ${errorText}`);
    }

    const eventData = await eventResponse.json();
    const eventArtists = eventData.artists?.map(artist => artist.id) || [];
    // récupérer tous les artistes
    const apiUrl = `${BASE_URL}/artists`;
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erreur HTTP lors de la récupération des artistes : ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const artists = data.content || [];
    // Filtrer les artistes déjà associés à l'événement
    const availableArtists = artists.filter(artist => !eventArtists.includes(artist.id));
    return availableArtists.map(artist => ({
      id: artist.id || null,
      label: artist.label || "Label indisponible",
      events: artist.events || [],
    }));

  } catch (error) {
    if (error.message.includes("Failed to fetch")) {
      console.error("Serveur inaccessible. Vérifiez que le backend est en cours d'exécution.");
      navigate("/erreur", { state: { errorCode: "CONN_REFUSED", errorMessage: "Connexion refusée au serveur." } });
    } else {
      console.error("Erreur inconnue :", error.message);
    }
  }
};



const addArtistToEvent = async (eventId, artistId,navigate) => {
  try {
    const BASE_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080";
    const apiUrl = `${BASE_URL}/events/${eventId}/artists/${artistId}`;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
    }

    // Vérifier si le statut est 201 (Created) 
    if (response.status === 201) {
      return null; // Aucun contenu à traiter
    }

    const updatedEvent = await response.json();
    return updatedEvent;

  } catch (error) {
    if (error.message.includes("Failed to fetch")) {
      console.error("Serveur inaccessible. Vérifiez que le backend est en cours d'exécution.");
      navigate("/erreur", { state: { errorCode: "CONN_REFUSED", errorMessage: "Connexion refusée au serveur." } });
    } else {
      console.error("Erreur inconnue :", error.message);
    }
  }
};

const addEvent = async (artist,navigate) => {
  try {
    const BASE_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080";
    const apiUrl = `${BASE_URL}/events`;
    console.log("data=> ",artist);
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(artist),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    if (error.message.includes("Failed to fetch")) {
      console.error("Serveur inaccessible. Vérifiez que le backend est en cours d'exécution.");
      navigate("/erreur", { state: { errorCode: "CONN_REFUSED", errorMessage: "Connexion refusée au serveur." } });
    } else {
      console.error("Erreur inconnue :", error.message);
    }
  }
};

const deleteEvent = async (id,navigate) => {
  try {
    const BASE_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080";
    const apiUrl = `${BASE_URL}/events/${id}`;

    const response = await fetch(apiUrl, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
    }

    return true; // Retourne true si la suppression est réussie
  } catch (error) {
    if (error.message.includes("Failed to fetch")) {
      console.error("Serveur inaccessible. Vérifiez que le backend est en cours d'exécution.");
      navigate("/erreur", { state: { errorCode: "CONN_REFUSED", errorMessage: "Connexion refusée au serveur." } });
    } else {
      console.error("Erreur inconnue :", error.message);
    }
  }
};




export default { getEvents, getEventById ,updateEvent,removeArtistFromEvent,getAllArtists,addArtistToEvent,addEvent,deleteEvent};
