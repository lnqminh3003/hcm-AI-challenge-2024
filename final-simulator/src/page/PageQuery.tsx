import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import queries from "../queries";

type PageData = string[];

function PageQuery() {
  const [searchParams] = useSearchParams();
  const number = searchParams.get('num');

  const [pageData, setPageData] = useState<PageData>(queries[number!]);

  return (
    <div>
      <h1>Data for Page {number}</h1>
      <ul>
        {pageData.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export default PageQuery;
