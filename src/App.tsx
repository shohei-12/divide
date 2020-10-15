import React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import * as colors from "@material-ui/core/colors";
import Router from "./Router";
import { DrawerMenu } from "./components/Drawer";
import "./assets/style.css";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    toolbar: theme.mixins.toolbar,
  })
);

const App: React.FC = () => {
  const classes = useStyles();
  const theme = createMuiTheme({
    palette: {
      primary: {
        main: colors.cyan["A200"],
      },
      secondary: {
        main: colors.pink[400],
      },
      type: "dark",
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <DrawerMenu />
      <main>
        <div className={classes.toolbar} />
        <Router />
      </main>
    </ThemeProvider>
  );
};

export default App;
