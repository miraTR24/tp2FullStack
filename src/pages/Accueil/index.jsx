import React,{useState, useEffect} from "react";
import Header from "../../components/Header";

import {
  Box,
  Button,
  Typography,
  useTheme,
  useMediaQuery,
  TextField,
  Autocomplete
} from "@mui/material";





const Accueil = () => {
  const theme = useTheme();
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");


  const [spectacles, setSpectacles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [spectaclesPerPage] = useState(12);

  useEffect(() => {
    
  }, []);

  const indexOfLastSpectacle = currentPage * spectaclesPerPage;
  const indexOfFirstSpectacle = indexOfLastSpectacle - spectaclesPerPage;
  const currentSpectacles = spectacles.slice(indexOfFirstSpectacle, indexOfLastSpectacle);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage(currentPage + 1);
  const prevPage = () => setCurrentPage(currentPage - 1);

  return (
    <Box m="1.5rem 2.5rem">
      
      <Header title="Welcome to MyEvents" />
      <hr style={{ border: '1px solid theme.palette.neutral.main ',marginTop:"50px"  }} />

      <Box
        mt="20px"
        display="grid"
        gridTemplateColumns="repeat(8, 1fr)"
        gridAutoRows="160px"
        gap="20px"
        sx={{
          "& > div": { gridColumn: isNonMediumScreens ? undefined : "span 12" },
        }}
      >

      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '1rem' }}>
  <Button
    variant="contained"
    sx={{
     marginRight: '0.5rem'
    }}
    disabled={currentPage === 1}
    onClick={prevPage}
  >
    Précédent
  </Button>
  {[...Array(Math.ceil(spectacles.length / spectaclesPerPage)).keys()].map((pageNumber) => (
    <Button
      key={pageNumber}
      variant={pageNumber + 1 === currentPage ? "contained" : "outligned"}
      onClick={() => paginate(pageNumber + 1)}
      sx={{ marginRight: '0.5rem', }}
    >
      {pageNumber + 1}
    </Button>
  ))}
  <Button
    variant="contained"
    disabled={currentSpectacles.length < spectaclesPerPage}
    onClick={nextPage}
  >
    Suivant
  </Button>
</Box>

    

    </Box>
  );
};

export default Accueil;
