'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';

const NoticePage = () => {
  const [notices, setNotices] = useState([]);
  const [studentId, setStudentId] = useState(null);

  useEffect(() => {
    const id = localStorage.getItem('studentId');
    setStudentId(id);
  }, []);

  useEffect(() => {
    if (!studentId) return;

    const fetchNotices = async () => {
      try {
        const res = await api.get(`/notices`);
        setNotices(res.data.notices);
      } catch (err) {
        console.error('Error fetching notices:', err);
      }
    };

    fetchNotices();
  }, [studentId]);


  return (
    <div className="bg-white text-black p-4 sm:p-6 md:p-8 overflow-hidden min-h-screen">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold border-l-4 border-red-600 pl-3 mb-6 sm:mb-8">
        Notices
      </h1>

      {notices.length === 0 ? (
        <p className="text-gray-600">No current notices</p>
      ) : (
        notices.map((notice, index) => (
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
        ))
      )}
    </div>
  );
};

export default NoticePage;
