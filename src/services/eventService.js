const getEvents = async (page = 0, size = 20) => {
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
      const errorText = await response.text();
      throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
    }

    // Clone pour déboguer la réponse brute
    const responseClone = response.clone();
    console.log("Réponse brute :", await responseClone.text());

    const data = await response.json();

    const events = data.content?.map(event => ({
      id: event.id || null,
      name: event.label || "Nom indisponible",
      dateDebut: event.startDate || null,
      dateFin: event.endDate || null,
      nombreArtistes: event.artists?.length || 0,
      artistesLabels: event.artists?.map(artist => artist.label) || [] // Récupération des labels des artistes
    })) || [];

    return {
      events,
      totalPages: data.totalPages,
      totalElements: data.totalElements,
      currentPage: data.number
    };
  } catch (error) {
    console.error("Erreur lors de la récupération des données :", error.message);
    return null;
  }
};

const getEventById = async  (id) => {
  const response = await fetch(`/api/events/${id}`);
  return response.json();
};

export default { getEvents, getEventById };
