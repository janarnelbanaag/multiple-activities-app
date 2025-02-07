"use client";

import { useState } from "react";

export default function SearchPhotos({ onSearch }) {
    const [query, setQuery] = useState("");

    const handleSearch = () => {
        onSearch(query);
    };

    return (
        <div className="flex items-center gap-2 w-full md:w-auto">
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search photos..."
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            />
            <button
                onClick={handleSearch}
                className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-all"
            >
                Search
            </button>
        </div>
    );
}
