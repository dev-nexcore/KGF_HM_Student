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
import { toast, Toaster } from "react-hot-toast";
import Link from 'next/link';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function DashboardContent() {
  const [studentId, setStudentId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [checkStatus, setCheckStatus] = useState('Pending Check-in');
  const [checkTime, setCheckTime] = useState('--:--:--');
  const [roomNo, setRoomNo] = useState('');
  const [fees, setFees] = useState([]);
  const [latestLeave, setLatestLeave] = useState(null);
  const [inspection, setInspection] = useState(null);
  const [attendanceData, setAttendanceData] = useState({ present: 0, absent: 0 });
  const [totalDays, setTotalDays] = useState(0);
  const [selectedRange, setSelectedRange] = useState('day');
  const [barcodeId, setBarcodeId] = useState("");
  const [floor, setFloor] = useState("");
  const [legendTooltip, setLegendTooltip] = useState({ type: null, visible: false });


  const HOSTEL_LAT = 19.0760;
  const HOSTEL_LNG = 72.8777;
  const MAX_DISTANCE_KM = 0.3; // ~300 meters

  function getDistanceFromHostel(lat, lng) {
    const toRad = (value) => value * Math.PI / 180;
    const R = 6371; // km
    const dLat = toRad(lat - HOSTEL_LAT);
    const dLng = toRad(lng - HOSTEL_LNG);
    const a = Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(HOSTEL_LAT)) * Math.cos(toRad(lat)) *
      Math.sin(dLng / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const dist = getDistanceFromHostel(latitude, longitude);
        setIsWithinRange(dist <= MAX_DISTANCE_KM);
        setUserCoords({ lat: latitude, lng: longitude }); // <--- Add this
      },
      () => setIsWithinRange(false),
      { enableHighAccuracy: true }
    );
  }, []);


  const captureSelfie = async () => {
    const video = document.createElement('video');
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    await video.play();

    const canvas = document.createElement('canvas');
    canvas.width = 320; // or 640
    canvas.height = 240;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    stream.getTracks().forEach(track => track.stop());
    return canvas.toDataURL('image/jpeg');
  };


  useEffect(() => {
    const id = localStorage.getItem('studentId');
    setStudentId(id);
  }, []);

  useEffect(() => {
    if (!studentId) return;

    api
      .get(`/attendanceSummary/${studentId}?range=${selectedRange}`)
      .then((res) => {
        if (res.data) {
          setAttendanceData({
            present: res.data.present ?? 0,
            absent: res.data.absent ?? 0,
          });
          setTotalDays((res.data.present ?? 0) + (res.data.absent ?? 0));
        }
      })
      .catch((err) => {
        console.error('Failed to fetch attendance summary', err);
      });
  }, [studentId, selectedRange]);

  const chartData = {
    labels: ['Present', 'Absent'],
    datasets: [
      {
        data: [attendanceData.present ?? 0, attendanceData.absent ?? 0],
        backgroundColor: ['#4F8DCF', '#FF0000'],
        borderWidth: 0,
      },
    ],
  };

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const decoded = JSON.parse(atob(token.split(".")[1]));
        const studentId = decoded.studentId;

        const res = await api.get(`/profile/${studentId}`);// No studentId in path now
        if (res.status === 200) {
          const data = res.data;
          setCheckStatus(data.checkStatus || "Pending Check-in");
          setCheckTime(data.checkTime || "--:--:--");
          setRoomNo(data.roomNo);
          setStudentId(data.studentId);
          setBarcodeId(data.barcodeId || "N/A");
          setFloor(data.floor || "N/A");
        }
      } catch (err) {
        console.error("Failed to fetch student profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);


  useEffect(() => {
    const fetchFeesStatus = async () => {
      try {
        const res = await api.get(`/feeStatus`);
        if (res.status === 200 && res.data.fees) {
          setFees(res.data.fees);
        }
      } catch (error) {
        console.error('Failed to fetch fees:', error);
      }
    };

    if (studentId) {
      fetchFeesStatus();
    }
  }, [studentId]);

  useEffect(() => {
    const fetchLeaveStatus = async () => {
      try {
        const res = await api.get(`/leaves`);
        if (res.status === 200 && res.data.leaves.length > 0) {
          setLatestLeave(res.data.leaves[0]);
          console.log("Fetching leave history for studentId:", studentId);
        }
      } catch (error) {
        console.error("Failed to fetch leave history:", error);
      }
    };

    if (studentId) {
      fetchLeaveStatus();
    }
  }, [studentId]);

  useEffect(() => {
    const fetchInspection = async () => {
      try {
        const res = await api.get('/inspectionSchedule'); // token added by interceptor
        setInspection(res.data);
      } catch (err) {
        if (err.response?.status === 404) {
          setInspection(null); // No inspection scheduled
        } else {
          console.error('Unexpected error while fetching inspection:', err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchInspection();
  }, []);

  async function handleCheckIn() {
    setLoading(true);
    try {
      if (!isWithinRange) {
        toast.error('You are not near the hostel!');
        setLoading(false);
        return;
      }

      const selfieDataURL = await captureSelfie();
      const res = await api.post('/check-in', {
        selfie: selfieDataURL,
        location: userCoords,
      });

      if (res.status === 200) {
        const data = res.data;
        setCheckStatus('Checked In');
        setCheckTime(data.checkInDate || new Date().toLocaleString('en-US', {
          timeZone: 'Asia/Kolkata',
          hour12: true,
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        }));
        toast.success('Checked in successfully');

        setAttendanceData(prev => ({
          ...prev,
          present: prev.present + 1,
          absent: prev.absent - 1
        }));
        setTotalDays(prev => prev);

      } else {
        toast.error('Failed to check in');
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
      if (!isWithinRange) {
        toast.error("You are not near the hostel!");
        setLoading(false);
        return;
      }

      const selfieDataURL = await captureSelfie();
      const res = await api.post('/check-out', {
        selfie: selfieDataURL,
        location: userCoords,
      });

      if (res.status === 200) {
        const data = res.data;
        setCheckStatus('Checked Out');
        setCheckTime(data.checkOutDate || new Date().toLocaleString('en-US', {
          timeZone: 'Asia/Kolkata',
          hour12: true,
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        }));
        toast.success('Checked out successfully');
      } else {
        toast.error('Failed to check out');
      }
    } catch (err) {
      alert('Error checking out');
      console.error(err);
    }
    setLoading(false);
  }


  return (
    <main className="bg-[#ffffff] px-6 sm:px-8 lg:px-10 py-2 min-h-screen font-sans">
      <div className="flex items-center mb-4">
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-black border-l-4 border-[#4F8CCF] pl-2 mb-4 sm:mb-6">
          Overview
        </h2>
      </div>

      <div className="mt-4 flex flex-wrap justify-start gap-4 sm:gap-6">

        {/* Check-in / Out Card */}
        <div className="bg-white rounded-lg shadow-[0_4px_15px_rgba(0,0,0,0.2)] w-full sm:w-[calc(50%-12px)] max-w-[600px]">
          <div className="bg-[#AAB491] px-6 py-3 rounded-t-lg">
            <h2 className="text-lg font-semibold text-black text-center">Check-in /Out Status</h2>
          </div>
          <div className="p-8 pt-10 space-y-7 min-h-[280px]">
            <div className="flex justify-center items-center gap-3 text-base font-semibold text-black">
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
            <div className="flex justify-center items-center gap-3 text-base font-semibold text-black">
              <span>Time:</span>
              <span>{checkTime}</span>
            </div>
            <div className="pt-8 flex justify-center">
              <button
                onClick={
                  checkStatus === 'Checked In' ? handleCheckOut : handleCheckIn
                }
                disabled={loading}
                className="bg-[#AAB491] text-black text-base font-semibold px-6 py-3 rounded shadow hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading
                  ? checkStatus === 'Checked In'
                    ? 'Checking Out...'
                    : 'Checking In...'
                  : checkStatus === 'Checked In'
                    ? 'Check-Out Now'
                    : 'Check-In Now'}
              </button>
            </div>
          </div>
        </div>

        {/* Attendance Summary */}
        <div className="bg-white rounded-lg shadow-[0_4px_15px_rgba(0,0,0,0.2)] w-full sm:w-[calc(50%-12px)] max-w-[600px]">
          <div className="bg-[#AAB491] px-6 py-3 rounded-t-lg flex items-center justify-between">
            <h2 className="text-lg font-semibold text-black">Attendance Summary</h2>
            <select
              className="text-base text-black rounded px-3 py-2 bg-white"
              value={selectedRange}
              onChange={e => setSelectedRange(e.target.value.toLowerCase())}
            >
              <option value="day">Day</option>
              <option value="week">Week</option>
              <option value="month">Month</option>
            </select>
          </div>

          <div className="p-8 pt-9 flex min-h-[280px]">
            {/* Legend */}
            <div className="space-y-4 text-base mt-3 relative">
              <div
                className="flex items-center gap-3 relative group"
              >
                <span className="w-4 h-4 rounded-full bg-[#4F8DCF]"></span>
                <span className="text-black font-medium">Present</span>

                {/* Tooltip */}
                <div className="absolute left-28 top-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="relative bg-gray-900 text-white text-xs px-3 py-1 rounded-md shadow-md">
                    {attendanceData.present ?? 0} day{attendanceData.present === 1 ? '' : 's'}

                    {/* Tooltip Arrow */}
                    <div className="absolute left-[-6px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-6 border-t-transparent border-b-6 border-b-transparent border-r-6 border-r-gray-900"></div>
                  </div>
                </div>
              </div>

              <div
                className="flex items-center gap-3 relative group"
              >
                <span className="w-4 h-4 rounded-full bg-[#E30007]"></span>
                <span className="text-black font-medium">Absent</span>

                <div className="absolute left-28 top-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="relative bg-gray-900 text-white text-xs px-3 py-1 rounded-md shadow-md">
                    {attendanceData.absent ?? 0} day{attendanceData.absent === 1 ? '' : 's'}
                    <div className="absolute left-[-6px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-6 border-t-transparent border-b-6 border-b-transparent border-r-6 border-r-gray-900"></div>
                  </div>
                </div>
              </div>

            </div>

            {/* Pie Chart */}
            <div className="flex-1 flex justify-center items-center">
              <div className="relative w-36 h-36">
                <Pie
                  data={chartData}
                  options={{
                    cutout: '50%',
                    plugins: { legend: { display: false } },
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-base text-gray-500">Total</p>
                    <p className="text-xl font-bold text-black">{totalDays ?? '-'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Room Inspection Schedule */}
        <div className="bg-white rounded-lg shadow-[0_4px_15px_rgba(0,0,0,0.2)] w-full sm:w-[calc(50%-12px)] max-w-[600px] min-h-[300px]">
          <div className="bg-[#AAB491] px-6 py-3 rounded-t-lg">
            <h2 className="text-lg font-semibold text-black">Room Inspection Schedule</h2>
          </div>
          <div className="p-7 flex flex-col gap-5 text-base font-semibold text-black">
            {loading ? (
              <div>Loading...</div>
            ) : inspection ? (
              <>
                <div className="flex justify-between">
                  <span>Next Inspection:</span>
                  <span>
                    {inspection.date
                      ? new Date(inspection.date).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })
                      : 'Invalid Date'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Time:</span>
                  <span>
                    {inspection.date
                      ? new Date(inspection.date).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                      : '-'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className="text-[#4F8DCF] font-semibold">{inspection.status}</span>
                </div>
              </>
            ) : (
              <div className="text-base text-black">No upcoming inspections found</div>
            )}
          </div>
        </div>

        {/* Bed Allotment */}
        <Link href="/profile" passHref className="bg-white rounded-lg shadow-[0_4px_15px_rgba(0,0,0,0.2)] w-full sm:w-[calc(50%-12px)] max-w-[600px] min-h-[300px]">
          <div className="bg-[#AAB491] px-6 py-3 rounded-t-lg">
            <h2 className="text-lg font-semibold text-black">Bed Allotment</h2>
          </div>
          <div className="p-7 flex flex-col gap-5 text-base font-semibold text-black">
            <div className="flex justify-between"><span>Room no:</span><span>Room {roomNo}</span></div>
            <div className="flex justify-between"><span>Floor:</span><span>Floor {floor}</span></div>
            <div className="flex justify-between"><span>BedNo:</span><span>{barcodeId}</span></div>
          </div>
        </Link>

        {/* Fee Alerts */}
        <Link href="/fees-status" passHref className="bg-white rounded-lg shadow-[0_4px_15px_rgba(0,0,0,0.2)] w-full sm:w-[calc(50%-12px)] max-w-[600px] min-h-[300px]">
          <div className="bg-[#AAB491] px-6 py-3 rounded-t-lg">
            <h2 className="text-lg font-semibold text-black">Fee Alerts</h2>
          </div>
          <div className="p-7 flex flex-col gap-5 text-base font-semibold text-black">
            {fees.length > 0 ? (
              fees.map((fee, index) => (
                <div key={index} className="flex flex-col gap-3">
                  <div className="flex justify-between">
                    <span>{fee.feeType} Fee:</span>
                    <span
                      className={
                        fee.status === 'paid'
                          ? 'text-green-600'
                          : fee.status === 'unpaid'
                            ? 'text-yellow-600'
                            : 'text-red-600'
                      }
                    >
                      {fee.status.charAt(0).toUpperCase() + fee.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Due Date:</span>
                    <span>{new Date(fee.dueDate).toLocaleDateString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Amount:</span>
                    <span>₹ {fee.amount}</span>
                  </div>
                  {index < fees.length - 1 && <hr className="border-gray-300" />}
                </div>
              ))
            ) : (
              <div className="text-base">No fees found</div>
            )}
          </div>
        </Link>

        {/* Leave Approval Status */}
        <Link href="/leaves" passHref className="bg-white rounded-lg shadow-[0_4px_15px_rgba(0,0,0,0.2)] w-full sm:w-[calc(50%-12px)] max-w-[600px] min-h-[300px]">
          <div className="bg-[#AAB491] px-6 py-3 rounded-t-lg">
            <h2 className="text-lg font-semibold text-black">Leave Approval Status</h2>
          </div>
          <div className="p-7 flex flex-col gap-5 text-base font-semibold text-black">
            {latestLeave ? (
              <>
                <div className="flex justify-between">
                  <span>Last request:</span>
                  <span className="truncate max-w-[60%]">{latestLeave.leaveType}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span
                    className={`${latestLeave.status === 'approved' ? 'text-[#36FF09]' :
                      latestLeave.status === 'rejected' ? 'text-red-600' :
                        'text-yellow-500'
                      } font-semibold`}
                  >
                    {latestLeave.status}
                  </span>
                </div>
              </>
            ) : (
              <div className="text-base">No leave history found</div>
            )}
          </div>
        </Link>
      </div>
    </main>

  );
}