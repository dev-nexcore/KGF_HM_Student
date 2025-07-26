'use client';
import React from 'react';
import Navbar from '@/components/layout/navbar';
import Sidebar from '@/components/layout/sidebar';
import NoticesPage from '@/components/notices/NoticesPage';

export default function Notices() {
  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        {/* Navbar */}
        <Navbar />

        {/* Page Content */}
        <main className="p-4 overflow-y-auto">
          <NoticesPage />
        </main>
      </div>
    </div>
  );
}
