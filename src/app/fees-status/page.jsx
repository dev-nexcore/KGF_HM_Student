'use client';
import React, { useState } from 'react';
import Sidebar from '@/components/layout/sidebar';
import Navbar from '@/components/layout/navbar';
import FeesStatus from '@/components/fees/FeesStatus';

export default function FeesStatusPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen bg-white dark:bg-white">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex flex-col flex-1 h-full">
        {/* Navbar */}
        <Navbar />

        {/* Content - Allow scrolling but hide scrollbar */}
        <div 
          className="flex-1 p-5 lg:p-10 overflow-y-scroll"
          style={{
            msOverflowStyle: 'none',  /* IE and Edge */
            scrollbarWidth: 'none',   /* Firefox */
          }}
        >
          <style jsx>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          <FeesStatus />
        </div>
      </div>
    </div>
  );
}
