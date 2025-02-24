"use client";

import {
    createContext,
    useState,
    useContext,
    useCallback,
    useEffect,
} from "react";
import { usePathname } from "next/navigation";

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
    const [photos, setPhotos] = useState([]);
    const [reviewPhoto, setReviewPhoto] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortValue, setSortValue] = useState("created_at");
    const [loading, setLoading] = useState(true);

    const path = usePathname();

    const pages = {
        "/simple-todo-list": {
            title: "Simple Todo List",
        },
        "/google-drive-lite": {
            title: "Google Drive Lite",
            category: "photos",
            shouldFetch: true,
            hasUpload: true,
            hasSearch: true,
            hasSort: true,
        },
        "/food-review-app": {
            title: "Food Review App",
            category: "food_photos",
            shouldFetch: true,
            hasUpload: true,
            hasSort: true,
        },
    };

    const fetchPhotos = useCallback(async () => {
        const response = await fetch(
            `/api/fetchPhotos?search=${encodeURIComponent(
                searchQuery
            )}&sort=${sortValue}&category=${pages[path]?.category}`
        );
        if (!response.ok) {
            throw new Error("Error fetching photos");
        }
        const data = await response.json();
        setPhotos(data);
    }, [path, searchQuery, sortValue]); // eslint-disable-line

    useEffect(() => {
        if (!pages[path]?.shouldFetch) return;

        const fetchFunction = async () => {
            try {
                setLoading(true);
                await fetchPhotos();
            } catch (error) {
                console.error("Failed to load photos:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFunction();
    }, [fetchPhotos]); // eslint-disable-line

    return (
        <DataContext.Provider
            value={{
                pages,
                path,
                fetchPhotos,
                photos,
                setPhotos,
                reviewPhoto,
                setReviewPhoto,
                searchQuery,
                setSearchQuery,
                sortValue,
                setSortValue,
                loading,
                setLoading,
            }}
        >
            {children}
        </DataContext.Provider>
    );
};
