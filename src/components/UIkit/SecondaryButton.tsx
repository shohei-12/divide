import React, { useCallback } from "react";
import Button from "@material-ui/core/Button";

type Props = {
  text: string;
  disabled?: boolean;
  onClick: () => any;
};

const SecondaryButton: React.FC<Props> = (props) => {
  const handleSubmit = useCallback(() => {
    props.onClick();
  }, [props]);

  return (
    <Button
      color="secondary"
      variant="contained"
      disabled={props.disabled}
      onClick={handleSubmit}
    >
      {props.text}
    </Button>
  );
};

export default SecondaryButton;
