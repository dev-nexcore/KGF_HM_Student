// components/NoticePopup.jsx
"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

const NoticePopup = ({ notice, onMarkAsRead }) => {
  const router = useRouter();

  if (!notice) return null;

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  // Close on Escape key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onMarkAsRead();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onMarkAsRead]);

  // Handle backdrop click - mark as read
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onMarkAsRead();
    }
  };

  // Handle "Got It" button - mark as read
  const handleMarkAsRead = () => {
    onMarkAsRead();
  };

  // Handle "View All" button - mark as read + redirect
  const handleViewAll = () => {
    onMarkAsRead();
    router.push("/notices");
  };

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 backdrop-blur bg-opacity-50 flex items-center justify-center z-50 p-4"
      style={{ animation: "fadeIn 0.2s ease-out" }}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4"
        style={{ animation: "slideUp 0.3s ease-out" }}
      >
        {/* Header */}
        <div className="bg-[#BEC5AD] px-6 py-4 rounded-t-lg flex justify-between items-center">
          <h2 className="text-lg font-bold text-black flex items-center gap-2">
            <span className="text-2xl">📢</span>
            New Notice
          </h2>
          <button
            onClick={handleMarkAsRead}
            className="text-black hover:text-gray-700 text-2xl font-bold transition-colors duration-200"
            aria-label="Close notice"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {/* Date Badge */}
          <div className="flex justify-end mb-3">
            <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
              {new Date(notice.issueDate).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 mb-4 leading-tight">
            {notice.title}
          </h3>

          {/* Message */}
          <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-[#BEC5AD]">
            <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
              {notice.message}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 justify-end px-6 pb-6">
          <button
            onClick={handleMarkAsRead}
            className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors cursor-pointer"
          >
            Mark as read
          </button>
          <button
            onClick={handleViewAll}
            className="px-4 py-2 bg-[#BEC5AD] text-black font-semibold rounded-md hover:bg-[#a9b29d] transition-colors flex items-center gap-2 cursor-pointer"
          >
            View All
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoticePopup;
