import React from "react";

type Props = {
  deadline: firebase.firestore.Timestamp;
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
      {daysRemaining(props.deadline.toDate()) * 24 >= 24 && (
        <span>あと{daysRemaining(props.deadline.toDate())}日</span>
      )}
      {daysRemaining(props.deadline.toDate()) * 24 < 24 &&
        hoursRemaining(props.deadline.toDate()) >= 1 && (
          <span>あと{hoursRemaining(props.deadline.toDate())}時間</span>
        )}
      {hoursRemaining(props.deadline.toDate()) * 60 < 60 &&
        minutesRemaining(props.deadline.toDate()) >= 0 && (
          <span>あと{minutesRemaining(props.deadline.toDate())}分</span>
        )}
      {minutesRemaining(props.deadline.toDate()) < 0 && <span>期限切れ</span>}
    </>
  );
};

export default Deadline;
