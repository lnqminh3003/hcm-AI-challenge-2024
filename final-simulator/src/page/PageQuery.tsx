import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import queries from "../queries";
import CountdownTimer from "../components/CountTimeClock";
import UsersUpdate from "../components/UsersUpdate";

type PageData = string[];

function PageQuery() {
  const [searchParams] = useSearchParams();
  const number = searchParams.get("num");

  const [pageData, setPageData] = useState<PageData>([]);
  const [startTime, setStartTime] = useState(false);
  const [timeLeft, setTimeLeft] = useState(4 * 6);

  useEffect(() => {
    if (number && queries[number]) {
      setPageData(queries[number]);
    } else {
      setPageData([]);
    }
  }, [number]);

  if (!number) {
    return <h1>No page number provided</h1>;
  }

  return (
    <div className="mt-4 flex flex-col items-center">
      <div className="text-4xl font-bold">QUERY {number}</div>

      {startTime ? (
        <CountdownTimer
          queries={pageData}
          timeLeft={timeLeft}
          setTimeLeft={setTimeLeft}
        />
      ) : (
        <button
          onClick={() => setStartTime(true)}
          className="text-5xl font-bold bg-white p-8 rounded-lg"
        >
          Start
        </button>
      )}

      <UsersUpdate videoId={pageData[4]} frameId={pageData[5]} timeLeft={timeLeft} />
    </div>
  );
}

export default PageQuery;
