"use client";

import { useAuth } from "@/app/_context/AuthContext";
import { useData } from "@/app/_context/DataContext";
import Link from "next/link";

export default function FoodPage() {
    const { handleLogout } = useAuth();
    const { path, fetchPhotos, photos, setReviewPhoto, loading } = useData();

    if (loading) {
        return <>Fetching Photos...</>;
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-8 gap-4">
            {photos.length > 0 ? (
                photos.map((photo) => (
                    <div key={photo.id} className="border p-4 rounded shadow">
                        {/* eslint-disable-next-line */}
                        <img
                            src={photo.photo_url}
                            alt={photo.photo_name}
                            className="w-full h-40 object-contain rounded"
                        />
                        <h2 className="text-lg font-semibold mt-2">
                            {photo.photo_name}
                        </h2>
                        <p className="text-sm text-gray-500">
                            {new Date(photo.created_at).toLocaleString()}
                        </p>
                        <div className="flex justify-between mt-4 ">
                            <Link
                                className="text-blue-500 hover:underline ml-auto"
                                onClick={() =>
                                    setReviewPhoto(() =>
                                        photos.find((p) => p.id === photo.id)
                                    )
                                }
                                href={`${path}/${photo.id}`}
                            >
                                See Reviews
                            </Link>
                        </div>
                    </div>
                ))
            ) : (
                <p className="col-span-full text-center text-gray-600">
                    No photos found.
                </p>
            )}
        </div>
    );
}
