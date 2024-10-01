import React, { useState, useEffect } from "react";

interface CountdownTimerProps {
  queries: any;

  timeLeft: any;

  setTimeLeft: any;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  queries,
  timeLeft,
  setTimeLeft,
}) => {
  const [query, setQuery] = useState<string[]>([]);

  var current = 0;

  useEffect(() => {
    setQuery([queries[0]]);

    const timer = setInterval(() => {
      setTimeLeft((prevTime: any) => {
        if (prevTime === 1) {
          clearInterval(timer);
          return 0;
        }

        // Update the query at specific times
        if (prevTime === 180 && current == 0) {
          setQuery((prevQueries) => [...prevQueries, queries[1]]);
          current = 1;
        } else if (prevTime === 120 && current == 1) {
          setQuery((prevQueries) => [...prevQueries, queries[2]]);
          current = 2;
        } else if (prevTime === 60 && current == 2) {
          setQuery((prevQueries) => [...prevQueries, queries[3]]);
          current = 3;
        }

        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="flex flex-col justify-center items-center px-20">
      {timeLeft <= 0 ? (
        <div className="text-5xl font-bold p-8 rounded-lg">Time's up!</div>
      ) : (
        <div className="text-5xl font-bold p-8 rounded-lg">
          {formatTime(timeLeft)}
        </div>
      )}
      <div className="text-3xl font-medium text-center mt-4">
        {query.join(" ")} {/* Join the array into a single string */}
      </div>
    </div>
  );
};

export default CountdownTimer;
