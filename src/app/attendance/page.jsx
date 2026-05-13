'use client';
import React, { useState } from 'react';
import Sidebar from '@/components/layout/sidebar';
import Navbar from '@/components/layout/navbar';
import AttendanceLog from '@/components/attendance/AttendanceLog';

export default function AttendancePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main Content */}
      <div className="flex flex-col flex-1 md:ml-64">
        {/* Navbar */}
        <Navbar setSidebarOpen={setSidebarOpen} />

        {/* Scrollable Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          <AttendanceLog />
        </main>
      </div>
    </div>
  );
}
