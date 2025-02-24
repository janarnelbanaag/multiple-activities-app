"use client";

import { useAuth } from "@/app/_context/AuthContext";
import { useData } from "@/app/_context/DataContext";

export default function GoogleDriveLitePage() {
    const { handleLogout } = useAuth();
    const { fetchPhotos, photos, loading } = useData();

    if (loading) {
        return <>Fetching Photos...</>;
    }

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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-8 gap-4">
            {photos?.length > 0 ? (
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
    );
}
