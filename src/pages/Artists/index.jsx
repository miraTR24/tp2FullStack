import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import {
  Box,
  Card,
  CardActions,
  CardContent,
  Button,
  TextField, 
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import artistService from "../../services/artistService"; 
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useNavigate } from "react-router-dom";

const Artists = ({
  id,
  name,
  eventsLabels = [],
}) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const goToDetails = () => {
    navigate(`/artist/${id}`);
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
        <Typography variant="body2" sx={{ fontSize: 14, marginTop: "1rem" }}>
          <strong>Events :</strong> {eventsLabels.slice(0, 3).join(", ")}
          {eventsLabels.length > 3 && " ..."}
        </Typography>
      </CardContent>
      <CardActions
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          padding: "0.75rem",
          borderTop: `1px solid ${theme.palette.divider}`,
        }}
      >
        <ArrowForwardIosIcon
          sx={{
            cursor: "pointer",
            color: theme.palette.primary.main,
            fontSize: 20,
          }}
          onClick={goToDetails}
        />
      </CardActions>
    </Card>
  );
};

const Accueil = () => {
  const [artists, setArtists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchName, setSearchName] = useState("");
  const artistsPerPage = 9;
  const theme = useTheme();
  const isNonMobile = useMediaQuery("(min-width: 1000px)");

  useEffect(() => {
    const fetchArtists = async () => {
      setIsLoading(true);
      const data = await artistService.getArtists(currentPage, artistsPerPage, searchName); 
      if (data) {
        setArtists(data.artists);
        setTotalPages(data.totalPages);
      }
      setIsLoading(false);
    };

    fetchArtists();
  }, [currentPage]);

  useEffect(() => {

    handleSearch();
  }, [searchName]);

  const handleSearch = async () => {
    setIsLoading(true);
    const data = await artistService.getSearchedArtists( searchName); // Ajout du paramètre de recherche
    if (data) {
      setArtists(data.artists);
      setTotalPages(data.totalPages);
    }
    setIsLoading(false);
    setCurrentPage(0); // Réinitialiser à la première page
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 0));

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="Look at our amazing Artists" />
      <hr style={{ border: `1px solid ${theme.palette.neutral.main}`, marginTop: "50px" }} />

      {/* Barre de recherche */}
      <Box
        display="flex"
        justifyContent="space-between"
        mt="1rem"
        mb="1rem"
      >
        <TextField
          label="Rechercher un artiste"
          variant="outlined"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          sx={{ flex: 1, marginRight: "1rem" }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSearch}
          sx={{ textTransform: "none" }}
        >
          Rechercher
        </Button>
      </Box>

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
          {artists.map((artist) => (
            <Artists key={artist.id} {...artist} />
          ))}
        </Box>
      ) : (
        <Typography>Loading...</Typography>
      )}

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "1rem",
        }}
      >
        <Button
          variant="contained"
          sx={{ marginRight: "0.5rem" }}
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
            sx={{ marginRight: "0.5rem" }}
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
