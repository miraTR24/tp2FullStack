// color design tokens export
export const tokensDark = {

  grey: {
    //red
    0: "#000000",
    50: "#292929",
      100: "#faced0",
      200: "#f59da1",
      300: "#ef6b72",
      400: "#ea3a43",
      500: "#e50914",
      600: "#b70710",
      700: "#89050c",
      800: "#5c0408",
      900: "#2e0204",
       1000: "#ffffff",
},

  primary: {
    //black
      100: "#f4f4f4",
      200: "#999999",
      300: "#666666",
      400: "#333333",
      500: "#000000",
      600: "#000000",
      700: "#000000",
      800: "#000000",
      900: "#000000"
},
  secondary: {
    // yellow
    0: "#000000",
    50: "#d3d4de",
    100: "#000000",
    200: "#a6a9be",
    300: "#7a7f9d",
    400: "#4d547d",
    500: "#21295c",
    600: "#111111", // manually adjusted
    700: "#141937",
    800: "#0d1025",
    900: "#070812",
    1000: "#ffffff",
  },
};

// function that reverses the color palette
function reverseTokens(tokensDark) {
  const reversedTokens = {};
  Object.entries(tokensDark).forEach(([key, val]) => {
    const keys = Object.keys(val);
    const values = Object.values(val);
    const length = keys.length;
    const reversedObj = {};
    for (let i = 0; i < length; i++) {
      reversedObj[keys[i]] = values[length - i - 1];
    }
    reversedTokens[key] = reversedObj;
  });
  return reversedTokens;
}
export const tokensLight = reverseTokens(tokensDark);

// mui theme settings
export const themeSettings = (mode) => {
  return {
    palette: {
      mode: mode,
      ...(mode === "dark"
        ? {
            // palette values for dark mode
            primary: {
              ...tokensDark.primary,
              main: tokensDark.primary[400],
              light: tokensDark.primary[400],
            },
            secondary: {
              ...tokensDark.secondary,
              main: tokensDark.secondary[400],
              alt: tokensDark.secondary[1000],
              altinv:tokensDark.secondary[0],
            },
            neutral: {
              ...tokensDark.grey,
              main: tokensDark.grey[0],
            },
            background: {
              default: tokensDark.primary[600],
              alt: tokensDark.secondary[700],
            },
          }
        : {
            // palette values for light mode
            primary: {
              ...tokensLight.primary,
              main: tokensDark.grey[50],
              light: tokensDark.grey[100],
            },
            secondary: {
              ...tokensLight.secondary,
              main: tokensDark.secondary[600],
              light: tokensDark.secondary[700],
              alt: tokensDark.secondary[0],
              altinv:tokensDark.secondary[1000],
            },
            neutral: {
              ...tokensLight.grey,
              main: tokensDark.grey[1000],
            },
            background: {
              default: tokensDark.grey[1000],
              alt: tokensDark.primary[100],
            },
          }),
    },
    typography: {
      fontFamily: ["Inter", "sans-serif"].join(","),
      fontSize: 12,
      h1: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 40,
      },
      h2: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 32,
      },
      h3: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 24,
      },
      h4: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 20,
      },
      h5: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 16,
      },
      h6: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 14,
      },
    },
  };
};