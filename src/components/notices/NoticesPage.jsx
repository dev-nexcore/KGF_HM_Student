'use client';

import React, { useEffect, useState, useCallback } from 'react';
import api from '@/lib/api';
import { 
  Bell, 
  Calendar, 
  ArrowRight, 
  Info, 
  AlertCircle,
  Clock,
  Pin
} from 'lucide-react';

const NoticePage = () => {
  const [allNotices, setAllNotices] = useState([]);
  const [displayedNotices, setDisplayedNotices] = useState([]);
  const [studentId, setStudentId] = useState(null);
  const [showMoreAvailable, setShowMoreAvailable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
        const sorted = (res.data.notices || []).sort((a, b) => new Date(b.issueDate) - new Date(a.issueDate));
        setAllNotices(sorted);
        setDisplayedNotices(sorted.slice(0, 5));
        setShowMoreAvailable(sorted.length > 5);
      } catch (err) {
        console.error('Fetch failed');
      } finally {
        setIsLoading(false);
      }
    };
    fetchNotices();
  }, [studentId]);

  const handleShowMore = () => {
    const currentCount = displayedNotices.length;
    const nextBatch = allNotices.slice(0, currentCount + 5);
    setDisplayedNotices(nextBatch);
    setShowMoreAvailable(allNotices.length > nextBatch.length);
  };

  if (isLoading && displayedNotices.length === 0) return (
    <div className="flex flex-col items-center justify-center py-20 animate-pulse">
      <div className="w-12 h-12 border-4 border-[#7A8B5E] border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-[10px] font-black text-[#7A8B5E] uppercase tracking-widest">Accessing Bulletin...</p>
    </div>
  );

  return (
    <div className="space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1.5 h-6 bg-[#7A8B5E] rounded-full"></div>
            <h2 className="text-2xl font-black text-[#1A1F16] tracking-tight uppercase italic">Official Bulletin</h2>
          </div>
          <p className="text-xs font-bold text-[#6B7280] uppercase tracking-widest">Critical announcements & hostel updates</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 max-w-4xl">
        {displayedNotices.length === 0 ? (
          <div className="bg-white rounded-[40px] p-20 text-center border border-[#7A8B5E]/5 shadow-2xl shadow-[#7A8B5E]/5">
            <Info className="mx-auto text-[#7A8B5E] opacity-20 mb-4" size={48} />
            <p className="text-[10px] font-black text-[#6B7280] uppercase tracking-[0.2em]">The bulletin board is currently empty</p>
          </div>
        ) : (
          displayedNotices.map((notice, idx) => (
            <div key={idx} className="bg-white rounded-[40px] shadow-2xl shadow-[#7A8B5E]/5 border border-[#7A8B5E]/5 group hover:border-[#7A8B5E]/20 transition-all overflow-hidden animate-in fade-in slide-in-from-right-4 duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
              <div className="flex flex-col md:flex-row">
                
                {/* ── Visual Date Side ── */}
                <div className="md:w-48 bg-[#F8FAF5] p-8 flex flex-col justify-center items-center text-center border-b md:border-b-0 md:border-r border-[#7A8B5E]/5">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#7A8B5E] shadow-sm mb-4">
                    <Calendar size={20} />
                  </div>
                  <p className="text-2xl font-black text-[#1A1F16] leading-none uppercase italic">
                    {new Date(notice.issueDate).toLocaleDateString('en-GB', { day: '2-digit' })}
                  </p>
                  <p className="text-[10px] font-black text-[#7A8B5E] uppercase tracking-widest mt-1">
                    {new Date(notice.issueDate).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
                  </p>
                </div>

                {/* ── Content Side ── */}
                <div className="flex-1 p-8 md:p-10 relative">
                  {idx === 0 && (
                    <div className="absolute top-8 right-8 text-[#C5A059] opacity-40">
                      <Pin size={20} className="rotate-45" />
                    </div>
                  )}
                  
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-[#7A8B5E] animate-pulse"></div>
                      <span className="text-[8px] font-black text-[#7A8B5E] uppercase tracking-[0.2em]">Verified Announcement</span>
                    </div>
                    <h3 className="text-xl font-black text-[#1A1F16] uppercase italic tracking-tight leading-tight group-hover:text-[#7A8B5E] transition-colors">{notice.title}</h3>
                  </div>

                  <div className="space-y-4">
                    <p className="text-sm font-bold text-[#6B7280] leading-relaxed italic whitespace-pre-line">
                      {notice.message}
                    </p>
                  </div>

                  <div className="mt-8 pt-6 border-t border-[#7A8B5E]/5 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-[10px] font-black text-[#6B7280] uppercase tracking-widest opacity-60">
                      <Clock size={12} /> Issued {new Date(notice.issueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="flex -space-x-2">
                      <div className="w-6 h-6 rounded-full bg-[#7A8B5E]/10 border-2 border-white"></div>
                      <div className="w-6 h-6 rounded-full bg-[#C5A059]/10 border-2 border-white"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}

        {showMoreAvailable ? (
          <div className="flex justify-center pt-8">
            <button
              onClick={handleShowMore}
              className="px-10 py-5 bg-[#1A1F16] text-white rounded-[24px] font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl shadow-black/20 hover:bg-[#2A3324] transition-all transform hover:scale-105 active:scale-95 flex items-center gap-4"
            >
              Load Previous <ArrowRight size={16} />
            </button>
          </div>
        ) : allNotices.length > 5 ? (
          <div className="text-center pt-10">
            <p className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest opacity-40 italic">End of transmission dossier</p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default NoticePage;