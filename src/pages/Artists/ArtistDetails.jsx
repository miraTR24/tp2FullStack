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
import artistService from "../../services/artistService";

const ArtistDetails = () => {
  const { id } = useParams(); // Récupération de l'ID depuis l'URL
  const [event, setEvent] = useState(null);
  const [availableArtists, setAvailableArtists] = useState([]);
  const [selectedArtist, setSelectedArtist] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const navigate = useNavigate();

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  // Récupération des détails de l'événement
  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventData = await artistService.getArtistById(id, navigate);
        setEvent(eventData);

        const available = await artistService.getAvailableArtistsForEvent(id, navigate);
        setAvailableArtists(available);
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
      await artistService.addArtistToEvent(id, selectedArtist, navigate);

      const updatedEvent = await artistService.getArtistById(id, navigate);
      setEvent(updatedEvent);

      const updatedAvailable = await artistService.getAvailableArtistsForEvent(id, navigate);
      setAvailableArtists(updatedAvailable);

      setSelectedArtist("");
      showSnackbar("Artiste ajouté avec succès !");
    } catch (error) {
      console.error("Erreur lors de l'ajout d'un artiste :", error);
      showSnackbar("Impossible d'ajouter cet artiste.", "error");
    }
  };

  const handleRemoveArtist = async (artistId) => {
    try {
      await artistService.removeEventFromArtist(id, artistId, navigate);

      const updatedEvent = await artistService.getArtistById(id, navigate);
      setEvent(updatedEvent);

      const updatedAvailable = await artistService.getAvailableArtistsForEvent(id, navigate);
      setAvailableArtists(updatedAvailable);

      showSnackbar("Artiste supprimé avec succès !");
    } catch (error) {
      console.error("Erreur lors de la suppression de l'artiste :", error);
      showSnackbar("Impossible de supprimer cet artiste.", "error");
    }
  };

  const handleSubmit = async (values) => {
    try {
      await artistService.updateArtist(id, { label: values.name }, navigate);

      const updatedEvent = await artistService.getArtistById(id, navigate);
      setEvent(updatedEvent);
      showSnackbar("Artiste mis à jour avec succès !");
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'artiste :", error);
      showSnackbar("Une erreur est survenue lors de la mise à jour.", "error");
    }
  };

  const handleDeleteArtist = async () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet artiste ?")) {
      try {
        await artistService.deleteArtist(id, navigate);
        showSnackbar("Artiste supprimé avec succès !");
        navigate("/Artistes");
      } catch (error) {
        showSnackbar("Une erreur est survenue lors de la suppression de l'artiste.", "error");
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
  });

  return (
    <Box m="1.5rem 2.5rem">
      <Typography variant="h4">Détails de l'Artiste</Typography>
      <Box mt="2rem" sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          color="error"
          startIcon={<Delete />}
          onClick={handleDeleteArtist}
        >
          Supprimer l'Artiste
        </Button>
      </Box>

      <Formik
        initialValues={{ name: event.name || "" }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, handleChange, handleBlur }) => (
          <Form>
            <Box mt="2rem">
              <Typography variant="h6">Modifier l'Artiste</Typography>
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
                  <ErrorMessage name="name" component="span" style={{ color: "red" }} />
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
          {event.events.map((artist) => (
            <ListItem
              key={artist.id}
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

      {/* Snackbar pour les notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ArtistDetails;
