'use client';

import React, { useEffect, useState, useMemo } from 'react';
import api from '@/lib/api';

const NoticePage = () => {
  const [allNotices, setAllNotices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
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

      let matchesDate = true;
      if (dateFilter) {
        const filterD = new Date(dateFilter);
        const noticeD = new Date(notice.issueDate);
        matchesDate = 
          filterD.getFullYear() === noticeD.getFullYear() &&
          filterD.getMonth() === noticeD.getMonth() &&
          filterD.getDate() === noticeD.getDate();
      }

      return matchesSearch && matchesFilter && matchesDate;
    });
  }, [allNotices, searchTerm, filterType, dateFilter]);

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
        <div className="flex flex-wrap items-center gap-2">
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
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => {
              setDateFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-1.5 border border-gray-300 rounded text-sm outline-none focus:border-[#4F8CCF] cursor-pointer [color-scheme:light]"
          />
          {dateFilter && (
            <button 
              onClick={() => { setDateFilter(''); setCurrentPage(1); }}
              className="px-3 py-1.5 bg-red-50 text-red-500 border border-red-200 hover:border-red-500 text-sm font-medium rounded transition"
            >
              Clear
            </button>
          )}
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
                <div className="bg-white shadow-[0_4px_15px_rgba(0,0,0,0.1)] border border-gray-100 rounded-xl overflow-hidden flex flex-col">
                  {/* Header: Title and Date */}
                  <div className="bg-[#AAB491] px-5 py-3 sm:px-6 sm:py-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0">
                    <h2 className="text-base sm:text-lg font-semibold text-black">{notice.title}</h2>
                    <p className="text-xs sm:text-sm font-medium text-black/80">
                      {new Date(notice.issueDate).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                    </p>
                  </div>
                  
                  {/* Content: Message */}
                  <div className="p-5 sm:p-6 text-gray-800">
                    <p className="text-sm sm:text-base leading-relaxed whitespace-pre-line">
                      {displayText}
                    </p>
                    {needsTruncation && (
                      <button 
                        onClick={() => toggleNotice(noticeId)}
                        className="mt-3 text-[#4F8CCF] font-semibold text-sm hover:underline cursor-pointer transition-colors"
                      >
                        {isExpanded ? "Read Less" : "Read More"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Pagination */}
          {totalPages > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-gray-100">
              <div className="text-sm text-gray-600 font-medium bg-gray-50 px-4 py-2 rounded-full border border-gray-200">
                Showing {filteredNotices.length > 0 ? startIndex + 1 : 0} - {Math.min(startIndex + itemsPerPage, filteredNotices.length)} of {filteredNotices.length} notices
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-1.5 rounded-lg font-medium text-sm transition-all duration-200 ${
                    currentPage === 1 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-white text-gray-700 border border-gray-200 hover:border-[#4F8CCF] hover:text-[#4F8CCF] hover:shadow-sm cursor-pointer'
                  }`}
                >
                  Previous
                </button>
                
                <div className="flex flex-wrap items-center justify-center gap-1">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => handlePageChange(i + 1)}
                      className={`w-8 h-8 rounded-lg font-medium text-sm transition-all duration-200 ${
                        currentPage === i + 1
                          ? 'bg-[#4F8CCF] text-white shadow-md'
                          : 'bg-white text-gray-600 border border-gray-200 hover:border-[#4F8CCF] hover:text-[#4F8CCF] cursor-pointer'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1.5 rounded-lg font-medium text-sm transition-all duration-200 ${
                    currentPage === totalPages 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-white text-gray-700 border border-gray-200 hover:border-[#4F8CCF] hover:text-[#4F8CCF] hover:shadow-sm cursor-pointer'
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default NoticePage;