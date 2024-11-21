import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import eventService from "../../services/eventService";
import { Typography, Box } from "@mui/material";

const EventDetails = () => {
  const { id } = useParams(); // Récupère l'ID depuis l'URL
  const [event, setEvent] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      const data = await eventService.getEventById(id); // Appel au service pour récupérer les détails
      setEvent(data);
    };

    fetchEvent();
  }, [id]);

  if (!event) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box m="1.5rem 2.5rem">
      <Typography variant="h4">{event.name}</Typography>
      <Typography variant="body1">
        <strong>Date de début :</strong> {event.dateDebut}
      </Typography>
      <Typography variant="body1">
        <strong>Date de fin :</strong> {event.dateFin}
      </Typography>
      <Typography variant="body1">
        <strong>Artistes :</strong> {event.artistesLabels.join(", ")}
      </Typography>
    </Box>
  );
};

export default EventDetails;
