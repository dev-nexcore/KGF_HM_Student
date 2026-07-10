"use client";
import React, { useState, useEffect, useRef } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import api from "@/lib/api";
import { toast, Toaster } from "react-hot-toast";
import Link from "next/link";
import NoticePopup from "../notices/NoticePopup";
import { 
  FiCoffee, 
  FiAlertCircle, 
  FiFileText, 
  FiUser, 
  FiClock, 
  FiCheckCircle, 
  FiInfo,
  FiArrowRight
} from "react-icons/fi";


ChartJS.register(ArcElement, Tooltip, Legend);

const HOSTEL_LAT = 19.072618;
const HOSTEL_LNG = 72.880419;
const MAX_DISTANCE_KM = 0.3; // ~300 meters

export default function DashboardContent() {
  const [studentId, setStudentId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [checkStatus, setCheckStatus] = useState("Pending Check-in");
  const [checkTime, setCheckTime] = useState("--:--:--");
  const [roomNo, setRoomNo] = useState("");
  const [fees, setFees] = useState([]);
  const [latestLeave, setLatestLeave] = useState(null);
  const [inspection, setInspection] = useState(null);
  const [attendanceData, setAttendanceData] = useState({
    present: 0,
    absent: 0,
  });
  const [totalDays, setTotalDays] = useState(0);
  const [selectedRange, setSelectedRange] = useState("month");
  const [barcodeId, setBarcodeId] = useState("");
  const [bedAllotment, setBedAllotment] = useState("");
  const [floor, setFloor] = useState("");
  const [isWithinRange, setIsWithinRange] = useState(false);
  const [userCoords, setUserCoords] = useState(null);
  const [selfieModalOpen, setSelfieModalOpen] = useState(false);
  const [isCheckIn, setIsCheckIn] = useState(true);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Notice Popup States
  const [latestNotice, setLatestNotice] = useState(null);
  const [showNoticePopup, setShowNoticePopup] = useState(false);
  const [recentNotices, setRecentNotices] = useState([]);

  // New States
  const [complaints, setComplaints] = useState([]);

  function getDistanceFromHostel(lat, lng) {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat - HOSTEL_LAT);
    const dLng = toRad(lng - HOSTEL_LNG);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(HOSTEL_LAT)) *
        Math.cos(toRad(lat)) *
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
        setUserCoords({ lat: latitude, lng: longitude });
      },
      () => setIsWithinRange(false),
      { enableHighAccuracy: true }
    );
  }, []);

  useEffect(() => {
    if (selfieModalOpen) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((err) => {
          toast.error("Camera access denied.");
          setSelfieModalOpen(false);
        });
    }
  }, [selfieModalOpen]);

  function stopCamera() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
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

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const selfieDataURL = canvas.toDataURL("image/jpeg");

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
      const res = await api.post(isCheckIn ? "/check-in" : "/check-out", {
        selfie: selfieDataURL,
        location: userCoords,
      });

      if (res.status === 200) {
        const newStatus = isCheckIn ? "Checked In" : "Checked Out";
        const dateField = isCheckIn
          ? res.data.checkInDate
          : res.data.checkOutDate;

        setCheckStatus(newStatus);
        setCheckTime(
          dateField ||
            new Date().toLocaleString("en-US", {
              timeZone: "Asia/Kolkata",
              hour12: true,
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })
        );

        toast.success(`${newStatus} successfully`);

        if (isCheckIn) {
          setAttendanceData((prev) => ({
            ...prev,
            present: prev.present + 1,
            absent: prev.absent - 1,
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
    const id = localStorage.getItem("studentId");
    setStudentId(id);
  }, []);

  // Fetch notices and check for new ones
  useEffect(() => {
    if (!studentId) return;

    let isMounted = true;

    const fetchNoticesAndCheckPopup = async () => {
      try {
        const res = await api.get(`/notices`);

        if (!isMounted) return;

        if (res.data.notices && res.data.notices.length > 0) {
          // Sort by issueDate descending (latest first)
          const sortedNotices = [...res.data.notices].sort(
            (a, b) => new Date(b.issueDate) - new Date(a.issueDate)
          );

          // Always set recent notices for the card
          setRecentNotices(sortedNotices.slice(0, 3));
          
          // Find the newest notice that hasn't been read by the student
          const firstUnreadNotice = sortedNotices.find(n => !n.isRead);

          // Popup Logic - ONLY SHOW ONCE PER LOGIN SESSION
          const noticeShownThisSession = sessionStorage.getItem(
            `noticeShown_${studentId}`
          );

          if (noticeShownThisSession !== "true") {
            if (firstUnreadNotice) {
              setLatestNotice(firstUnreadNotice);
              setShowNoticePopup(true);
            }
          }
        }
      } catch (err) {
        console.error("Error fetching notices:", err);
      }
    };

    // Delay for better UX
    const timer = setTimeout(fetchNoticesAndCheckPopup, 1000);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [studentId]);

  // Handle marking notice as read - PERMANENT
  const handleMarkNoticeAsRead = async () => {
    if (latestNotice && studentId) {
      // Mark in backend so it persists across devices/logins
      try {
        await api.patch(`/notices/${latestNotice._id || latestNotice.id}/read`);
      } catch (err) {
        console.error("Failed to mark notice as read in backend", err);
      }

      // Also mark in sessionStorage that we've shown it
      sessionStorage.setItem(`noticeShown_${studentId}`, "true");
    }

    // Close the popup
    setShowNoticePopup(false);
  };

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
        console.error("Failed to fetch attendance summary", err);
      });
  }, [studentId, selectedRange]);

  const chartData = {
    labels: ["Present", "Absent"],
    datasets: [
      {
        data: [attendanceData.present ?? 0, attendanceData.absent ?? 0],
        backgroundColor: ["#4F8DCF", "#FF0000"],
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

        const res = await api.get(`/profile/${studentId}`);
        if (res.status === 200) {
          const data = res.data;
          setCheckStatus(data.checkStatus || "Pending Check-in");
          setCheckTime(data.checkTime || "--:--:--");
          setRoomNo(data.roomNo);
          setStudentId(data.studentId);
          setBarcodeId(data.barcodeId || "N/A");
          setBedAllotment(data.bedAllotment || "N/A");
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
        console.error("Failed to fetch fees:", error);
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
    const fetchComplaints = async () => {
      try {
        const res = await api.get(`/complaints`);
        if (res.status === 200 && res.data.complaints) {
          setComplaints(res.data.complaints.slice(0, 2));
        }
      } catch (err) {
        console.error("Error fetching complaints:", err);
      }
    };

    if (studentId) {
      fetchComplaints();
    }
  }, [studentId]);

  useEffect(() => {
    const fetchInspection = async () => {
      try {
        const res = await api.get("/inspectionSchedule");

        if (res.status === 204 || !res.data?.date) {
          setInspection(null);
        } else {
          setInspection(res.data);
        }
      } catch (err) {
        console.error("Error fetching inspection:", err);
        setInspection(null);
      } finally {
        setLoading(false);
      }
    };

    if (studentId) {
      fetchInspection();
    }
  }, [studentId]);

  return (
    <main className="bg-[#ffffff] px-6 sm:px-8 lg:px-2.5 py-2 min-h-screen font-sans">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-black border-l-4 border-[#4F8DCF] pl-2">
          Overview
        </h2>
        <div className="text-sm text-gray-500 font-medium">
          Last login: {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-8">
        <Link href="/leaves" className="flex flex-col md:flex-row items-center gap-2 md:gap-3 bg-white p-3 md:p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all active:scale-95">
          <div className="p-2 md:p-3 bg-blue-50 rounded-lg text-blue-600 text-lg md:text-xl">
            <FiFileText />
          </div>
          <div className="text-center md:text-left">
            <p className="text-xs md:text-sm font-bold text-gray-800">Apply Leave</p>
            <p className="hidden md:block text-[10px] md:text-xs text-gray-500">Gate pass/Leave</p>
          </div>
        </Link>
        <Link href="/complaints" className="flex flex-col md:flex-row items-center gap-2 md:gap-3 bg-white p-3 md:p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all active:scale-95">
          <div className="p-2 md:p-3 bg-orange-50 rounded-lg text-orange-600 text-lg md:text-xl">
            <FiAlertCircle />
          </div>
          <div className="text-center md:text-left">
            <p className="text-xs md:text-sm font-bold text-gray-800">Complaint</p>
            <p className="hidden md:block text-[10px] md:text-xs text-gray-500">Maintenance</p>
          </div>
        </Link>
        <Link href="/fees-status" className="flex flex-col md:flex-row items-center gap-2 md:gap-3 bg-white p-3 md:p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all active:scale-95">
          <div className="p-2 md:p-3 bg-green-50 rounded-lg text-green-600 text-lg md:text-xl">
            <FiCheckCircle />
          </div>
          <div className="text-center md:text-left">
            <p className="text-xs md:text-sm font-bold text-gray-800">Fee Payment</p>
            <p className="hidden md:block text-[10px] md:text-xs text-gray-500">Dues & Alerts</p>
          </div>
        </Link>
        <Link href="/profile" className="flex flex-col md:flex-row items-center gap-2 md:gap-3 bg-white p-3 md:p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all active:scale-95">
          <div className="p-2 md:p-3 bg-purple-50 rounded-lg text-purple-600 text-lg md:text-xl">
            <FiUser />
          </div>
          <div className="text-center md:text-left">
            <p className="text-xs md:text-sm font-bold text-gray-800">My Profile</p>
            <p className="hidden md:block text-[10px] md:text-xs text-gray-500">ID & Records</p>
          </div>
        </Link>
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Check-in / Out Card */}
        <div className="bg-white rounded-lg shadow-[0_4px_15px_rgba(0,0,0,0.2)] w-full">
          <div className="bg-[#AAB491] px-6 py-3 rounded-t-lg">
            <h2 className="text-lg font-semibold text-black text-center">
              Check-in /Out Status
            </h2>
          </div>
          <div className="p-8 pt-10 space-y-7 min-h-[280px]">
            <div className="flex justify-center items-center gap-3 text-base font-semibold text-black">
              <span>Status:</span>
              <span
                className={`${
                  checkStatus === "Checked In"
                    ? "text-green-600"
                    : checkStatus === "Checked Out"
                    ? "text-blue-600"
                    : "text-[#FF7700]"
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
        <Link href="/attendance" className="bg-white rounded-lg shadow-[0_4px_15px_rgba(0,0,0,0.2)] w-full min-h-[300px] hover:shadow-xl transition-shadow group">
          <div className="bg-[#AAB491] px-6 py-3 rounded-t-lg flex items-center justify-between">
            <h2 className="text-lg font-semibold text-black">
              Attendance Summary
            </h2>
            <FiArrowRight className="text-black opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="p-7 flex flex-col sm:flex-row items-center gap-5">
            <div className="flex flex-col gap-6 text-sm font-semibold">
              <div className="flex items-center gap-3 relative group/tip">
                <span className="w-4 h-4 rounded-full bg-[#1853A1]"></span>
                <span className="text-black font-medium">Present</span>
                <div className="absolute left-28 top-1 opacity-0 group-hover/tip:opacity-100 transition-opacity duration-200">
                  <div className="relative bg-gray-900 text-white text-xs px-3 py-1 rounded-md shadow-md">
                    {attendanceData.present ?? 0} day
                    {attendanceData.present === 1 ? "" : "s"}
                    <div className="absolute left-[-6px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-6 border-t-transparent border-b-6 border-b-transparent border-r-6 border-r-gray-900"></div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 relative group/tip">
                <span className="w-4 h-4 rounded-full bg-[#E30007]"></span>
                <span className="text-black font-medium">Absent</span>
                <div className="absolute left-28 top-1 opacity-0 group-hover/tip:opacity-100 transition-opacity duration-200">
                  <div className="relative bg-gray-900 text-white text-xs px-3 py-1 rounded-md shadow-md">
                    {attendanceData.absent ?? 0} day
                    {attendanceData.absent === 1 ? "" : "s"}
                    <div className="absolute left-[-6px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-6 border-t-transparent border-b-6 border-b-transparent border-r-6 border-r-gray-900"></div>
                  </div>
                </div>
              </div>
              
              <div className="mt-2 text-[10px] text-blue-600 font-bold flex items-center gap-1">
                <FiClock /> Click to view detailed logs
              </div>
            </div>

            <div className="flex-1 flex justify-center items-center">
              <div className="relative w-36 h-36">
                <Pie
                  data={chartData}
                  options={{
                    cutout: "50%",
                    plugins: { legend: { display: false } },
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-base text-gray-500">Total</p>
                    <p className="text-xl font-bold text-black">
                      {totalDays ?? "-"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Link>

        {/* Room Inspection Schedule */}
        {/* <div className="bg-white rounded-lg shadow-[0_4px_15px_rgba(0,0,0,0.2)] w-full min-h-[300px]">
          <div className="bg-[#AAB491] px-6 py-3 rounded-t-lg">
            <h2 className="text-lg font-semibold text-black">
              Room Inspection Schedule
            </h2>
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
                      ? new Date(inspection.date).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })
                      : "-"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Time:</span>
                  <span>
                    {inspection.date
                      ? new Date(inspection.date).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "-"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className="text-[#4F8DCF] font-semibold">
                    {inspection.status || "-"}
                  </span>
                </div>
              </>
            ) : (
              <div className="text-base text-black">
                No upcoming inspections found
              </div>
            )}
          </div>
        </div> */}

        {/* Bed Allotment */}
        <Link
          href="/profile"
          passHref
          className="bg-white rounded-lg shadow-[0_4px_15px_rgba(0,0,0,0.2)] w-full min-h-[300px]"
        >
          <div className="bg-[#AAB491] px-6 py-3 rounded-t-lg">
            <h2 className="text-lg font-semibold text-black">Bed Allotment</h2>
          </div>
          <div className="p-7 flex flex-col gap-5 text-base font-semibold text-black">
            <div className="flex justify-between">
              <span>Room no:</span>
              <span>Room {roomNo}</span>
            </div>
            <div className="flex justify-between">
              <span>Floor:</span>
              <span>Floor {floor}</span>
            </div>
            <div className="flex justify-between">
              <span>BedNo:</span>
              <span>{bedAllotment}</span>
            </div>
          </div>
        </Link>

        {/* Fee Alerts */}
        <Link
          href="/fees-status"
          passHref
          className="bg-white rounded-lg shadow-[0_4px_15px_rgba(0,0,0,0.2)] w-full min-h-[300px]"
        >
          <div className="bg-[#AAB491] px-6 py-3 rounded-t-lg">
            <h2 className="text-lg font-semibold text-black">Fee Alerts</h2>
          </div>
          <div className="p-7 flex flex-col gap-5 text-base font-semibold text-black">
            {fees.length > 0 ? (
              <>
                {fees.slice(0, 2).map((fee, index) => (
                  <div key={index} className="flex flex-col gap-3">
                    <div className="flex justify-between">
                      <span>{fee.feeType}:</span>
                      <span
                        className={
                          fee.status === "paid"
                            ? "text-green-600"
                            : fee.status === "unpaid"
                            ? "text-yellow-600"
                            : "text-red-600"
                        }
                      >
                        {fee.status.charAt(0).toUpperCase() + fee.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Due Date:</span>
                      <span>
                        {new Date(fee.dueDate).toLocaleDateString("en-GB", { day: '2-digit', month: '2-digit', year: 'numeric' })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Amount:</span>
                      <span>₹ {fee.amount}</span>
                    </div>
                    {index < fees.slice(0, 2).length - 1 && (
                      <hr className="border-gray-300" />
                    )}
                  </div>
                ))}
                {fees.length > 2 && (
                  <p className="text-center text-xs text-[#4F8DCF] font-semibold mt-2">View more</p>
                )}
              </>
            ) : (
              <div className="text-base">No fees found</div>
            )}
          </div>
        </Link>


        {/* Complaint Status Card */}
        <Link
          href="/complaints"
          passHref
          className="bg-white rounded-lg shadow-[0_4px_15px_rgba(0,0,0,0.2)] w-full min-h-[300px]"
        >
          <div className="bg-[#AAB491] px-6 py-3 rounded-t-lg flex items-center justify-between">
            <h2 className="text-lg font-semibold text-black flex items-center gap-2">
              <FiAlertCircle /> Active Complaints
            </h2>
            <FiArrowRight className="text-black" />
          </div>
          <div className="p-6">
            {complaints.length > 0 ? (
              <div className="space-y-4">
                {complaints.map((comp, idx) => (
                  <div key={idx} className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-sm font-bold text-gray-800 truncate max-w-[70%]">{comp.subject}</span>
                      <span className={`text-[10px] uppercase px-2 py-0.5 rounded-full font-bold ${
                        comp.status === 'Resolved' ? 'bg-green-100 text-green-700' : 
                        comp.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {comp.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-gray-500">
                      <FiClock /> {new Date(comp.filedDate || comp.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                    </div>
                  </div>
                ))}
                <p className="text-center text-xs text-[#4F8DCF] font-semibold mt-2">View all complaints</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                <FiCheckCircle size={40} className="mb-2 opacity-20" />
                <p className="text-sm">No active complaints</p>
              </div>
            )}
          </div>
        </Link>

        {/* Recent Notices Card */}
        <div className="bg-white rounded-lg shadow-[0_4px_15px_rgba(0,0,0,0.2)] w-full min-h-[300px]">
          <div className="bg-[#AAB491] px-6 py-3 rounded-t-lg">
            <h2 className="text-lg font-semibold text-black flex items-center gap-2">
              <FiInfo /> Recent Notices
            </h2>
          </div>
          <div className="p-6">
            {recentNotices.length > 0 ? (
              <div className="space-y-4">
                {recentNotices.map((notice, idx) => (
                  <div key={idx} className="border-l-4 border-blue-400 pl-3 py-1">
                    <h4 className="text-sm font-bold text-gray-800 line-clamp-1">{notice.title}</h4>
                    <p className="text-xs text-gray-500 line-clamp-1">{notice.message}</p>
                    <span className="text-[10px] text-gray-400 font-medium">
                      {new Date(notice.issueDate).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                    </span>
                  </div>
                ))}
                <Link href="/notices" className="block text-center text-xs text-[#4F8DCF] font-semibold mt-2">
                  View all notices
                </Link>
              </div>
            ) : (
              <div className="text-center py-10 text-gray-400">
                <p className="text-sm">No recent notices</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Notice Popup */}
      {showNoticePopup && (
        <NoticePopup
          notice={latestNotice}
          onMarkAsRead={handleMarkNoticeAsRead}
        />
      )}
    </main>
  );
}
