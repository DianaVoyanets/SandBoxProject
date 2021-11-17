import "./styles.css";
import { React, useState, useEffect } from "react";
import LinearProgressButton from "./components/LinearProgressButton";

const progressDelayMs = 500;
const progressDurationMs = 10000;
const progressIntervals = [37, 69, 91, 100];
const progressIntervalsCount = progressIntervals.length;

const progressDurationWithDelayMs =
  progressDurationMs + progressIntervalsCount * progressDelayMs;
const intervalDurationMs = progressDurationMs / progressIntervalsCount;

const progressMessages = [
  "Adjusting colors palette",
  "Applying visual settings",
  "Tuning up sleep sounds",
  "Adding a pinch of magic",
  "Get my sleepscape"
];

const getCurrentInterval = (elapsedMs) =>
  Math.floor(
    (elapsedMs / progressDurationWithDelayMs) * progressIntervalsCount
  );

const getInvervalOffsetMs = (currentInterval) =>
  intervalDurationMs * currentInterval + progressDelayMs * currentInterval;

const isIntervalInDelayRange = (elapsedMs, currentInterval) => {
  const currentIntervalOffsetMs = getInvervalOffsetMs(currentInterval);
  const currentIntervalDurationMs = elapsedMs - currentIntervalOffsetMs;
  const inDelayRange =
    currentIntervalDurationMs > intervalDurationMs &&
    currentIntervalDurationMs <= intervalDurationMs + progressDelayMs;
  return inDelayRange;
};

const easeOutQuad = (x) => {
  if (x >= 1) return 1;
  else return 1 - (1 - x) * (1 - x);
};

const calculateNextProgress = (elapsedMs, currentInterval) => {
  const invervalOffsetMs = getInvervalOffsetMs(currentInterval);
  const intervalProgress = easeOutQuad(
    (elapsedMs - invervalOffsetMs) / intervalDurationMs
  );
  const previousInterval = progressIntervals[currentInterval - 1] || 0;
  const nextProgress =
    previousInterval +
    intervalProgress * (progressIntervals[currentInterval] - previousInterval);
  return nextProgress;
};

export default function App() {
  const [progress, setProgress] = useState(0);
  const [progressInterval, setProgressInterval] = useState(0);

  useEffect(() => {
    let hasDelay = false;

    let start = Date.now();
    const timer = setInterval(() => {
      const elapsedMs = Date.now() - start;
      const currentInterval = getCurrentInterval(elapsedMs);
      if (currentInterval < progressIntervalsCount) {
        const inDelayRange = isIntervalInDelayRange(elapsedMs, currentInterval);
        if (inDelayRange && !hasDelay) {
          setProgressInterval(currentInterval + 1);
          hasDelay = true;
        } else {
          hasDelay = false;
          const nextProgress = calculateNextProgress(
            elapsedMs,
            currentInterval
          );
          setProgress(nextProgress);
        }
      } else {
        setProgress(progressIntervals[progressIntervalsCount - 1]);
        setProgressInterval(progressIntervalsCount);
        clearInterval(timer);
      }
    }, 100);
    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="App">
      <LinearProgressButton
        progress={progress}
        progressInterval={progressInterval}
        progressIntervalsCount={progressIntervalsCount}
        progressMessages={progressMessages}
      />
    </div>
  );
}
