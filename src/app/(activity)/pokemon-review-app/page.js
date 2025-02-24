"use client";

import PokemonCard from "@/app/_components/PokemonCard";
import React, { useState, useEffect, useRef } from "react"; // Import useRef

const PokemonSearch = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [pokemonList, setPokemonList] = useState([]);
    const [offset, setOffset] = useState(0);
    const [totalPokemonCount, setTotalPokemonCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const limit = 100;

    // useRef to track if a fetch is in progress
    const isFetching = useRef(false);

    const fetchPokemon = async () => {
        if (isFetching.current) {
            return;
        }

        try {
            setLoading(true);
            isFetching.current = true;

            const response = await fetch(
                `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
            );
            const data = await response.json();

            setTotalPokemonCount(data.count);

            const detailedPokemon = await Promise.all(
                data.results.map(async (pokemon) => {
                    const res = await fetch(pokemon.url);
                    const pokemonData = await res.json();

                    return {
                        id: pokemonData.id,
                        name: pokemonData.name,
                        image_url: pokemonData.sprites.front_default,
                    };
                })
            );

            setPokemonList((prev) => [...prev, ...detailedPokemon]);
        } catch (error) {
            console.error("Error fetching Pokemon:", error);
        } finally {
            setLoading(false);
            isFetching.current = false;
        }
    };

    useEffect(() => {
        fetchPokemon();
    }, [offset]); // eslint-disable-line

    console.log("pokemonList", pokemonList);

    const filteredPokemon = pokemonList?.filter((pokemon) =>
        pokemon?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleNextPage = () => {
        setOffset((prevOffset) => prevOffset + limit);
    };

    return (
        <div>
            <input
                type="text"
                placeholder="Search Pokemon..."
                className="border p-2 rounded w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            <div className="grid grid-cols-1 xl:grid-cols-8 lg:grid-cols-6 md:grid-cols-4 sm:grid-cols-3 gap-4 mt-4">
                {filteredPokemon.map((pokemon) => (
                    <PokemonCard key={pokemon.id} pokemon={pokemon} />
                ))}
            </div>

            <button
                onClick={handleNextPage}
                className="bg-blue-500 text-white rounded p-2 mt-4"
                disabled={loading || totalPokemonCount === pokemonList.length}
            >
                {loading
                    ? "Loading..."
                    : totalPokemonCount === pokemonList.length
                    ? "All Pokemon Loaded"
                    : "Load More"}
            </button>
        </div>
    );
};

export default PokemonSearch;
