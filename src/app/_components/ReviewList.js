import { useAuth } from "../_context/AuthContext";

export default function ReviewList({ reviews, getRevs, isPokemon }) {
	const { user } = useAuth();

	const handleDelete = async (reviewId) => {
		try {
			if (isPokemon) {
				const res = await fetch(
					`/api/pokemon_reviews?review_id=${reviewId}`,
					{
						method: "DELETE",
					}
				);

				if (!res.ok) {
					console.error("Failed to delete review");
					return;
				}

				getRevs();
				return;
			}

			const res = await fetch(`/api/reviews?review_id=${reviewId}`, {
				method: "DELETE",
			});

			if (!res.ok) {
				console.error("Failed to delete review");
				return;
			}

			getRevs();
		} catch (error) {
			console.error("Error deleting review:", error);
		}
	};

	const handleUpdate = async (reviewId, newReviewText) => {
		try {
			if (isPokemon) {
				const res = await fetch(
					`/api/pokemon_reviews?review_id=${reviewId}`,
					{
						method: "PUT",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({ review: newReviewText }),
					}
				);

				if (!res.ok) {
					console.error("Failed to update review");
					return;
				}

				getRevs();
				return;
			}

			const res = await fetch(`/api/reviews?review_id=${reviewId}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ review: newReviewText }),
			});

			if (!res.ok) {
				console.error("Failed to update review");
				return;
			}

			getRevs();
		} catch (error) {
			console.error("Error updating review:", error);
		}
	};

	return (
		<div>
			{reviews.map((review) => (
				<div
					key={review.id}
					className="border rounded-lg p-4 mb-4 shadow-md bg-white"
				>
					<p className="text-gray-800 leading-relaxed">
						{review.review}
					</p>
					{user.id === review.user_id && (
						<div className="mt-2 flex justify-end space-x-2">
							<button
								onClick={() => handleDelete(review.id)}
								className="bg-red-500 hover:bg-red-700 text-white py-1 px-3 rounded focus:outline-none focus:shadow-outline"
							>
								Delete
							</button>
							<button
								onClick={() => {
									const newReview = prompt(
										"Enter new review text:",
										review.review
									);
									if (newReview) {
										handleUpdate(review.id, newReview);
									}
								}}
								className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-3 rounded focus:outline-none focus:shadow-outline"
							>
								Update
							</button>
						</div>
					)}
				</div>
			))}
		</div>
	);
}
