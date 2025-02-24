"use client";

import HeaderComponent from "@/app/_components/HeaderComponent";
import ReviewForm from "@/app/_components/ReviewForm";
import ReviewList from "@/app/_components/ReviewList";
import { useData } from "@/app/_context/DataContext";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const Reviews = () => {
    const [reviews, setReviews] = useState([]);
    const [fetchedPhoto, setFetchedPhoto] = useState(null);

    const router = useRouter();
    const params = useParams();
    const photoId = params.photoId;

    const { reviewPhoto } = useData();

    const getRevs = useCallback(
        () =>
            fetch(`/api/reviews?photo_id=${photoId}`)
                .then((res) => res.json())
                .then((data) => setReviews(data)),
        [photoId]
    );

    useEffect(() => {
        const fetchPhotos = async () => {
            const response = await fetch(
                `/api/fetchPhotos?id=${photoId}&category=food_photos`
            );
            if (!response.ok) {
                throw new Error("Error fetching photos");
            }
            const data = await response.json();
            setFetchedPhoto(data[0]);
        };

        if (!reviewPhoto) fetchPhotos();
    }, [reviewPhoto]); // eslint-disable-line

    console.log("reviews", reviews);

    useEffect(() => {
        getRevs();
    }, [getRevs]);

    const handleHome = () => {
        router.push("/");
    };

    const handleBack = () => {
        router.back();
    };

    return (
        <div>
            <HeaderComponent
                title={"Reviews"}
                redBtnLbl="Back"
                handleLogout={handleBack}
            />

            {/* eslint-disable-next-line */}
            <img
                src={reviewPhoto?.photo_url || fetchedPhoto?.photo_url}
                alt={reviewPhoto?.photo_name || fetchedPhoto?.photo_name}
                className="w-full h-80 object-contain rounded mb-4"
            />

            <ReviewList reviews={reviews} photoId={photoId} getRevs={getRevs} />
            <ReviewForm photoId={photoId} onReviewAdded={getRevs} />
        </div>
    );
};

export default Reviews;
