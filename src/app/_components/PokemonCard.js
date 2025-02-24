import React from "react";
import { useData } from "../_context/DataContext";

const PokemonCard = ({ pokemon }) => {
    const { path } = useData();
    return (
        <div className="border p-4 rounded shadow">
            {/* eslint-disable-next-line */}
            <img
                src={pokemon.image_url}
                alt={pokemon.name}
                className="w-32 h-32 mx-auto"
            />
            <h2 className="text-xl font-semibold">{pokemon.name}</h2>
            {/* Link to Pokemon details page */}
            <a
                href={`${path}/pokemon/${pokemon.id}`}
                className="text-blue-500 hover:underline"
            >
                View Details
            </a>
        </div>
    );
};

export default PokemonCard;
