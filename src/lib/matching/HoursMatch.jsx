"use client";

import { useState } from 'react';

export default function HoursMatch({ email }) {
  const [formData, setFormData] = useState({
    gameName: ''
  });

  //TODO: Display match result profiles. Pagination? Probably a question for Frank/Jackie.
  const [matchResult, setMatchResult] = useState([]);

  const handleFormChange = (e) => {
    // Update the formData state when input values change
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleHoursMatch = async (e) => {
    e.preventDefault();
    console.log(formData);
    try {
      const response = await fetch('/api/match/hours', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            email, 
            gameName: formData.gameName, 
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
    <form onSubmit={handleHoursMatch} className="w-full text-black ">
    <div className="flex flex-col text-center my-3">
        {/* <label className="mb-4 font-semibold">
            Number of Hours:
            <input
                type="text"
                placeholder="e.g. 230"
                className="w-full bg-transparent shadow-md border-b border-t border-black placeholder:text-gray-400 placeholder:font-normal px-2"
            />
        </label> */}
        <label className="font-semibold">
            Name of Game:
            <input
                type="text"
                name="gameName"
                placeholder="e.g. Portal 2"
                className="w-full bg-transparent shadow-md border-b border-t border-black placeholder:text-gray-400 placeholder:font-normal px-2"
                value={formData.gameName}
                onChange={handleFormChange}
                required
            />
        </label>
    </div>
    <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Search
        </button>
</form>
  );
}