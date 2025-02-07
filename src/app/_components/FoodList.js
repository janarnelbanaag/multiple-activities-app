import { useState, useEffect } from "react";

export default function FoodList() {
    const [photos, setPhotos] = useState([]);
    const [sortBy, setSortBy] = useState("created_at");

    useEffect(() => {
        fetch(`/api/getPhotos?sortBy=${sortBy}`)
            .then((res) => res.json())
            .then((data) => setPhotos(data));
    }, [sortBy]);

    return (
        <div>
            <h2 className="text-xl font-bold">Food Gallery</h2>
            <select onChange={(e) => setSortBy(e.target.value)}>
                <option value="created_at">Sort by Date</option>
                <option value="name">Sort by Name</option>
            </select>
            <div className="grid grid-cols-3 gap-4">
                {photos.map((photo) => (
                    <div key={photo.id}>
                        {/* eslint-disable-next-line */}
                        <img
                            src={photo.photo_url}
                            alt={photo.name}
                            className="w-full h-32 object-cover"
                        />
                        <p className="text-center">{photo.name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
