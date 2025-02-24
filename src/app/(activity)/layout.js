// app/(protected)/layout.js
"use client";
import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/app/_context/AuthContext";
import HeaderComponent from "../_components/HeaderComponent";
import UploadPhoto from "../_components/UploadPhoto";
import SearchPhotos from "../_components/SearchPhoto";
import SortPhotos from "../_components/SortPhotos";
import { useData } from "../_context/DataContext";

export default function ProtectedLayout({ children }) {
    const { supabase, handleLogout } = useAuth();
    const router = useRouter();
    const path = usePathname();

    const [isLoading, setIsLoading] = useState(true);
    const {
        pages,
        photos,
        setPhotos,
        searchQuery,
        setSearchQuery,
        sortValue,
        setSortValue,
    } = useData();

    const fetchPhotos = useCallback(async () => {
        try {
            if (!pages[path]?.shouldFetch) return;

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
        } catch (error) {
            console.error("Failed to load photos:", error);
        }
    }, [path, searchQuery, sortValue]); // eslint-disable-line

    useEffect(() => {
        if (!pages[path]?.shouldFetch) return;

        fetchPhotos();
    }, [fetchPhotos]); // eslint-disable-line

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const {
                    data: { session },
                } = await supabase.auth.getSession();
                if (!session) {
                    router.replace("/");
                    return;
                }
                setIsLoading(false);
            } catch (error) {
                console.error("Auth check error:", error);
                router.replace("/");
            }
        };

        checkAuth();

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === "SIGNED_OUT" || !session) {
                router.replace("/");
            }
        });

        return () => {
            subscription?.unsubscribe();
        };
    }, [router, supabase]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen text-lg font-semibold">
                Loading...
            </div>
        );
    }

    return (
        <div className="p-8 bg-gray-100">
            <div className="w-auto bg-gray-50 rounded shadow p-6">
                {pages[path] && path}

                {pages[path]?.title && (
                    <div className="mb-6">
                        <HeaderComponent
                            title={pages[path]?.title}
                            handleLogout={handleLogout}
                        />
                    </div>
                )}

                {pages[path]?.hasUpload && (
                    <UploadPhoto
                        onUploadSuccess={fetchPhotos}
                        category={pages[path]?.category}
                    />
                )}

                {(pages[path]?.hasSearch || pages[path]?.hasSort) && (
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-white shadow rounded-lg mb-8">
                        {pages[path]?.hasSearch && (
                            <SearchPhotos onSearch={setSearchQuery} />
                        )}
                        {pages[path]?.hasSort && (
                            <SortPhotos onSort={setSortValue} />
                        )}
                    </div>
                )}
                {children}
            </div>
        </div>
    );
}
