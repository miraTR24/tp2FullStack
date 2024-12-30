import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import {
  Box,
  Card,
  CardActions,
  CardContent,
  Collapse,
  Button,
  Typography,
  useTheme,
  useMediaQuery,
  Dialog,
  TextField,
  Snackbar,
  Alert
} from "@mui/material";
import eventService from "../../services/eventService"; 
import FlexBetween from "../../components/FlexBetween";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useNavigate } from "react-router-dom";

const Events = ({
  id, // Ajout de l'ID de l'événement
  name,
  dateDebut,
  dateFin,
  nombreArtistes,
  artistesLabels = [],
}) => {
  const theme = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate(); // Hook pour naviguer

  const goToDetails = () => {
    navigate(`/events/${id}`); // Redirection vers la page de détails
  };

  return (
    <Card
      sx={{
        backgroundImage: "none",
        backgroundColor: theme.palette.background.alt,
        borderRadius: "0.75rem",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        overflow: "hidden",
        cursor: "pointer",
      }}
      onClick={goToDetails} 
    >
      <CardContent>
        <Typography
          variant="h6"
          sx={{ fontSize: 18, fontWeight: "bold" }}
          color={theme.palette.text.primary}
          gutterBottom
        >
          {name}
        </Typography>
        <FlexBetween
          sx={{
            marginTop: "1rem",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <Typography
            variant="body1"
            sx={{ fontSize: 12, color: theme.palette.text.primary }}
          >
            <strong>Date de début :</strong> {dateDebut}
          </Typography>
          <Typography
            variant="body1"
            sx={{ fontSize: 12, color: theme.palette.text.primary }}
          >
            <strong>Date de fin :</strong> {dateFin}
          </Typography>
        </FlexBetween>
      </CardContent>
      <CardActions
        sx={{
          display: "flex",
          justifyContent: "space-between", 
          alignItems: "center",
          padding: "0.75rem",
          borderTop: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Button
          variant="contained"
          size="small"
          color="primary"
          onClick={(e) => {
            e.stopPropagation(); // Empêche le clic sur la carte de se propager
            setIsExpanded(!isExpanded);
          }}
          sx={{
            textTransform: "none",
            fontSize: 14,
            padding: "0.5rem 1.25rem",
            borderRadius: "0.5rem",
          }}
        >
          {isExpanded ? "Voir Moins" : "Voir Plus"}
        </Button>

        <ArrowForwardIosIcon
          sx={{
            cursor: "pointer",
            color: theme.palette.primary.main,
            fontSize: 20,
          }}
          onClick={goToDetails}
        />
      </CardActions>
      <Collapse
        in={isExpanded}
        timeout="auto"
        unmountOnExit
        sx={{
          backgroundColor: theme.palette.background.alt,
          padding: "1rem",
          color: theme.palette.text.secondary,
        }}
      >
        <CardContent>
          <Typography variant="body2" sx={{ fontSize: 14, marginBottom: "0.5rem" }}>
            <strong>Nombre d'artistes participent :</strong> {nombreArtistes}
          </Typography>
          <Typography variant="body2" sx={{ fontSize: 14 }}>
            <strong>Artistes :</strong> {artistesLabels.slice(0, 3).join(", ")}{artistesLabels.length > 3 && " ..."}
          </Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
};


const Accueil = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const eventsPerPage = 9; 
  const theme = useTheme();
  const isNonMobile = useMediaQuery("(min-width: 1000px)");
  const [openDialog, setOpenDialog] = useState(false);
  const [newEventName, setNewEventName] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [newEventStartDate, setNewEventStartDate] = useState("");
  const [newEventEndDate, setNewEventEndDate] = useState("");
  const [errors, setErrors] = useState({});
  const [isTouched, setIsTouched] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const navigate = useNavigate(); // Hook pour naviguer

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);

      const data = await eventService.getEvents( currentPage, eventsPerPage,navigate);
      if (data) {
        setEvents(data.events);
        setTotalPages(data.totalPages);
      }
      setIsLoading(false);
    };

    fetchEvents();
  }, [currentPage,refresh]);

  useEffect(() => {
    handleAddEvent();
  }, [refresh]);

  const validateFields = () => {
    const newErrors = {};
    if (!newEventName.trim()) {
      newErrors.name = "Le nom de l'événement est obligatoire.";
    }else if (newEventName.trim().length < 3) {
      newErrors.name="Le nom de l'artiste doit contenir au moins 3 lettres.";
    }
    if (!newEventStartDate) {
      newErrors.startDate = "La date de début est obligatoire.";
    }
    if (!newEventEndDate) {
      newErrors.endDate = "La date de fin est obligatoire.";
    } else if (new Date(newEventEndDate) < new Date(newEventStartDate)) {
      newErrors.endDate = "La date de fin doit être postérieure à la date de début.";
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
const handleAddEvent = async () => {
  setIsTouched(true); // Marque que le formulaire a été modifié
  if (!validateFields()) return; // Si des erreurs, arrête l'exécution

  try {
    const newEvent = await eventService.addEvent({
      label: newEventName,
      startDate: newEventStartDate,
      endDate: newEventEndDate,
    },navigate);
    if (newEvent) {
      setEvents((prev) => [...prev, newEvent]);
      setRefresh(!refresh);
      handleCloseDialog();
      setSnackbarMessage("Evenement ajouté avec succès !");
      setOpenSnackbar(true);
    }
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'événement :", error.message);
    setErrors((prev) => ({
      ...prev,
      global: "Une erreur s'est produite. Veuillez réessayer.",
    }));
  }
};
  


  
  

const handleOpenDialog = () => {
  setOpenDialog(true);
  setErrors({}); // Réinitialise les erreurs
  setIsTouched(false); // Réinitialise l'état "touché"
};
const handleCloseDialog = () => {
  setOpenDialog(false);
  setNewEventName("");
};

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 0));

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="Welcome to MyEvents" />
      <hr style={{ border: `1px solid ${theme.palette.neutral.main}`, marginTop: "50px" }} />

      <Box display="flex" justifyContent="flex-end" mb="1rem">
  <Button
    variant="contained"
    color="primary"
    onClick={handleOpenDialog}
    sx={{ textTransform: "none" }}
  >
    Ajouter un evenement
  </Button>
</Box>

<Dialog open={openDialog} onClose={handleCloseDialog}>
    <Box p="1.5rem" display="flex" flexDirection="column" gap="1rem">
      <Typography variant="h6">Ajouter un nouvel événement</Typography>
      {errors.global && (
        <Typography color="error" sx={{ fontSize: 14 }}>
          {errors.global}
        </Typography>
      )}
      <TextField
        label="Nom de l'événement"
        variant="outlined"
        value={newEventName}
        onChange={(e) => setNewEventName(e.target.value)}
        error={isTouched && !!errors.name}
        helperText={isTouched && errors.name}
      />
      <TextField
        label="Date de début"
        type="date"
        InputLabelProps={{ shrink: true }}
        variant="outlined"
        value={newEventStartDate}
        onChange={(e) => setNewEventStartDate(e.target.value)}
        error={isTouched && !!errors.startDate}
        helperText={isTouched && errors.startDate}
      />
      <TextField
        label="Date de fin"
        type="date"
        InputLabelProps={{ shrink: true }}
        variant="outlined"
        value={newEventEndDate}
        onChange={(e) => setNewEventEndDate(e.target.value)}
        error={isTouched && !!errors.endDate}
        helperText={isTouched && errors.endDate}
      />
      <Box display="flex" justifyContent="flex-end" gap="1rem">
        <Button onClick={handleCloseDialog} color="secondary">
          Annuler
        </Button>
        <Button onClick={handleAddEvent} variant="contained" color="primary">
          Ajouter
        </Button>
      </Box>
    </Box>
  </Dialog>

  <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity="success" variant="filled">
          {snackbarMessage}
        </Alert>
      </Snackbar>


      {!isLoading ? (
        <Box
          mt="20px"
          display="grid"
          gridTemplateColumns="repeat(3, minmax(0, 1fr))"
          justifyContent="space-between"
          rowGap="20px"
          columnGap="1.33%"
          sx={{
            "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
          }}
        >
          {events.map((event) => (
            <Events
              key={event.id}
              {...event}
            />
          ))}
        </Box>
      ) : (
        <Typography>Loading...</Typography>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '1rem' }}>
        <Button
          variant="contained"
          sx={{ marginRight: '0.5rem' }}
          disabled={currentPage === 0}
          onClick={prevPage}
        >
          Précédent
        </Button>
        {[...Array(totalPages).keys()].map((pageNumber) => (
          <Button
            key={pageNumber}
            variant={pageNumber === currentPage ? "contained" : "outlined"}
            onClick={() => paginate(pageNumber)}
            sx={{ marginRight: '0.5rem' }}
          >
            {pageNumber + 1}
          </Button>
        ))}
        <Button
          variant="contained"
          disabled={currentPage === totalPages - 1}
          onClick={nextPage}
        >
          Suivant
        </Button>
      </Box>

      <Box 
          sx={{
            mt:"50px",
            alignItems: "center",
            textAlign:"center"
          }}> 
        <p>Développé avec ❤️ par <span>Ines</span> et <span>Amira</span></p>
      </Box>
    </Box>
  );
};

export default Accueil;