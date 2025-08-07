'use client';
import React, { useState, useEffect, useRef } from 'react';
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

const HOSTEL_LAT = 19.072618;
const HOSTEL_LNG = 72.880419;
const MAX_DISTANCE_KM = 0.3; // ~300 meters

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
  const [isWithinRange, setIsWithinRange] = useState(false);
  const [userCoords, setUserCoords] = useState(null);
  const [selfieModalOpen, setSelfieModalOpen] = useState(false);
  const [isCheckIn, setIsCheckIn] = useState(true); // To know which action to do
  const videoRef = useRef(null);
  const streamRef = useRef(null); // store media stream

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

  useEffect(() => {
    if (selfieModalOpen) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(err => {
          toast.error("Camera access denied.");
          setSelfieModalOpen(false);
        });
    }
  }, [selfieModalOpen]);

  function stopCamera() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  }

  function handleCancelSelfie() {
    stopCamera();
    setSelfieModalOpen(false);
  }

  async function handleCaptureSelfie() {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const selfieDataURL = canvas.toDataURL('image/jpeg');

    stopCamera();
    setSelfieModalOpen(false);

    if (!/^data:image\/jpeg;base64,[a-zA-Z0-9+/=]+$/.test(selfieDataURL)) {
      toast.error("Selfie capture failed.");
      return;
    }

    if (!isWithinRange) {
      toast.error("You are not near the hostel!");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post(isCheckIn ? '/check-in' : '/check-out', {
        selfie: selfieDataURL,
        location: userCoords,
      });

      if (res.status === 200) {
        const newStatus = isCheckIn ? 'Checked In' : 'Checked Out';
        const dateField = isCheckIn ? res.data.checkInDate : res.data.checkOutDate;

        setCheckStatus(newStatus);
        setCheckTime(dateField || new Date().toLocaleString('en-US', {
          timeZone: 'Asia/Kolkata',
          hour12: true,
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        }));

        toast.success(`${newStatus} successfully`);

        if (isCheckIn) {
          setAttendanceData(prev => ({
            ...prev,
            present: prev.present + 1,
            absent: prev.absent - 1
          }));
        }
      } else {
        toast.error("Failed to record entry");
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error("Server error during check-in/out");
    } finally {
      setLoading(false);
    }
  }

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
        const res = await api.get('/inspectionSchedule');

        if (res.status === 204 || !res.data?.date) {
          setInspection(null);
        } else {
          setInspection(res.data);
        }

      } catch (err) {
        console.error('Error fetching inspection:', err);
        setInspection(null);
      } finally {
        setLoading(false);
      }
    };

    fetchInspection();
  }, []);

  return (
    <main className="bg-[#ffffff] px-6 sm:px-8 lg:px-2.5 py-2 min-h-screen font-sans">
      <div className="flex items-center">
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-black border-l-4 border-[#4F8CCF] pl-2 mb-4 sm:mb-6">
          Overview
        </h2>
      </div>

      <div className="flex flex-wrap justify-start gap-4 sm:gap-6">

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
                onClick={() => {
                  if (loading) return;
                  setIsCheckIn(checkStatus !== "Checked In");
                  setSelfieModalOpen(true);
                }}
                disabled={loading}
                className="bg-[#AAB491] text-black text-base font-semibold px-6 py-3 rounded shadow hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading
                  ? checkStatus === "Checked In"
                    ? "Checking Out..."
                    : "Checking In..."
                  : checkStatus === "Checked In"
                    ? "Check-Out Now"
                    : "Check-In Now"}
              </button>
            </div>
          </div>
        </div>

        {/* Selfie Capture Modal */}
        {selfieModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">
              <h2 className="text-lg font-bold text-center mb-4">
                Capture Your Selfie
              </h2>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full rounded mb-4"
              />
              <div className="flex justify-between">
                <button
                  onClick={handleCancelSelfie}
                  disabled={loading}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCaptureSelfie}
                  disabled={loading}
                  className="px-4 py-2 bg-[#AAB491] text-black font-semibold rounded hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Capture
                </button>
              </div>
            </div>
          </div>
        )}

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
                      : '-'}
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
                  <span className="text-[#4F8DCF] font-semibold">{inspection.status || '-'}</span>
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