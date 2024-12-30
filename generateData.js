const API_BASE_URL = "http://localhost:8080";

/**
 * Fonction pour créer un événement
 */
async function createEvent(label, startDate, endDate) {
  const response = await fetch(`${API_BASE_URL}/events`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ label, startDate, endDate }),
  });
  if (!response.ok) {
    throw new Error(`Erreur lors de la création de l'événement : ${response.statusText}`);
  }
  const event = await response.json();
  return event.id; // Retourne l'ID de l'événement créé
}

/**
 * Fonction pour créer un artiste
 */
async function createArtist(label) {
  const response = await fetch(`${API_BASE_URL}/artists`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ label }),
  });
  if (!response.ok) {
    throw new Error(`Erreur lors de la création de l'artiste : ${response.statusText}`);
  }
  const artist = await response.json();
  return artist.id; // Retourne l'ID de l'artiste créé
}

/**
 * Fonction pour associer un artiste à un événement
 */
async function associateArtistToEvent(eventId, artistId) {
  const response = await fetch(`${API_BASE_URL}/events/${eventId}/artists/${artistId}`, {
    method: "POST",
  });
  if (!response.ok) {
    throw new Error(`Erreur lors de l'association artiste-événement : ${response.statusText}`);
  }
}

const events = [
  { label: "Event 1", startDate: "2025-01-01", endDate: "2025-01-02" },
  { label: "Event 2", startDate: "2025-02-01", endDate: "2025-02-02" },
  { label: "Event 3", startDate: "2025-02-01", endDate: "2025-02-02" },
  { label: "Event 4", startDate: "2025-02-01", endDate: "2025-02-02" },
  { label: "Event 5", startDate: "2025-02-01", endDate: "2025-02-02" },
  { label: "Event 6", startDate: "2025-02-01", endDate: "2025-02-02" },
  { label: "Event 7", startDate: "2025-02-01", endDate: "2025-02-02" },
  { label: "Event 8", startDate: "2025-02-01", endDate: "2025-02-02" },
  { label: "Event 9", startDate: "2025-02-01", endDate: "2025-02-02" },
  { label: "Event 10", startDate: "2025-02-01", endDate: "2025-02-02" },
  { label: "Event 11", startDate: "2025-02-01", endDate: "2025-02-02" },
  { label: "Event 12", startDate: "2025-02-01", endDate: "2025-02-02" },
];
const artists = ["Artist 1", "Artist 2", "Artist 3","Artist 4", "Artist 5", "Artist 6","Artist 7", "Artist 8", "Artist 9"];

async function generateMassData() {
  try {
    const eventIds = [];
    for (const event of events) {
      const eventId = await createEvent(event.label, event.startDate, event.endDate);
      eventIds.push(eventId);
    }

    const artistIds = [];
    for (const artistLabel of artists) {
      const artistId = await createArtist(artistLabel);
      artistIds.push(artistId);
    }

    for (const eventId of eventIds) {
      for (const artistId of artistIds) {
        await associateArtistToEvent(eventId, artistId);
      }
    }

    console.log("Données générées avec succès !");
  } catch (error) {
    console.error("Erreur lors de la génération des données :", error);
  }
}

// Lancer la génération des données
generateMassData();
