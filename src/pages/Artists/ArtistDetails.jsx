import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
import artistService from "../../services/artistService";

const ArtistDetails = () => {
  const { id } = useParams(); // Récupération de l'ID depuis l'URL
  const [event, setEvent] = useState(null);
  const [availableArtists, setAvailableArtists] = useState([]);
  const [selectedArtist, setSelectedArtist] = useState("");

  // Récupération des détails de l'événement
  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventData = await artistService.getArtistById(id);
        setEvent(eventData);

        const available = await artistService.getAvailableArtistsForEvent(id);
        setAvailableArtists(available);
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
      }
    };

    fetchData();
  }, [id]);

  const handleAddArtist = async () => {
    if (!selectedArtist) {
      alert("Veuillez sélectionner un artiste.");
      return;
    }

    try {
      await artistService.addArtistToEvent(id, selectedArtist);

      // Mettre à jour les données après ajout
      const updatedEvent = await artistService.getArtistById(id);
      setEvent(updatedEvent);

      const updatedAvailable = await artistService.getAvailableArtistsForEvent(id);
      setAvailableArtists(updatedAvailable);

      // Réinitialiser la sélection
      setSelectedArtist("");

      alert("Artiste ajouté avec succès !");
    } catch (error) {
      console.error("Erreur lors de l'ajout d'un artiste :", error);
      alert("Impossible d'ajouter cet artiste.");
    }
  };

  const handleRemoveArtist = async (artistId) => {
    try {
      await artistService.removeEventFromArtist(id, artistId);

      // Mettre à jour les données après suppression
      const updatedEvent = await artistService.getArtistById(id);
      setEvent(updatedEvent);

      const updatedAvailable = await artistService.getAvailableArtistsForEvent(id);
      setAvailableArtists(updatedAvailable);

      alert("Artiste supprimé avec succès !");
    } catch (error) {
      console.error("Erreur lors de la suppression de l'artiste :", error);
      alert("Impossible de supprimer cet artiste.");
    }
  };

  if (!event) {
    return <Typography>Chargement...</Typography>;
  }

  // Validation du formulaire avec Yup
  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, "Le nom doit contenir au moins 3 caractères.")
      .required("Le nom est obligatoire."),
  });

  const handleSubmit = async (values) => {
    try {
      await artistService.updateArtist(id, {
        label: values.name,
      });

      const updatedEvent = await artistService.getArtistById(id);
      setEvent(updatedEvent);
      alert("Artiste mis à jour avec succès !");
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'artiste :", error);
      alert("Une erreur est survenue lors de la mise à jour.");
    }
  };

  return (
    <Box m="1.5rem 2.5rem">
      <Typography variant="h4">Détails de l'Artiste</Typography>

      {/* Formulaire avec Formik */}
      <Formik
        initialValues={{
          name: event.name || "",
        }}
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
                  <ErrorMessage
                    name="name"
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

      {/* Section des artistes associés */}
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

        {/* Ajouter un artiste */}
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

export default ArtistDetails;
