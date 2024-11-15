import React, { useState } from 'react';
import { Drawer, Box, Typography, IconButton, Divider, TextField, Button, Accordion, AccordionSummary, AccordionDetails } from '@mui/material'; // Importez les composants nécessaires depuis MUI
import { AccountCircle, Close, ExpandMore } from '@mui/icons-material'; // Importez les icônes nécessaires depuis MUI
import { Formik } from 'formik'; // Importez Formik si vous l'utilisez
import * as Yup from 'yup'; // Importez Yup pour la validation des formulaires
import userService from "../services/userService";
import { useSelector } from "react-redux";
const validationSchema = Yup.object().shape({
  password: Yup.string().required('Mot de passe requis'),
  newPassword: Yup.string().required('Nouveau mot de passe requis'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword'), null], 'Les mots de passe doivent correspondre')
    .required('Confirmation du mot de passe requis'),
});

const FenetreMenuGaucheCard = ({ open, handle_Close, handleSubmit, utiliseur }) => {
  const [passwordAccordionOpen, setPasswordAccordionOpen] = useState(false);
  const token = useSelector((state) => state.token);
  const handleClick = async (values, onSubmitProps) => {
    try {
      const { confirmPassword, ...valuesToSend } = values;
      console.log("hhhhhhhhhhhhhhhh"+values.password);
      const response = await userService.changePassword(valuesToSend, token);
  
      // Vérifiez si la réponse indique que le mot de passe a été modifié avec succès
      if (response && response.success) {
        onSubmitProps.resetForm();
      } else {
        console.error("Error changing password: Invalid response format");
      }
    } catch (error) {
      console.error("Error changing password:", error);
    }
  };
  return (
    <Drawer anchor="left" open={open} onClose={handle_Close}>
      <Box
        width="400px" // Augmentation de la largeur
        p={3}
        bgcolor="default" // Utilisez la couleur par défaut ou définissez la couleur de votre choix
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Modifier les informations</Typography>
          <IconButton onClick={handle_Close}>
            <Close />
          </IconButton>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Formik
          initialValues={{
            fistname: "user",
            email: "user",
            password: "",
            confirmPassword: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ handleSubmit, handleChange, values, errors }) => (
            <form onSubmit={handleSubmit}>
              <Box mb={2}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Nom d'utilisateur"
                  name="fistname"
                  onChange={handleChange}
                  value={values.fistname}
                  error={!!errors.fistname}
                  helperText={errors.fistname}
                  InputProps={{ startAdornment: <AccountCircle color="primary" /> }}
                />
              </Box>
      
              <Box mb={2}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Prénom d'utilisateur"
                  name="lastname"
                  onChange={handleChange}
                  value={values.lastname}
                  error={!!errors.lastname}
                  helperText={errors.lastname}
                  InputProps={{ startAdornment: <AccountCircle color="primary" /> }}
                />
              </Box>
              <Box mb={2}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Email"
                  name="email"
                  onChange={handleChange}
                  value={values.email}
                  error={!!errors.email}
                  helperText={errors.email}
                />
              </Box>
              <Box display="flex" justifyContent="space-between">
            
                <Button type="button" variant="contained" color="secondary" onClick={handle_Close}>
                  Annuler
                </Button>
              </Box>
            </form>
          )}
        </Formik>
      </Box>

      <Box
        width="400px" // Augmentation de la largeur
        p={3}
        bgcolor="default" // Utilisez la couleur par défaut ou définissez la couleur de votre choix
      >
        <Accordion expanded={passwordAccordionOpen} onChange={() => setPasswordAccordionOpen(!passwordAccordionOpen)}>
          <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography variant="h6">Modifier mot de passe</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Formik
              initialValues={{
                password: "",
                newPassword: "",
                confirmPassword: "",
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ handleSubmit, handleChange, values, errors }) => (
                <form onSubmit={handleSubmit}>
                  <Box mb={2}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      label="Mot de passe courant"
                      type="password"
                      name="password"
                      onChange={handleChange}
                      value={values.password}
                      error={!!errors.password}
                      helperText={errors.password}
                    />
                  </Box>
                  <Box mb={2}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      label="Nouveau mot de passe"
                      type="password"
                      name="newPassword"
                      onChange={handleChange}
                      value={values.newPassword}
                      error={!!errors.newPassword}
                      helperText={errors.newPassword}
                    />
                  </Box>
                  <Box mb={2}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      label="Confirmer le mot de passe"
                      type="password"
                      name="confirmPassword"
                      onChange={handleChange}
                      value={values.confirmPassword}
                      error={!!errors.confirmPassword}
                      helperText={errors.confirmPassword}
                    />
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                  <Button
                type="submit"
                variant="contained"
                color="primary"
                onClick={handleClick} // Ajout de l'événement onClick
                >
                Valider
                </Button>
                    <Button type="button" variant="contained" color="secondary" onClick={handle_Close}>
                      Annuler
                    </Button>
                  </Box>
                </form>
              )}
            </Formik>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Drawer>
  );
};

export default FenetreMenuGaucheCard;
