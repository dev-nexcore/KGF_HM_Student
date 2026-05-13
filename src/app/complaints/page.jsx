"use client";
import React, { useState } from 'react';
import Header from "@/components/layout/navbar";
import Complaints from "@/components/complaints/Complaints";
import Sidebar from "@/components/layout/sidebar";

export default function ComplaintsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#F8FAF5]">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex flex-col flex-1 lg:ml-72 transition-all duration-500">
        <Header setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 p-4 sm:p-8 lg:p-12 overflow-y-auto">
          <Complaints />
        </main>
      </div>
    </div>
  );
}