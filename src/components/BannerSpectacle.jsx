import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import FlexBetween from "./FlexBetween";

const BannerSpectacle = ({ showName, description, startDateTime, endDateTime, imageUrl }) => {
  const theme = useTheme();

  return (
    <Box
      justifyContent="space-between"
      flex="1 1 100%"
      backgroundColor={theme.palette.background.alt}
      width="100%"
      height={{ xs: "auto", sm: "300px", md: "250px" }}
      display="flex"
      flexDirection={{ xs: "column", sm: "row" }}
      alignItems={{ xs: "center", sm: "flex-start" }}
      padding={{ xs: "1rem", sm: "2rem", md: "3rem" }}
    >
      <Box
        width={{ xs: "100%", sm: "200px" }}
        height={{ xs: "auto", sm: "200px" }}
        marginBottom={{ xs: "2rem", sm: 0 }}
      >
        <img
          src={imageUrl}
          alt="Description de l'image"
          style={{ width: '100%', height: '100%' }}
        />
      </Box>
      
      <Box marginLeft={{ xs: 0, sm: "2rem" }} textAlign={{ xs: "center", sm: "left" }} flex="1">
        <Typography variant="h2" fontWeight="600" sx={{ color: theme.palette.secondary.alt, marginBottom: '1rem' }}>
          {showName}
        </Typography>
        <Typography variant="h4" sx={{ color: theme.palette.secondary[200], marginBottom: '1rem' }}>
          {description}
        </Typography>
        <FlexBetween flexDirection={{ xs: "column", sm: "row" }} width={{ xs: "40%", sm: "20%" }} alignItems={{xs:"center"}} >
          <Typography variant="h6" sx={{ color: theme.palette.secondary[200], marginBottom: { xs: '0.5rem', sm: 0 }, marginRight: { sm: '1rem' } }}>
            {startDateTime}
          </Typography>
          <Typography variant="h6" sx={{ color: theme.palette.secondary[200] }}>
            {endDateTime}
          </Typography>
        </FlexBetween>
      </Box>
    </Box>
  );
};

export default BannerSpectacle;
