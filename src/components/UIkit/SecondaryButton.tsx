import React from "react";
import Button from "@material-ui/core/Button";

type Props = {
  text: string;
  disabled?: boolean;
  onClick: () => any;
};

const SecondaryButton: React.FC<Props> = (props) => {
  return (
    <Button
      color="secondary"
      variant="contained"
      disabled={props.disabled}
      onClick={props.onClick}
    >
      {props.text}
    </Button>
  );
};

export default SecondaryButton;
