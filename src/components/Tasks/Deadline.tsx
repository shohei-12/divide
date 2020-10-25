import React from "react";

type Props = {
  deadline: string;
};

const Deadline: React.FC<Props> = (props) => {
  const daysRemaining = (deadline: Date) => {
    return Math.floor(
      (deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
  };

  const hoursRemaining = (deadline: Date) => {
    return Math.floor(
      (deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60)
    );
  };

  const minutesRemaining = (deadline: Date) => {
    return Math.floor(
      (deadline.getTime() - new Date().getTime()) / (1000 * 60)
    );
  };

  return (
    <>
      {daysRemaining(new Date(props.deadline)) * 24 >= 24 && (
        <span>あと{daysRemaining(new Date(props.deadline))}日</span>
      )}
      {daysRemaining(new Date(props.deadline)) * 24 < 24 &&
        hoursRemaining(new Date(props.deadline)) >= 1 && (
          <span>あと{hoursRemaining(new Date(props.deadline))}時間</span>
        )}
      {hoursRemaining(new Date(props.deadline)) * 60 < 60 &&
        minutesRemaining(new Date(props.deadline)) >= 0 && (
          <span>あと{minutesRemaining(new Date(props.deadline))}分</span>
        )}
      {minutesRemaining(new Date(props.deadline)) < 0 && <span>期限切れ</span>}
    </>
  );
};

export default Deadline;
