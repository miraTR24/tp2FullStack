import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  Snackbar,
  Alert,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import eventService from "../../services/eventService";

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [availableArtists, setAvailableArtists] = useState([]);
  const [selectedArtist, setSelectedArtist] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  // Récupération des données
  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventData = await eventService.getEventById(id, navigate);
        setEvent(eventData);

        const artists = await eventService.getAllArtists(id, navigate);
        setAvailableArtists(artists);
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
        showSnackbar("Erreur lors du chargement des données.", "error");
      }
    };

    fetchData();
  }, [id, navigate]);

  const handleAddArtist = async () => {
    if (!selectedArtist) {
      showSnackbar("Veuillez sélectionner un artiste.", "warning");
      return;
    }

    try {
      await eventService.addArtistToEvent(id, selectedArtist,navigate);

      const updatedEvent = await eventService.getEventById(id,navigate);
      setEvent(updatedEvent);

      const updatedArtists = await eventService.getAllArtists(id,navigate);
      setAvailableArtists(updatedArtists);

      setSelectedArtist("");
      showSnackbar("Artiste ajouté avec succès !");
    } catch (error) {
      console.error("Erreur lors de l'ajout d'un artiste :", error);
      showSnackbar("Impossible d'ajouter cet artiste.", "error");
    }
  };

  const handleRemoveArtist = async (artistId) => {
    try {
      await eventService.removeArtistFromEvent(id, artistId,navigate);

      const updatedEvent = await eventService.getEventById(id,navigate);
      setEvent(updatedEvent);

      const updatedArtists = await eventService.getAllArtists(id,navigate);
      setAvailableArtists(updatedArtists);

      showSnackbar("Artiste supprimé avec succès !");
    } catch (error) {
      console.error("Erreur lors de la suppression de l'artiste :", error);
      showSnackbar("Impossible de supprimer cet artiste.", "error");
    }
  };

  const handleSubmit = async (values) => {
    try {
      await eventService.updateEvent(id, {
        label: values.name,
        startDate: values.dateDebut,
        endDate: values.dateFin,
      },navigate);

      const updatedEvent = await eventService.getEventById(id,navigate);
      setEvent(updatedEvent);
      showSnackbar("Événement mis à jour avec succès !");
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'événement :", error);
      showSnackbar("Une erreur est survenue lors de la mise à jour.", "error");
    }
  };

  const handleDeleteEvent = async () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet événement ?")) {
      try {
        await eventService.deleteEvent(id,navigate);
        showSnackbar("Événement supprimé avec succès !");
        navigate("/");
      } catch (error) {
        console.error("Erreur lors de la suppression de l'événement :", error);
        showSnackbar("Une erreur est survenue lors de la suppression.", "error");
      }
    }
  };

  if (!event) {
    return <Typography>Chargement...</Typography>;
  }

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

  return (
    <Box m="1.5rem 2.5rem">
      <Typography variant="h4">Détails de l'Événement</Typography>

      <Box mt="2rem" sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          color="error"
          startIcon={<Delete />}
          onClick={handleDeleteEvent}
        >
          Supprimer l'Événement
        </Button>
      </Box>

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

      <Box mt="3rem">
        <Typography variant="h6">Artistes Associés</Typography>
        <List>
          {event.artistes.map((artist) => (
            <ListItem key={artist.id} secondaryAction={<IconButton color="error" onClick={() => handleRemoveArtist(artist.id)}><Delete /></IconButton>}>
              <ListItemText primary={artist.label} />
            </ListItem>
          ))}
        </List>

        <Box mt="1rem">
          {availableArtists.length === 0 ? (
            <Typography>Aucun artiste disponible à ajouter.</Typography>
          ) : (
            <>
              <Select value={selectedArtist} onChange={(e) => setSelectedArtist(e.target.value)} fullWidth>
                <MenuItem value="" disabled>Sélectionner un artiste</MenuItem>
                {availableArtists.map((artist) => (
                  <MenuItem key={artist.id} value={artist.id}>{artist.label}</MenuItem>
                ))}
              </Select>
              <Button variant="contained" color="primary" startIcon={<Add />} onClick={handleAddArtist} sx={{ mt: 1 }} disabled={!selectedArtist}>
                Ajouter
              </Button>
            </>
          )}
        </Box>
      </Box>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EventDetails;
