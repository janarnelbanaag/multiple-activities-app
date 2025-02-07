"use client";

import { useCallback, useEffect, useState } from "react";

import SearchPhotos from "@/app/_components/SearchPhoto";
import SortPhotos from "@/app/_components/SortPhotos";
import UploadPhoto from "@/app/_components/UploadPhoto";
import { createClient } from "../../../../utils/supabase/client";
import HeaderComponent from "@/app/_components/HeaderComponent";
import { useAuth } from "@/app/_context/AuthContext";

export default function GoogleDriveLitePage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [sortValue, setSortValue] = useState("created_at");
    const [photos, setPhotos] = useState([]);
    const [token, setToken] = useState(null);

    const supabase = createClient();
    const { session, handleLogout } = useAuth();

    useEffect(() => {
        const fetchToken = async () => {
            const { data: session, error } = await supabase.auth.getSession();

            if (error) {
                console.error("Error fetching session:", error);
            } else {
                setToken(session?.session?.access_token || null);
            }
        };

        fetchToken();
    }, [supabase]);

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

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this photo?"))
            return;

        try {
            const response = await fetch("/api/deletePhoto", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });

            if (!response.ok) {
                throw new Error("Error deleting photo");
            }

            fetchPhotos();
        } catch (error) {
            console.error("Failed to delete photo:", error);
        }
    };

    const handleUpdate = async (id) => {
        const newPhotoName = prompt("Enter new photo name:");
        if (!newPhotoName) return;

        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = "image/*";

        fileInput.onchange = async (event) => {
            const file = event.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.readAsDataURL(file);

            reader.onloadend = async () => {
                const base64String = reader.result.split(",")[1];

                try {
                    const response = await fetch("/api/updatePhoto", {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            id,
                            photo_name: newPhotoName,
                            new_file: base64String,
                        }),
                    });

                    if (!response.ok) {
                        throw new Error("Failed to update photo");
                    }

                    fetchPhotos();
                } catch (error) {
                    console.error("Update failed:", error);
                }
            };
        };

        fileInput.click();
    };

    return (
        <div className="p-8 bg-gray-100">
            <div className="w-auto bg-gray-50 rounded shadow p-6">
                <div className="mb-6">
                    <HeaderComponent
                        title="Google Drive Lite"
                        handleLogout={handleLogout}
                    />
                </div>
                <UploadPhoto
                    token={token}
                    onUploadSuccess={fetchPhotos}
                    category="photos"
                />

                <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-white shadow rounded-lg mb-8">
                    <SearchPhotos onSearch={setSearchQuery} />
                    <SortPhotos onSort={setSortValue} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-8 gap-4">
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
                                    className="w-full h-40 object-contain rounded"
                                />
                                <h2 className="text-lg font-semibold mt-2">
                                    {photo.photo_name}
                                </h2>
                                <p className="text-sm text-gray-500">
                                    {new Date(
                                        photo.created_at
                                    ).toLocaleString()}
                                </p>
                                <div className="flex justify-between mt-2">
                                    <button
                                        className="text-blue-500 hover:underline"
                                        onClick={() => handleUpdate(photo.id)}
                                    >
                                        Update
                                    </button>
                                    <button
                                        className="text-red-500 hover:underline"
                                        onClick={() => handleDelete(photo.id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="col-span-full text-center text-gray-600">
                            No photos found.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
