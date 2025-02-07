"use client";

import HeaderComponent from "@/app/_components/HeaderComponent";
import ReviewForm from "@/app/_components/ReviewForm";
import ReviewList from "@/app/_components/ReviewList";
import UploadPhoto from "@/app/_components/UploadPhoto";
import { useAuth } from "@/app/_context/AuthContext";
import { useState } from "react";

export default function FoodPage() {
    const [token, setToken] = useState(null);

    const { handleLogout } = useAuth();
    // const { data: photo } = await supabase
    //     .from("food_photos")
    //     .select("*")
    //     .eq("id", params.id)
    //     .single();

    // if (!photo) return <p>Photo not found</p>;

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="w-auto mx-auto py-4 rounded shadow bg-gray-50">
                <div className="m-6">
                    <HeaderComponent
                        title="Food Review App"
                        handleLogout={handleLogout}
                    />
                </div>
                <UploadPhoto
                    token={token}
                    onUploadSuccess={fetchPhotos}
                    category="photos"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-8 gap-4">
                    {/* <img
                        src={photo.photo_url}
                        alt={photo.name}
                        className="w-full h-64 object-cover"
                    /> */}
                    <div className="border p-4 rounded shadow">
                        <h1 className="text-2xl">test</h1>
                        <ReviewForm />
                        <ReviewList />
                    </div>
                </div>
            </div>
        </div>
    );
}
