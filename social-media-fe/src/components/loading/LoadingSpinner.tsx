import React from "react";

const LoadingSpinner = () => {
    return (
        <div className="flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-gray-300 rounded-full animate-spin border-t-secondary"></div>
        </div>
    );
};

export default LoadingSpinner;
