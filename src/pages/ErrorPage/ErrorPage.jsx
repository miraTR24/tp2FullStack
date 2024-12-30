import { useLocation } from "react-router-dom";
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Typography,
  Box,
  Button,
} from "@mui/material";

const ErrorPage = ({
  errorMessage = "Une erreur est survenue. Veuillez réessayer plus tard."
}) => {
  const location = useLocation();
  const errorCode = location.state?.errorCode || 500;
  const navigate = useNavigate();

  return (
    <Box textAlign="center" mt="5rem">
      <Typography variant="h4" color="error">
        Erreur {errorCode}
      </Typography>
      <Typography variant="h6" mt="1rem">
        {errorMessage}
      </Typography>
      <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={() => navigate("/")}>
        Recharger la page
      </Button>
    </Box>
  );
};

export default ErrorPage;
