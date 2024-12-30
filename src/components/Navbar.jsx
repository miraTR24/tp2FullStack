import React, { useState } from "react";
import {
  LightModeOutlined,
  DarkModeOutlined,
  Menu as MenuIcon,
  Search,
  SettingsOutlined,
  AccountCircleOutlined,
} from "@mui/icons-material";
import { Link } from 'react-router-dom';
import FlexBetween from "../components/FlexBetween";
import { useDispatch } from "react-redux";
import { setMode, setLogout } from "../state";

import {
  AppBar,
  Button,
  Box,
  Typography,
  IconButton,
  InputBase,
  Toolbar,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";


const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const [anchorEl2, setAnchorEl2] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);


  const handleMenuIconClick = () => {
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };


  const renderDrawerContent = (
    <List>
      <ListItem  onClick={() => navigate("/Artistes")} sx={{cursor: 'pointer'}}>
        <ListItemText primary="Liste événement artistes" />
      </ListItem>
      <ListItem  onClick={() => navigate("/")} sx={{cursor: 'pointer'}}>
        <ListItemText primary="Liste événements" />
      </ListItem>
    </List>
  );

  return (
    <AppBar
      sx={{
        position: "static",
        background: "none",
        boxShadow: "none",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", background: "black" }}>
        {/* LEFT SIDE */}
        <FlexBetween>
          <IconButton onClick={handleMenuIconClick} sx={{ display: { md: "none" } }}>
            <MenuIcon sx={{ color: "white" }} />
          </IconButton>
          <Link to="/" style={{ textDecoration: 'none' }}>
          <Typography
            fontWeight="bold"
            fontSize="1.5rem"
            sx={{ color: "white" }}
          >
            MyEvents
          </Typography>
          </Link>
        </FlexBetween>

        {/* RIGHT SIDE */}
        <FlexBetween gap="1.5rem">
                  {/*les différents liens*/ }
                  <Box textAlign="left"   sx={{ display: { xs: "none", md: "block" },}}>
                <Link to="/Artistes" style={{ textDecoration: 'none' }}>
                <Typography
                  fontWeight="bold"
                  fontSize="0.85rem"
                  sx={{ color: "white" }}
                >
               Liste artistes
                </Typography>
                </Link>
              </Box>
              <Box textAlign="left"   sx={{ display: { xs: "none", md: "block" },}}>
                <Link to="/" style={{ textDecoration: 'none' }}>
                <Typography
                  fontWeight="bold"
                  fontSize="0.85rem"
                  sx={{ color: "white" }}
                >
               Liste événements
                </Typography>
                </Link>
              </Box>
          {/*buttons dark and light*/}
        <IconButton onClick={() => dispatch(setMode())}>
            {theme.palette.mode === "dark" ? (
              <DarkModeOutlined sx={{ fontSize: "25px" ,color: "white"}} />
            ) : (
              <LightModeOutlined sx={{ fontSize: "25px" ,color: "white" }} />
            )}
          </IconButton>



            {/* Menu pour le mobile */}
            <Drawer
              anchor="right"
              open={isDrawerOpen}
              onClose={handleCloseDrawer}
              sx={{ display: { xs: "block", md: "none" }, color: "white" }}
            >
              {renderDrawerContent}
            </Drawer>
         
        </FlexBetween>

      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

