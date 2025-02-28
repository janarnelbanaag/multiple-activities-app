import { useState } from "react";

export default function ReviewForm({ photoId, onReviewAdded }) {
    const [review, setReview] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch("/api/reviews", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ photo_id: photoId, review }),
        });

        if (res.ok) {
            setReview("");
            onReviewAdded();
        }
    };

    return (
        <div className="mx-auto bg-white p-6 rounded shadow">
            <form onSubmit={handleSubmit} className="flex">
                <input
                    type="text"
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder="Write a review..."
                    className="flex-grow border rounded-l px-3 py-2"
                />
                <button
                    type="submit"
                    className="bg-blue-500 text-white rounded-r px-4 py-2"
                >
                    Add Review
                </button>
            </form>
        </div>
    );
}
