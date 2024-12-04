import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Box,
  Select,
  MenuItem,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  TextField,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import eventService from "../../services/eventService";

const EventDetails = () => {
  const { id } = useParams(); // Récupère l'ID de l'événement depuis l'URL
  const [event, setEvent] = useState(null);
  const [artist, setArtist] = useState("");
  const [availableArtists, setAvailableArtists] = useState([]);
  const [selectedArtist, setSelectedArtist] = useState("");
  const navigate = useNavigate();

  // Récupération des détails de l'événement
  useEffect(() => {
    const fetchData = async () => {
      const eventData = await eventService.getEventById(id);
      setEvent(eventData);
      const data = await eventService.getAllArtists(id,navigate);
      setAvailableArtists(data);
    };

    fetchData();
  }, [id]);

  const handleAddArtist = async () => {
    if (!selectedArtist) {
      alert("Veuillez sélectionner un artiste.");
      return;
    }

    try {
      // Ajout de l'artiste à l'événement
      await eventService.addArtistToEvent(id, selectedArtist);

      // Mise à jour de l'événement 
      const updatedEvent = await eventService.getEventById(id);
      const data = await eventService.getEventById(id);
      setEvent(data);

      const data2 = await eventService.getAllArtists(id);
      setAvailableArtists(data2);

      // Réinitialisation de la sélection
      setSelectedArtist("");
    } catch (error) {
      console.error("Erreur lors de l'ajout d'un artiste :", error);
      alert("Impossible d'ajouter cet artiste.");
    }
  };

  const handleRemoveArtist = async (artistId) => {
    try {
      const updatedEvent = await eventService.removeArtistFromEvent(
        id,
        artistId
      );
      const data = await eventService.getEventById(id);
      setEvent(data);
      const data2 = await eventService.getAllArtists(id);
      setAvailableArtists(data2);
    } catch (error) {
      console.error("Erreur lors de la suppression de l'artiste :", error);
      alert("Impossible de supprimer cet artiste.");
    }
  };

  if (!event) {
    return <Typography>Loading...</Typography>;
  }

  // Validation avec Yup
  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, "Le nom doit contenir au moins 3 caractères.")
      .required("Le nom est obligatoire."),
    dateDebut: Yup.date()
      .min(new Date(), "La date de début doit être dans le futur.")
      .required("La date de début est obligatoire."),
    dateFin: Yup.date()
      .when("dateDebut", (dateDebut, schema) => {
        return schema.min(
          dateDebut,
          "La date de fin doit être postérieure ou égale à la date de début."
        );
      })
      .required("La date de fin est obligatoire."),
  });

  const handleSubmit = async (values) => {
    try {
      const updatedEvent = await eventService.updateEvent(id, {
        label: values.name,
        startDate: values.dateDebut,
        endDate: values.dateFin,
      });
      const data = await eventService.getEventById(id);
      setEvent(data); 
      alert("Événement mis à jour avec succès !");
    } catch (error) {
      alert("Une erreur est survenue lors de la mise à jour de l'événement.");
    }
  };

  return (
    <Box m="1.5rem 2.5rem">
      <Typography variant="h4">Détails de l'Événement</Typography>

      {/* Formulaire avec Formik */}
      <Formik
        initialValues={{
          name: event.name || "",
          dateDebut: event.dateDebut || "",
          dateFin: event.dateFin || "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, handleChange, handleBlur }) => (
          <Form>
            <Box mt="2rem">
              <Typography variant="h6">Modifier l'Événement</Typography>

              <Field
                as={TextField}
                fullWidth
                margin="normal"
                label="Nom"
                name="name"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.name}
                helperText={
                  <ErrorMessage
                    name="name"
                    component="span"
                    style={{ color: "red" }}
                  />
                }
              />

              <Field
                as={TextField}
                fullWidth
                margin="normal"
                type="date"
                label="Date de début"
                name="dateDebut"
                InputLabelProps={{ shrink: true }}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.dateDebut}
                helperText={
                  <ErrorMessage
                    name="dateDebut"
                    component="span"
                    style={{ color: "red" }}
                  />
                }
              />

              <Field
                as={TextField}
                fullWidth
                margin="normal"
                type="date"
                label="Date de fin"
                name="dateFin"
                InputLabelProps={{ shrink: true }}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.dateFin}
                helperText={
                  <ErrorMessage
                    name="dateFin"
                    component="span"
                    style={{ color: "red" }}
                  />
                }
              />

              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
              >
                Enregistrer les modifications
              </Button>
            </Box>
          </Form>
        )}
      </Formik>

      {/* Section des artistes */}
      <Box mt="3rem">
        <Typography variant="h6">Artistes Associés</Typography>
        <List>
          {event.artistes.map((artist, index) => (
            <ListItem
              key={index}
              secondaryAction={
                <IconButton
                  edge="end"
                  color="error"
                  onClick={() => handleRemoveArtist(artist.id)}
                >
                  <Delete />
                </IconButton>
              }
            >
              <ListItemText primary={artist.label} />
            </ListItem>
          ))}
        </List>

        {/* Sélection et ajout d'un artiste */}
        <Box mt="1rem">
          {availableArtists.length === 0 ? (
            <Typography>Aucun artiste disponible à ajouter.</Typography>
          ) : (
            <>
              <Select
                value={selectedArtist}
                onChange={(e) => setSelectedArtist(e.target.value)}
                displayEmpty
                fullWidth
              >
                <MenuItem value="" disabled>
                  Sélectionner un artiste
                </MenuItem>
                {availableArtists.map((artist) => (
                  <MenuItem key={artist.id} value={artist.id}>
                    {artist.label}
                  </MenuItem>
                ))}
              </Select>
              <Button
                variant="contained"
                color="primary"
                startIcon={<Add />}
                onClick={handleAddArtist}
                sx={{ mt: 1 }}
                disabled={!selectedArtist}
              >
                Ajouter
              </Button>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default EventDetails;
