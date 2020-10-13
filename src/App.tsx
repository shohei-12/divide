import React from "react";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import * as colors from "@material-ui/core/colors";
import Router from "./Router";
import "./assets/style.css";

const App: React.FC = () => {
  const theme = createMuiTheme({
    palette: {
      primary: {
        main: colors.blue[200],
      },
      secondary: {
        main: colors.pink[500],
      },
      type: "dark",
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <main>
        <Router />
      </main>
    </ThemeProvider>
  );
};

export default App;
