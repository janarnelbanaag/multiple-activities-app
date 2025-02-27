"use client";

import HeaderComponent from "@/app/_components/HeaderComponent";
import ReviewForm from "@/app/_components/ReviewForm";
import ReviewList from "@/app/_components/ReviewList";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const Reviews = () => {
	const [reviews, setReviews] = useState([]);
	const [fetchedPokemon, setFetchedPokemon] = useState(null);

	const router = useRouter();
	const params = useParams();
	const pokemonId = params.pokemonId;

	const getRevs = useCallback(
		() =>
			fetch(`/api/pokemon_reviews?pokemon_id=${pokemonId}`)
				.then((res) => res.json())
				.then((data) => setReviews(data)),
		[pokemonId]
	);

	useEffect(() => {
		const fetchPhotos = async () => {
			const response = await fetch(
				`https://pokeapi.co/api/v2/pokemon/${pokemonId}`
			);
			if (!response.ok) {
				throw new Error("Error fetching pokemon");
			}
			const data = await response.json();
			setFetchedPokemon(data);
		};

		fetchPhotos();
	}, []); // eslint-disable-line

	useEffect(() => {
		getRevs();
	}, [getRevs]);

	const handleBack = () => {
		router.back();
	};

	return (
		<div>
			<HeaderComponent
				title={
					fetchedPokemon?.name.charAt(0).toUpperCase() +
					fetchedPokemon?.name.slice(1).toLowerCase()
				}
				redBtnLbl="Back"
				handleLogout={handleBack}
			/>

			{/* eslint-disable-next-line */}
			<img
				src={fetchedPokemon?.sprites.front_default}
				alt={fetchedPokemon?.sprites.front_default}
				className="w-full h-40 object-contain rounded mb-4"
			/>

			<ReviewList reviews={reviews} getRevs={getRevs} isPokemon={true} />
			<ReviewForm
				id={pokemonId}
				onReviewAdded={getRevs}
				isPokemon={true}
			/>
		</div>
	);
};

export default Reviews;
