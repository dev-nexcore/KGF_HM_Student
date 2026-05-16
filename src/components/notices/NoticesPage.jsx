'use client';

import React, { useEffect, useState, useMemo } from 'react';
import api from '@/lib/api';

const NoticePage = () => {
  const [allNotices, setAllNotices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchNotices = async () => {
      setIsLoading(true);
      try {
        const res = await api.get(`/notices`);
        setAllNotices(res.data.notices || []);
      } catch (err) {
        console.error('Error fetching notices:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotices();
  }, []);

  // Filter and Search Logic
  const filteredNotices = useMemo(() => {
    return allNotices.filter(notice => {
      const matchesSearch = 
        notice.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        notice.message.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = filterType === 'all' || 
        (filterType === 'recent' && (new Date() - new Date(notice.issueDate)) / (1000 * 60 * 60 * 24) <= 7);

      return matchesSearch && matchesFilter;
    });
  }, [allNotices, searchTerm, filterType]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredNotices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentNotices = filteredNotices.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const [expandedNotices, setExpandedNotices] = useState({});

  const toggleNotice = (id) => {
    setExpandedNotices(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="bg-white text-black p-4 sm:p-6 md:p-8 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-black border-l-4 border-[#4F8CCF] pl-2">
          Notices
        </h2>

        {/* Search and Filter */}
        <div className="flex items-center gap-2">
          <input 
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-1.5 border border-gray-300 rounded text-sm outline-none focus:border-[#4F8CCF]"
          />
          <select 
            value={filterType}
            onChange={(e) => {
              setFilterType(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-1.5 border border-gray-300 rounded text-sm outline-none focus:border-[#4F8CCF] cursor-pointer"
          >
            <option value="all">All</option>
            <option value="recent">Recent</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <p className="text-gray-600">Loading notices...</p>
      ) : currentNotices.length === 0 ? (
        <p className="text-gray-600">No notices found</p>
      ) : (
        <>
          {currentNotices.map((notice, index) => {
            const noticeId = notice._id || index;
            const isExpanded = expandedNotices[noticeId];
            const needsTruncation = notice.message.length > 250;
            const displayText = isExpanded ? notice.message : notice.message.slice(0, 250) + (needsTruncation ? "..." : "");

            return (
              <div key={noticeId} className="mb-6 sm:mb-8">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 sm:mb-1 gap-1 sm:gap-0">
                  <h2 className="text-base sm:text-lg font-bold">{notice.title}</h2>
                  <p className="text-xs sm:text-sm font-semibold text-gray-700">
                    {new Date(notice.issueDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="shadow-[0_4px_15px_rgba(0,0,0,0.2)] focus:outline-none rounded-md p-3 sm:p-4 md:p-5">
                  <p className="text-sm sm:text-base leading-relaxed whitespace-pre-line">
                    {displayText}
                  </p>
                  {needsTruncation && (
                    <button 
                      onClick={() => toggleNotice(noticeId)}
                      className="mt-2 text-[#4F8CCF] font-bold text-xs hover:underline cursor-pointer"
                    >
                      {isExpanded ? "Read Less" : "Read More"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-gray-100 rounded disabled:opacity-50 text-sm font-medium"
              >
                Prev
              </button>
              
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i + 1)}
                  className={`px-3 py-1 rounded text-sm font-medium ${
                    currentPage === i + 1 ? 'bg-[#4F8CCF] text-white' : 'bg-gray-100'
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-gray-100 rounded disabled:opacity-50 text-sm font-medium"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default NoticePage;