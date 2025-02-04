import React from "react";

const SecretComponent = ({ secret, setSecret, handleUpdateSecret }) => {
    return (
        <div className="mt-6 space-y-4">
            <input
                type="text"
                placeholder="Secret Message"
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
                onClick={handleUpdateSecret}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                Update Secret
            </button>
        </div>
    );
};

export default SecretComponent;
