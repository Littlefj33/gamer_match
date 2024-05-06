"use client";

import { useState } from 'react';

export default function LibrariesMatch({ email }) {

  //TODO: Display match result profiles. Pagination? Probably a question for Frank/Jackie.
  const [matchResult, setMatchResult] = useState([]);

  const handleLibrariesMatch = async () => {
    try {
      const response = await fetch('/api/match/libraries', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            email
          }),
      });
      console.log(response)
      if (response.ok) {
        const data = await response.json();
        setMatchResult(data);
        console.log("Successfully matched")
      } else {
        console.log("Failed to match")
      }

    } catch (e) {
      console.log(e);
    }
  }

  return (
              <div className="w-40 h-full flex flex-wrap items-center justify-center mx-10">
                  <button onClick={handleLibrariesMatch} className="w-full h-full flex items-center justify-center bg-persian-blue rounded-full text-xl ">
                        Shared Games
                  </button>
              </div>
  );
}