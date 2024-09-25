import React from 'react';
import { Link } from 'react-router-dom';

function QuestionList() {
  const numbers = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <div className="flex flex-row flex-wrap items-center mt-20 mx-20">
      {numbers.map((number) => (
        <div key={number} className="mt-8 mx-4 border-2 w-[100px] h-[100px] border-black">
          <Link
            className="text-2xl font-bold text-center w-full h-full flex items-center justify-center"
            to={`/page?num=${number}`}
          >
            {number}
          </Link>
        </div>
      ))}
    </div>
  );
}

export default QuestionList;
