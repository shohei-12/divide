import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles({
  btn: {
    backgroundColor: "#81d4fa",
    fontSize: 16,
    "&:hover": {
      backgroundColor: "#18ffff",
    },
  },
});

type Props = {
  text: string;
  onClick: () => any;
};
const PrimaryButton: React.FC<Props> = (props) => {
  const classes = useStyles();

  return (
    <Button className={classes.btn} variant="contained" onClick={props.onClick}>
      {props.text}
    </Button>
  );
};

export default PrimaryButton;
