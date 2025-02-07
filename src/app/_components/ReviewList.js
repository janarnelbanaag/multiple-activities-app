import { useState, useEffect } from "react";

export default function ReviewList({ photoId }) {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        fetch(`/api/getReviews?photo_id=${photoId}`)
            .then((res) => res.json())
            .then((data) => setReviews(data));
    }, [photoId]);

    return (
        <div>
            <h3 className="font-bold">Reviews</h3>
            {reviews.map((review) => (
                <p key={review.id} className="border p-2">
                    {review.review}
                </p>
            ))}
        </div>
    );
}
