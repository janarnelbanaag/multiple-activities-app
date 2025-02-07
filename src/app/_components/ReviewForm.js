import { useState } from "react";

export default function ReviewForm({ photoId, onReviewAdded }) {
    const [review, setReview] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch("/api/addReview", {
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
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Write a review..."
                className="border p-2"
            />
            <button type="submit" className="bg-blue-500 text-white p-2">
                Add Review
            </button>
        </form>
    );
}
