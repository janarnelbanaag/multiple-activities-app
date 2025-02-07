"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NotFound() {
    const router = useRouter();

    useEffect(() => {
        router.replace("/");
    }, [router]);

    return (
        <div className="flex justify-center items-center h-screen text-lg font-semibold">
            Loading...
        </div>
    );
}
