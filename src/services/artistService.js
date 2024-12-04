const BASE_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080";

const getArtists = async (page , size ) => {
  try {
    const apiUrl = `${BASE_URL}/artists?page=${page}&size=${size}`;
    const response = await fetch(apiUrl, { method: "GET", headers: { "Content-Type": "application/json" } });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    if (!data.content) throw new Error("Invalid response structure");

    const artists = data.content.map(event => ({
      id: event.id || null,
      name: event.label || "Nom indisponible",
      eventsLabels: event.events?.map(e => e.label) || []
    }));

    return {
      artists,
      totalPages: data.totalPages || 0,
      totalElements: data.totalElements || 0,
      currentPage: data.number || 0
    };
  } catch (error) {
    console.error("Erreur lors de la récupération des artistes :", error.message);
    return null;
  }
};

const getSearchedArtists = async (searchName) => {
  try {
    // Récupération de tous les artistes depuis l'API
    const apiUrl = `${BASE_URL}/artists`;
    const response = await fetch(apiUrl, { method: "GET", headers: { "Content-Type": "application/json" } });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    if (!data.content) throw new Error("Invalid response structure");

    // Filtrage des artistes selon le searchName
    const filteredArtists = data.content.filter(artist => 
      artist.label && artist.label.toLowerCase().includes(searchName.toLowerCase())
    );

    return {
      artists: filteredArtists.map(artist => ({
        id: artist.id || null,
        name: artist.label || "Nom indisponible",
        eventsLabels: artist.events?.map(event => event.label) || []
      })),
      totalPages: data.totalPages || 0,
      totalElements: data.totalElements || 0,
      currentPage: data.number || 0
    };
  } catch (error) {
    console.error("Erreur lors de la recherche des artistes :", error.message);
    return null;
  }
};


const getArtistById = async (id,navigate) => {
  try {
    const apiUrl = `${BASE_URL}/artists/${id}`;
    const response = await fetch(apiUrl, { method: "GET", headers: { "Content-Type": "application/json" } });

    if (!response.ok) {
      if (response.status === 404 && navigate) {
        navigate("/*"); // Redirection vers PageNotFound
        return null;
      }
      const errorText = await response.text();
      throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
    }


    const data = await response.json();
    if (!data) throw new Error("Artist not found");

    return {
      id: data.id || null,
      name: data.label || "Nom indisponible",
      events: data.events?.map(event => ({
        id: event.id || null,
        label: event.label || "Label indisponible"
      })) || []
    };
  } catch (error) {
    console.error("Erreur lors de la récupération de l'artiste :", error.message);
    return null;
  }
};

const updateArtist = async (id, artistData) => {
  try {
    const apiUrl = `${BASE_URL}/artists/${id}`;
    const response = await fetch(apiUrl, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(artistData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'artiste :", error.message);
    throw error;
  }
};

const removeEventFromArtist = async (eventId, artistId) => {
  try {
    const apiUrl = `${BASE_URL}/events/${artistId}/artists/${eventId}`;
    const response = await fetch(apiUrl, { method: "DELETE" });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
    }

    return null;
  } catch (error) {
    console.error("Erreur lors de la suppression de l'artiste de l'événement :", error.message);
    throw error;
  }
};

const getAvailableArtistsForEvent = async (eventId) => {
  try {
    const eventApiUrl = `${BASE_URL}/artists/${eventId}`;
    const eventResponse = await fetch(eventApiUrl, { method: "GET", headers: { "Content-Type": "application/json" } });

    if (!eventResponse.ok) {
      const errorText = await eventResponse.text();
      throw new Error(`HTTP error! Status: ${eventResponse.status} - ${errorText}`);
    }

    const eventArtists = (await eventResponse.json()).events?.map(event => event.id) || [];

    const artistsApiUrl = `${BASE_URL}/events`;
    const artistsResponse = await fetch(artistsApiUrl, { method: "GET", headers: { "Content-Type": "application/json" } });

    if (!artistsResponse.ok) {
      const errorText = await artistsResponse.text();
      throw new Error(`HTTP error! Status: ${artistsResponse.status} - ${errorText}`);
    }

    const allEvents = (await artistsResponse.json()).content || [];
    return allEvents.filter(event => !eventArtists.includes(event.id)).map(event => ({
      id: event.id || null,
      label: event.label || "Label indisponible",
      artists: event.events || []
    }));
  } catch (error) {
    console.error("Erreur lors de la récupération des artistes disponibles :", error.message);
    return [];
  }
};

const addArtistToEvent = async (eventId, artistId) => {
  try {
    const apiUrl = `${BASE_URL}/events/${artistId}/artists/${eventId}`;
    const response = await fetch(apiUrl, { method: "POST", headers: { "Content-Type": "application/json" } });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
    }

    return response.status === 201 ? null : await response.json();
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'artiste à l'événement :", error.message);
    throw error;
  }
};

const addArtist = async (artist) => {
  try {
    const apiUrl = `${BASE_URL}/artists`;
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
    console.error("Erreur lors de l'ajout d'un artiste :", error.message);
    throw error;
  }
};


export default {
  getArtists,
  getSearchedArtists,
  getArtistById,
  updateArtist,
  removeEventFromArtist,
  getAvailableArtistsForEvent,
  addArtistToEvent,
  addArtist
};
