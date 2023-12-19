"use state";
import React from "react";

const LoadingBtn = ({
  style = "dark",
  size = "md",
}: {
  style?: "dark" | "light";
  size?: "md" | "sm";
}) => {
  const loaderClass = style === "dark" ? "text-white" : "text-zinc";
  const btnClass =
    style === "dark" ? "bg-d_gray text-white" : "bg-white text-zinc";
  const sizeClass = size === "sm" ? "px-3" : "py-3 px-8";

  return (
    <button
      className={`inline-flex items-center justify-center ${btnClass} cursor-progress opacity-50 rounded-md ${sizeClass} font-semibold transition-all w-full`}
      disabled
    >
      <svg
        className={`animate-spin -ml-1 mr-3 h-5 w-5 ${loaderClass}`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      Please wait...
    </button>
  );
};

export default LoadingBtn;
