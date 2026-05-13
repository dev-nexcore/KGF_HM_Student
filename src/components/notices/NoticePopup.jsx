'use client';

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Bell, 
  X, 
  ArrowRight, 
  Calendar, 
  ChevronRight,
  Info,
  Clock
} from "lucide-react";

const NoticePopup = ({ notice, onMarkAsRead }) => {
  const router = useRouter();

  if (!notice) return null;

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onMarkAsRead();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onMarkAsRead]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onMarkAsRead();
  };

  const handleViewAll = () => {
    onMarkAsRead();
    router.push("/notices");
  };

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 bg-[#1A1F16]/60 backdrop-blur-md flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300"
    >
      <div
        className="bg-white rounded-[48px] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-500 border border-[#7A8B5E]/10"
      >
        {/* ── Premium Header ── */}
        <div className="bg-[#1A1F16] p-10 text-white relative">
          <button 
            onClick={onMarkAsRead}
            className="absolute top-8 right-8 text-white/40 hover:text-white transition-all hover:rotate-90"
          >
            <X size={20} />
          </button>
          
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1.5 h-6 bg-[#7A8B5E] rounded-full"></div>
            <h2 className="text-2xl font-black text-white tracking-tight uppercase italic leading-none">Bulletin</h2>
          </div>
          <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">New Resident Communiqué</p>
          
          <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-[#7A8B5E]/10 rounded-full blur-3xl"></div>
        </div>

        {/* ── Content Body ── */}
        <div className="p-10 pt-12">
          {/* Metadata Section */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2 bg-[#F8FAF5] px-4 py-2 rounded-full border border-[#7A8B5E]/5">
              <Calendar size={12} className="text-[#7A8B5E]" />
              <span className="text-[10px] font-black text-[#7A8B5E] uppercase tracking-widest">
                {new Date(notice.issueDate).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-black text-[#6B7280] uppercase tracking-widest opacity-40">
              <Clock size={12} /> Priority Alert
            </div>
          </div>

          {/* Title Area */}
          <h3 className="text-2xl font-black text-[#1A1F16] mb-6 leading-tight uppercase italic tracking-tight">
            {notice.title}
          </h3>

          {/* Message Container */}
          <div className="relative group mb-10">
            <div className="absolute -left-10 top-0 bottom-0 w-1 bg-[#7A8B5E] rounded-full opacity-20"></div>
            <div className="bg-[#F8FAF5] rounded-[32px] p-8 border border-[#7A8B5E]/5 relative">
              <div className="absolute top-4 right-6 opacity-5">
                <Info size={40} />
              </div>
              <p className="text-sm font-bold text-[#6B7280] leading-relaxed whitespace-pre-line italic">
                {notice.message}
              </p>
            </div>
          </div>

          {/* ── Action Footer ── */}
          <div className="flex gap-4">
            <button
              onClick={onMarkAsRead}
              className="flex-1 px-8 py-5 rounded-[24px] bg-[#F8FAF5] text-[#1A1F16] font-black text-[10px] uppercase tracking-widest hover:bg-gray-100 transition-all active:scale-95"
            >
              Acknowledge
            </button>
            <button
              onClick={handleViewAll}
              className="flex-1 px-8 py-5 bg-[#1A1F16] text-white rounded-[24px] font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-black/20 hover:bg-[#2A3324] transition-all transform hover:scale-[1.03] active:scale-95 flex items-center justify-center gap-3"
            >
              Dossier <ChevronRight size={16} />
            </button>
          </div>
          
          <div className="text-center mt-8">
            <p className="text-[8px] font-black text-[#6B7280] uppercase tracking-[0.3em] opacity-30">KGF Official Transmission</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoticePopup;
