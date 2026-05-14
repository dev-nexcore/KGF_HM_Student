'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import api from '@/lib/api';

const NoticePage = () => {
  const [allNotices, setAllNotices] = useState([]);
  const [displayedNotices, setDisplayedNotices] = useState([]);
  const [studentId, setStudentId] = useState(null);
  const [showMoreAvailable, setShowMoreAvailable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const containerRef = useRef(null);
  const [screenHeight, setScreenHeight] = useState(0);

  // Estimate notice height (including margins and padding)
  const ESTIMATED_NOTICE_HEIGHT = 180; // Adjust based on your typical notice size
  const HEADER_HEIGHT = 100; // Approximate header height
  const BUFFER_NOTICES = 1; // Extra notices to ensure screen is filled

  useEffect(() => {
    setScreenHeight(window.innerHeight);

    const handleResize = () => {
      setScreenHeight(window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const id = localStorage.getItem('studentId');
    setStudentId(id);
  }, []);

  useEffect(() => {
    if (!studentId) return;

    const fetchNotices = async () => {
      setIsLoading(true);
      try {
        const res = await api.get(`/notices`);
        setAllNotices(res.data.notices);
      } catch (err) {
        console.error('Error fetching notices:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotices();
  }, [studentId]);

  // Calculate how many notices fit in screen height
  const calculateInitialNoticesCount = useCallback(() => {
    if (screenHeight === 0) return 3; // Default fallback

    const availableHeight = screenHeight - HEADER_HEIGHT;
    const noticesCount = Math.floor(availableHeight / ESTIMATED_NOTICE_HEIGHT) + BUFFER_NOTICES;

    return Math.max(3, noticesCount); // Minimum 3 notices
  }, [screenHeight]);

  // Initialize displayed notices when allNotices or screenHeight changes
  useEffect(() => {
    if (allNotices.length === 0) return;

    const initialCount = calculateInitialNoticesCount();
    const initialNotices = allNotices.slice(0, initialCount);

    setDisplayedNotices(initialNotices);
    setShowMoreAvailable(allNotices.length > initialCount);
  }, [allNotices, calculateInitialNoticesCount]);

  const handleShowMore = () => {
    const currentCount = displayedNotices.length;
    const additionalCount = Math.max(3, Math.floor(calculateInitialNoticesCount() / 2)); // Load half of initial amount
    const newCount = currentCount + additionalCount;

    const newDisplayedNotices = allNotices.slice(0, newCount);
    setDisplayedNotices(newDisplayedNotices);
    setShowMoreAvailable(allNotices.length > newCount);
  };

  return (
    <div
      ref={containerRef}
      className="bg-white text-black p-4 sm:p-6 md:p-8 overflow-hidden min-h-screen"
    >
      <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-black border-l-4 border-[#4F8CCF] pl-2 mb-4 sm:mb-6">
        Notices
      </h2>

      {isLoading && displayedNotices.length === 0 ? (
        <p className="text-gray-600">Loading notices...</p>
      ) : displayedNotices.length === 0 ? (
        <p className="text-gray-600">No current notices</p>
      ) : (
        <>
          {displayedNotices.map((notice, index) => (
            <div key={index} className="mb-6 sm:mb-8">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 sm:mb-1 gap-1 sm:gap-0">
                <h2 className="text-base sm:text-lg font-bold">{notice.title}</h2>
                <p className="text-xs sm:text-sm font-semibold text-gray-700">
                  {new Date(notice.issueDate).toLocaleDateString()}
                </p>
              </div>
              <div className="shadow-[0_4px_15px_rgba(0,0,0,0.2)] focus:outline-none rounded-md p-3 sm:p-4 md:p-5">
                <p className="text-sm sm:text-base leading-relaxed whitespace-pre-line">
                  {notice.message}
                </p>
              </div>
            </div>
          ))}

          {showMoreAvailable && (
            <div className="flex justify-center mt-6 sm:mt-8">
              <button
                onClick={handleShowMore}
                className="bg-[#4F8CCF] hover:bg-[#3a6ba3] text-white font-semibold py-2 px-6 rounded-md transition-colors duration-200 shadow-md cursor-pointer"
              >
                Show More
              </button>
            </div>
          )}

          {!showMoreAvailable && allNotices.length > 0 && (
            <div className="flex justify-center mt-6 sm:mt-8">
              <p className="text-gray-500 text-sm">
                Showing all {allNotices.length} notice{allNotices.length !== 1 ? 's' : ''}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default NoticePage;