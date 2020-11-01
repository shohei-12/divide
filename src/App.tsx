import React from "react";
import { useSelector } from "react-redux";
import { State } from "./re-ducks/store/types";
import { getTheme } from "./re-ducks/users/selectors";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import * as colors from "@material-ui/core/colors";
import Router from "./Router";
import { DrawerMenu } from "./components/Drawer";
import "./assets/style.css";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    main: {
      padding: "76px 10px 30px",
      [theme.breakpoints.up("sm")]: {
        padding: "0 10px 40px 250px",
      },
    },
  })
);

const App: React.FC = () => {
  const classes = useStyles();
  const selector = useSelector((state: State) => state);
  const theme = getTheme(selector);

  const themeLight = createMuiTheme({
    palette: {
      primary: {
        main: colors.cyan[500],
      },
      secondary: {
        main: colors.pink[400],
      },
      type: "light",
    },
  });

  const themeDark = createMuiTheme({
    palette: {
      background: {
        default: "#222",
      },
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
    <ThemeProvider theme={theme === "light" ? themeLight : themeDark}>
      <CssBaseline />
      <DrawerMenu />
      <main className={classes.main}>
        <Router />
      </main>
    </ThemeProvider>
  );
};

export default App;
