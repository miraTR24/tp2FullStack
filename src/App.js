
import { BrowserRouter ,Navigate, Route,Routes} from "react-router-dom";
//import Home from "./pages/Home";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { themeSettings } from "./theme";

import Layout from "./layouts/layout1";
import EventDetails from "./pages/Accueil/EventDetails";
import Accueil from "./pages/Accueil";
import Artists from "./pages/Artists";



function App() {


  const mode = useSelector((state) => state.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  return (
    <div className="App">
     <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Accueil />} />
            <Route path="/Artistes" element={<Artists />} />
            <Route path="/events/:id" element={<EventDetails />} />
         
          </Route>
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;


