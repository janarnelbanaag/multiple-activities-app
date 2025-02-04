import React from "react";

const DelLogoutBtn = ({ handleLogout, handleDeleteAccount, id }) => {
    return (
        <div className="mt-6 space-y-4">
            <button
                onClick={handleLogout}
                className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
                Logout
            </button>
            <button
                onClick={() =>
                    window.confirm("Are you sure?") && handleDeleteAccount(id)
                }
                className="w-full px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
                Delete Account
            </button>
        </div>
    );
};

export default DelLogoutBtn;
