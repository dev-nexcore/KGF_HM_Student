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



ChartJS.register(ArcElement, Tooltip, Legend);

export default function DashboardContent() {
  const [studentId, setStudentId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [checkStatus, setCheckStatus] = useState('Pending Check-in');
  const [checkTime, setCheckTime] = useState('--:--:--');
  const [roomNo, setRoomNo] = useState('');
  const [roommateName, setRoommateName] = useState('');
  const [bedAllotment, setBedAllotment] = useState('');
  const [fees, setFees] = useState([]);
  const [latestLeave, setLatestLeave] = useState(null);
  const [inspection, setInspection] = useState(null);
  const [attendanceData, setAttendanceData] = useState({ present: 0, absent: 0 });
  const [totalDays, setTotalDays] = useState(0);
  const [selectedRange, setSelectedRange] = useState('day');
  const [barcodeId, setBarcodeId] = useState("");
  const [floor, setFloor] = useState("");


  useEffect(() => {
    const id = localStorage.getItem('studentId');
    setStudentId(id);
  }, []);

  useEffect(() => {
    if (!studentId) return;

    api
      .get(`/attendanceSummary/${studentId}?range=${selectedRange}`)
      .then((res) => {
        setAttendanceData({
          present: res.data.present,
          absent: res.data.absent,
        });
        setTotalDays(res.data.present + res.data.absent);
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
          setBedAllotment(data.bedAllotment);
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
        const res = await api.get(`/feeStatus/${studentId}`);
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
        const res = await api.get(`/leaves/${studentId}`);
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
        const token = localStorage.getItem("token");
        const decoded = JSON.parse(atob(token.split(".")[1]));
        const studentId = decoded.studentId;
        const res = await api.get(`/inspectionSchedule`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setInspection(res.data);
      } catch (err) {
        if (err.response?.status === 404) {
          // This is expected when there's no upcoming inspection
          setInspection(null);
        } else {
          // Only log unexpected errors (e.g. 500)
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
      const res = await api.post('/check-in', { studentId });

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
      const res = await api.post('/check-out', { studentId });

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
            <div className="space-y-4 text-base mt-3">
              <div className="flex items-center gap-3">
                <span className="w-4 h-4 rounded-full bg-[#4F8DCF]"></span>
                <span className="text-black font-medium">Present</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-4 h-4 rounded-full bg-[#E30007]"></span>
                <span className="text-black font-medium">Absent</span>
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
                    {new Date(inspection.datetime).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Time:</span>
                  <span>
                    {new Date(inspection.datetime).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className="text-[#4F8DCF] font-semibold">Scheduled</span>
                </div>
              </>
            ) : (
              <div className="text-base text-black">No upcoming inspections found</div>
            )}
          </div>
        </div>

        {/* Bed Allotment */}
        <div className="bg-white rounded-lg shadow-[0_4px_15px_rgba(0,0,0,0.2)] w-full sm:w-[calc(50%-12px)] max-w-[600px] min-h-[300px]">
          <div className="bg-[#AAB491] px-6 py-3 rounded-t-lg">
            <h2 className="text-lg font-semibold text-black">Bed Allotment</h2>
          </div>
          <div className="p-7 flex flex-col gap-5 text-base font-semibold text-black">
            <div className="flex justify-between"><span>Room no:</span><span>Room {roomNo}</span></div>
            <div className="flex justify-between"><span>Floor:</span><span>Floor {floor}</span></div>
            <div className="flex justify-between"><span>BedNo:</span><span>{barcodeId}</span></div>
          </div>
        </div>

        {/* Fee Alerts */}
        <div className="bg-white rounded-lg shadow-[0_4px_15px_rgba(0,0,0,0.2)] w-full sm:w-[calc(50%-12px)] max-w-[600px] min-h-[300px]">
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
        </div>

        {/* Leave Approval Status */}
        <div className="bg-white rounded-lg shadow-[0_4px_15px_rgba(0,0,0,0.2)] w-full sm:w-[calc(50%-12px)] max-w-[600px] min-h-[300px]">
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
        </div>
      </div>
    </main>

  );
}