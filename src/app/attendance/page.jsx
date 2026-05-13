'use client';
import React, { useState } from 'react';
import Sidebar from '@/components/layout/sidebar';
import Navbar from '@/components/layout/navbar';
import AttendanceLog from '@/components/attendance/AttendanceLog';

export default function AttendancePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#F8FAF5]">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex flex-col flex-1 lg:ml-72 transition-all duration-500">
        <Navbar setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 p-4 sm:p-8 lg:p-12 overflow-y-auto">
          <AttendanceLog />
        </main>
      </div>
    </div>
  );
}
