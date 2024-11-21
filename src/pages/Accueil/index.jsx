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
      }}
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
          justifyContent: "space-between", // Ajout de l'espace entre les éléments
          alignItems: "center",
          padding: "0.75rem",
          borderTop: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Button
          variant="contained"
          size="small"
          color="primary"
          onClick={() => setIsExpanded(!isExpanded)}
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
  const eventsPerPage = 20; // Correspond à la taille de page par défaut de l'API
  const theme = useTheme();
  const isNonMobile = useMediaQuery("(min-width: 1000px)");

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      const data = await eventService.getEvents( currentPage, eventsPerPage);
      if (data) {
        setEvents(data.events);
        setTotalPages(data.totalPages);
      }
      setIsLoading(false);
    };

    fetchEvents();
  }, [currentPage]);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 0));

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="Welcome to MyEvents" />
      <hr style={{ border: `1px solid ${theme.palette.neutral.main}`, marginTop: "50px" }} />

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
    </Box>
  );
};

export default Accueil;