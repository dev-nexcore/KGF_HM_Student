'use client';
import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import api from '@/lib/api';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function DashboardContent() {
  const [studentId, setStudentId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [checkStatus, setCheckStatus] = useState('Pending Check-in');
  const [checkTime, setCheckTime] = useState('--:--:--');
  const [roomNo, setRoomNo] = useState('');
  const [roommateName, setRoommateName] = useState('');
  const [bedAllotment, setBedAllotment] = useState('');


  const attendanceData = {
    labels: ['Present', 'Absent'],
    datasets: [
      {
        data: [27, 3],
        backgroundColor: ['#36FF09', '#FF0000'],
        borderWidth: 0,
      },
    ],
  };

  useEffect(() => {
    const id = localStorage.getItem('studentId');
    setStudentId(id);
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get(`/profile/${studentId}`);

        if (res.status === 200) {
          const data = res.data;
          setCheckStatus(data.checkStatus || "Pending Check-in");
          setCheckTime(data.checkTime || "--:--:--");
          setRoomNo(data.roomNo);
          setRoommateName(data.roommateName);
          setBedAllotment(data.bedAllotment);
        }
      } catch (err) {
        console.error("Failed to fetch student profile:", err);
      }
    };

    if (studentId) {
      fetchProfile();
    }
  }, [studentId]);

  async function handleCheckIn() {
    setLoading(true);
    try {
      // Assuming your backend API expects studentId in body or headers
      const res = await api.post('/check-in', { studentId });

      if (res.status === 200) {
        const data = res.data;
        setCheckStatus('Checked In');
        setCheckTime(data.checkInDate || new Date().toLocaleTimeString());
        alert(data.message || 'Checked in successfully');
      } else {
        alert(res.data.message || 'Failed to check in');
      }
    } catch (err) {
      alert('Error checking in');
      console.error(err);
    }
    setLoading(false);
  }

  async function handleCheckOut() {
    setLoading(true);
    try {
      const res = await api.post('/check-out', { studentId });

      if (res.status === 200) {
        const data = res.data;
        setCheckStatus('Checked Out');
        setCheckTime(data.checkInDate || new Date().toLocaleTimeString());
        alert(data.message || 'Checked out successfully');
      } else {
        alert(res.data.message || 'Failed to check out');
      }
    } catch (err) {
      alert('Error checking out');
      console.error(err);
    }
    setLoading(false);
  }

  return (
    <main className="bg-[#ffffff] px-4 sm:px-6 lg:px-8 py-2 min-h-screen font-sans">
     <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold border-l-4 border-red-600 pl-3 mb-6 sm:mb-8 -ml-6 mt-0 text-[#2c2c2c]">
   Overview
</h1>

      {/* Responsive flex wrapper for cards */}
      <div className="mt-4 flex flex-wrap justify-center sm:justify-start gap-4 sm:gap-6">

        {/* Check-in / Out Card */}
        <div className="bg-white rounded-lg shadow-[0_4px_15px_rgba(0,0,0,0.2)] w-full sm:w-[calc(50%-12px)] max-w-[500px]">
          <div className="bg-[#AAB491] px-4 py-3 rounded-t-lg flex items-center justify-between">
            <h2 className="text-xl font-bold text-black">Check-in / Out Status</h2>
          </div>
          <div className="p-6 pt-7 space-y-5">
            <div className="flex justify-center items-center gap-3 text-[1.05rem] font-semibold text-black">
              <span>Status:</span>
              <span
                className={`${checkStatus === 'Checked In'
                  ? 'text-green-600'
                  : checkStatus === 'Checked Out'
                    ? 'text-blue-600'
                    : 'text-[#FF7700]'
                  }`}
              >
                {checkStatus}
              </span>
            </div>
            <div className="flex justify-center items-center gap-3 text-[1.05rem] font-semibold text-black">
              <span>Time:</span>
              <span>{checkTime}</span>
            </div>
            <div className="pt-5 flex justify-center">
              <button className="bg-[#AAB491] text-black text-[1.05rem] font-semibold px-5 py-2.5 rounded shadow hover:opacity-90">
                Check-In Now
              </button>
            </div>
          </div>
        </div>

        {/* Attendance Summary */}
        <div className="bg-white rounded-lg shadow-[0_4px_15px_rgba(0,0,0,0.2)] w-full sm:w-[calc(50%-12px)] max-w-[500px]">
          <div className="bg-[#AAB491] px-4 py-3 rounded-t-lg flex items-center justify-between">
            <h2 className="text-xl font-bold text-black">Attendance Summary</h2>
            <select className="text-[1.05rem] text-black rounded px-2.5 py-1.5 bg-white">
              <option>Day</option>
              <option>Week</option>
              <option>Month</option>
            </select>
          </div>
          <div className="p-6 pt-7 flex">
            <div className="space-y-4 text-[1.05rem] mt-2">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-[#36FF09]"></span>
                <span className="text-black font-medium">Present</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-[#FF0000]"></span>
                <span className="text-black font-medium">Absent</span>
              </div>
            </div>
            <div className="flex-1 flex justify-center items-center">
              <div className="relative w-32 h-32">
                <Pie
                  data={attendanceData}
                  options={{
                    cutout: '40%',
                    plugins: {
                      legend: { display: false },
                    },
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-[0.75rem] text-gray-500">Total</p>
                    <p className="text-[0.75rem] font-bold text-black">30</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Room Inspection Schedule */}
        <div className="bg-white rounded-lg shadow-[0_4px_15px_rgba(0,0,0,0.2)] w-full sm:w-[calc(50%-12px)] max-w-[500px] h-[250px]">
          <div className="bg-[#AAB491] px-4 py-3 rounded-t-lg">
            <h2 className="text-xl font-bold text-black">Room Inspection Schedule</h2>
          </div>
          <div className="p-5 flex flex-col gap-6 text-[1.05rem] font-semibold text-black">
            <div className="flex justify-between">
              <span>Next Inspection:</span>
              <span>21th July 2025</span>
            </div>
            <div className="flex justify-between">
              <span>Time:</span>
              <span>10:00 AM</span>
            </div>
            <div className="flex justify-between">
              <span>Status:</span>
              <span className="text-[#06FF0E] font-semibold">Scheduled</span>
            </div>
          </div>
        </div>

        {/* Bed Allotment */}
        <div className="bg-white rounded-lg shadow-[0_4px_15px_rgba(0,0,0,0.2)] w-full sm:w-[calc(50%-12px)] max-w-[500px] h-[250px]">
          <div className="bg-[#AAB491] px-4 py-3 rounded-t-lg">
            <h2 className="text-xl font-bold text-black">Bed Allotment</h2>
          </div>
          <div className="p-5 flex flex-col gap-6 text-[1.05rem] font-semibold text-black">
            <div className="flex justify-between"><span>Room no:</span><span>A-203</span></div>
            <div className="flex justify-between"><span>Beds Occupied:</span><span>2/2</span></div>
            <div className="flex justify-between"><span>Roommate:</span><span className="truncate max-w-[60%]">{roommateName}</span></div>
          </div>
        </div>

        {/* Fee Alerts */}
        <div className="bg-white rounded-lg shadow-[0_4px_15px_rgba(0,0,0,0.2)] w-full sm:w-[calc(50%-12px)] max-w-[500px] h-[250px]">
          <div className="bg-[#AAB491] px-4 py-3 rounded-t-lg">
            <h2 className="text-xl font-bold text-black">Fee Alerts</h2>
          </div>
          <div className="p-5 flex flex-col gap-5 text-[1.05rem] font-semibold text-black">
            <div className="flex justify-between"><span>Hostel Fee:</span><span className="text-red-600">Overdue</span></div>
            <div className="flex justify-between"><span>Due Date:</span><span>21th Oct 2025</span></div>
            <div className="flex justify-between"><span>Amount:</span><span>INR 10,000</span></div>
          </div>
        </div>

        {/* Leave Approval Status */}
        <div className="bg-white rounded-lg shadow-[0_4px_15px_rgba(0,0,0,0.2)] w-full sm:w-[calc(50%-12px)] max-w-[500px] h-[250px]">
          <div className="bg-[#AAB491] px-4 py-3 rounded-t-lg">
            <h2 className="text-xl font-bold text-black">Leave Approval Status</h2>
          </div>
          <div className="p-5 flex flex-col gap-5 text-[1.05rem] font-semibold text-black">
            <div className="flex justify-between"><span>Last request:</span><span className="truncate max-w-[60%]">Overnight Stay</span></div>
            <div className="flex justify-between"><span>Status:</span><span className="text-[#36FF09] font-semibold">Approved</span></div>
            <div className="flex justify-between"><span>Valid until:</span><span>21th Oct 2025</span></div>
          </div>
        </div>

      </div>
    </main>
  );
}
