'use client';
import React, { useState } from 'react';
import Sidebar from '@/components/layout/sidebar';
import Navbar from '@/components/layout/navbar';
import FeesStatus from '@/components/fees/FeesStatus';

export default function FeesStatusPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-screen bg-white dark:bg-white">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        {/* Navbar */}
        <Navbar />

        {/* Content */}
        <div className="flex-1 p-5 lg:p-10 overflow-y-auto">
          <FeesStatus />
        </div>
      </div>
    </div>
  );
}
