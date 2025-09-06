import React, { useState } from "react";
import { fetchBooks } from "../api"; // Import API function

const BookSearch = () => {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);

  const searchBooks = async () => {
    const results = await fetchBooks(query);
    setBooks(results);
  };

  return (
    <div className="p-4 bg-gray-900 min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-4">Book Search</h1>
      <input
        type="text"
        placeholder="Search for a book..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="p-2 rounded text-black"
      />
      <button onClick={searchBooks} className="ml-2 p-2 bg-blue-500 rounded">
        Search
      </button>

      <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
        {books.map((book, index) => (
          <div key={index} className="bg-gray-800 p-4 rounded">
            <img src={book.cover} alt={book.title} className="w-full mb-2" />
            <h2 className="text-lg font-semibold">{book.title}</h2>
            <p className="text-sm">{book.author}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookSearch;
