"use client";

import { useCallback, useEffect, useState } from "react";

import SearchPhotos from "@/app/_components/SearchPhoto";
import SortPhotos from "@/app/_components/SortPhotos";
import UploadPhoto from "@/app/_components/UploadPhoto";
import { createClient } from "../../../../utils/supabase/client";

export default function GoogleDriveLitePage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [sortValue, setSortValue] = useState("created_at");
    const [photos, setPhotos] = useState([]);

    const supabase = createClient();

    const fetchPhotos = useCallback(async () => {
        try {
            const response = await fetch(
                `/api/fetchPhotos?search=${encodeURIComponent(
                    searchQuery
                )}&sort=${sortValue}`
            );
            if (!response.ok) {
                throw new Error("Error fetching photos");
            }
            const data = await response.json();
            setPhotos(data);
        } catch (error) {
            console.error("Failed to load photos:", error);
        }
    }, [searchQuery, sortValue]);

    useEffect(() => {
        fetchPhotos();
    }, [fetchPhotos]);

    return (
        <div className="p-8">
            <UploadPhoto onUploadSuccess={fetchPhotos} />

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-white shadow rounded-lg mb-8">
                <SearchPhotos onSearch={setSearchQuery} />
                <SortPhotos onSort={setSortValue} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {photos.length > 0 ? (
                    photos.map((photo) => (
                        <div
                            key={photo.id}
                            className="border p-4 rounded shadow"
                        >
                            {/* eslint-disable-next-line */}
                            <img
                                src={photo.photo_url}
                                alt={photo.photo_name}
                                className="w-full h-auto rounded"
                            />
                            <h2 className="text-lg font-semibold mt-2">
                                {photo.photo_name}
                            </h2>
                            <p className="text-sm text-gray-500">
                                {new Date(photo.created_at).toLocaleString()}
                            </p>
                        </div>
                    ))
                ) : (
                    <p className="col-span-full text-center text-gray-600">
                        No photos found.
                    </p>
                )}
            </div>
        </div>
    );
}
