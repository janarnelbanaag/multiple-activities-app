"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "../../../utils/supabase/client";

export default function UploadPhoto({ onUploadSuccess, category }) {
    const [photoName, setPhotoName] = useState("");
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState(null);

    const fileInputRef = useRef(null);

    const supabase = createClient();

    useEffect(() => {
        const fetchUserId = async () => {
            const {
                data: { user },
                error,
            } = await supabase.auth.getUser();

            if (error) {
                console.error("Error fetching user:", error);
            } else {
                setUserId(user?.id || null);
            }
        };

        fetchUserId();
    }, [supabase]);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!photoName || !file) {
            alert("Please provide a photo name and select a file.");
            return;
        }

        setLoading(true);

        // Convert file to base64
        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64String = reader.result.split(",")[1];

            try {
                const response = await fetch("/api/uploadPhoto", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        user_id: userId,
                        photo_name: photoName,
                        file: base64String,
                        category,
                    }),
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(errorText);
                }

                const data = await response.json();
                alert("Photo uploaded successfully!");
                setPhotoName("");
                fileInputRef.current.value = "";
                setFile(null);
                if (onUploadSuccess) onUploadSuccess();
            } catch (error) {
                console.error("Upload error:", error);
                alert("Failed to upload photo.");
            } finally {
                setLoading(false);
            }
        };

        reader.readAsDataURL(file);
    };

    return (
        <div className="flex flex-col gap-2 p-4 bg-white shadow rounded-lg mb-8">
            <h2 className="text-xl font-bold">Upload Photo</h2>
            <input
                type="text"
                value={photoName}
                onChange={(e) => setPhotoName(e.target.value)}
                placeholder="Photo Name"
                className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            />
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="p-2 border rounded-lg"
            />
            <button
                onClick={handleUpload}
                disabled={loading}
                className="px-4 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600 transition-all disabled:opacity-50"
            >
                {loading ? "Uploading..." : "Upload Photo"}
            </button>
        </div>
    );
}
