import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Typography, Button, Box } from '@mui/material';

function PageNotFound() {
  return (
    <Container sx={{ textAlign: 'center', mt: 10 }}>
      <Typography variant="h1" component="h1" gutterBottom sx={{ fontSize: '6rem', fontWeight: 'bold', color: 'error.main' }}>
        404
      </Typography>
      <Typography variant="h4" component="h2" gutterBottom>
        Oups ! Page non trouvée
      </Typography>
      <Typography variant="body1" sx={{ mb: 4 }}>
        Il semble que la page que vous cherchez n'existe pas.
      </Typography>
      <Button variant="contained" color="primary" component={Link} to="/">
        Retourner à la page d'accueil
      </Button>
    </Container>
  );
}

export default PageNotFound;
