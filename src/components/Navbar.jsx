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


const Navbar = ({ user, isSidebarOpen, setIsSidebarOpen }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorEl2, setAnchorEl2] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false); 
  const open = Boolean(anchorEl2); 
  const [openDraw, setOpenDraw] = useState(false);

  const handleMenuIconClick = () => {
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setIsSubMenuOpen(true); 
  };

  const handleClose = () => {
    setIsSubMenuOpen(false); 
    navigate("/"); 
  };
  const handleClick2 = (event) => {
    setAnchorEl2(event.currentTarget);
  };
  const handleClose2 = () => {
    setAnchorEl2(null);
  };
  const handle_Close = () => {
    setOpenDraw(false);
  };
  const openDrawer = () => {
    setIsSubMenuOpen(false); 
    setOpenDraw(true);
  };
  const navigateFavSpectacles = () => {
    navigate("/MesFavorisSpectacle"); 
  };
  const navigateFavSalles = () => {
    navigate("/MesFavorisSalle"); 
  };

  const renderDrawerContent = (
    <List>
      <ListItem  onClick={() => navigate("/Artistes")} sx={{cursor: 'pointer'}}>
        <ListItemText primary="Artistes" />
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
          <Link to="/Accueil" style={{ textDecoration: 'none' }}>
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
          {/*buttons dark and light*/}
        <IconButton onClick={() => dispatch(setMode())}>
            {theme.palette.mode === "dark" ? (
              <DarkModeOutlined sx={{ fontSize: "25px" ,color: "white"}} />
            ) : (
              <LightModeOutlined sx={{ fontSize: "25px" ,color: "white" }} />
            )}
          </IconButton>
          {/*les différents liens*/ }
          <Box textAlign="left"   sx={{ display: { xs: "none", md: "block" },}}>
          <Link to="/Artistes" style={{ textDecoration: 'none' }}>
                <Typography
                  fontWeight="bold"
                  fontSize="0.85rem"
                  sx={{ color: "white" }}
                >
               Artistes
                </Typography>
                </Link>
              </Box>


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

