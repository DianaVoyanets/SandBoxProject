import { React, useState, useEffect } from "react";

import "./index.scss";

const LinearProgressButton = ({
  progress,
  progressInterval,
  progressIntervalsCount,
  progressMessages
}) => {
  const [style, setStyle] = useState({});
  const [isProgressMessageUpdating, setIsProgressMessageUpdating] = useState(
    false
  );
  const [progressMessage, setProgressMessage] = useState(
    progressMessages[progressInterval]
  );

  useEffect(() => {
    setStyle({
      width: `${progress}%`
    });
  }, [progress]);

  useEffect(() => {
    if (progressInterval) {
      setIsProgressMessageUpdating(true);
      if (progressInterval) {
        setTimeout(() => {
          setIsProgressMessageUpdating(false);
          setProgressMessage(progressMessages[progressInterval]);
        }, 500);
      }
    }
  }, [progressInterval, progressMessages]);

  return (
    <div className="button__container">
      <div className="progress" style={style}></div>
      <p
        className={
          isProgressMessageUpdating
            ? "progress__message progress__message_updating"
            : "progress__message"
        }
      >
        {progressMessage}{" "}
        {progressInterval < progressIntervalsCount
          ? `${Math.round(progress)}%`
          : ""}
      </p>
    </div>
  );
};

export default LinearProgressButton;
