'use client';
import React, { useState } from 'react';
import Sidebar from '@/components/layout/sidebar';
import Navbar from '@/components/layout/navbar';
import DashboardContent from '@/components/dashboard/DashboardContent';

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#ffffff]">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        {/* Navbar */}
        <Navbar />

        {/* Scrollable dashboard content */}
        <div className="flex-1 p-5 lg:p-10">
          <DashboardContent />
        </div>
      </div>
    </div>
  );
}
