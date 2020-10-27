import React from "react";

type Props = {
  deadline: string;
};

const Deadline: React.FC<Props> = (props) => {
  const timeRemaining =
    new Date(props.deadline).getTime() - new Date().getTime();

  const daysRemaining = () => {
    return Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
  };

  const hoursRemaining = () => {
    return Math.floor(timeRemaining / (1000 * 60 * 60));
  };

  const minutesRemaining = () => {
    return Math.floor(timeRemaining / (1000 * 60));
  };

  return (
    <>
      {daysRemaining() * 24 >= 24 && <span>あと{daysRemaining()}日</span>}
      {daysRemaining() * 24 < 24 && hoursRemaining() >= 1 && (
        <span>あと{hoursRemaining()}時間</span>
      )}
      {hoursRemaining() * 60 < 60 && minutesRemaining() >= 0 && (
        <span>あと{minutesRemaining()}分</span>
      )}
      {minutesRemaining() < 0 && <span>期限切れ</span>}
    </>
  );
};

export default Deadline;
