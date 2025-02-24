"use client";

import { useRouter } from "next/navigation";
import React from "react";

const HeaderComponent = ({ title, redBtnLbl = "Logout", handleLogout }) => {
    const router = useRouter();

    const handleHome = () => {
        router.push("/");
    };

    return (
        <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">{title}</h1>
            <div>
                <button
                    onClick={handleHome}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 mr-2"
                >
                    Home
                </button>
                <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                    {redBtnLbl}
                </button>
            </div>
        </div>
    );
};

export default HeaderComponent;
