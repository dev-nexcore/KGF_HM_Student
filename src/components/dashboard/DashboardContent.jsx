"use client";

import React, { useState, useEffect, useRef } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import api from "@/lib/api";
import { toast, Toaster } from "react-hot-toast";
import Link from "next/link";
import NoticePopup from "../notices/NoticePopup";
import { 
  Coffee, 
  AlertCircle, 
  FileText, 
  User, 
  Clock, 
  CheckCircle, 
  Info,
  ArrowRight,
  MapPin,
  Camera,
  Calendar,
  Home,
  CreditCard,
  Bell,
  ArrowUpRight,
  Wallet
} from "lucide-react";

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
  const [attendanceData, setAttendanceData] = useState({ present: 0, absent: 0 });
  const [totalDays, setTotalDays] = useState(0);
  const [selectedRange, setSelectedRange] = useState("day");
  const [bedAllotment, setBedAllotment] = useState("");
  const [floor, setFloor] = useState("");
  const [isWithinRange, setIsWithinRange] = useState(false);
  const [userCoords, setUserCoords] = useState(null);
  const [selfieModalOpen, setSelfieModalOpen] = useState(false);
  const [isCheckIn, setIsCheckIn] = useState(true);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const [latestNotice, setLatestNotice] = useState(null);
  const [showNoticePopup, setShowNoticePopup] = useState(false);
  const [recentNotices, setRecentNotices] = useState([]);
  const [complaints, setComplaints] = useState([]);

  function getDistanceFromHostel(lat, lng) {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat - HOSTEL_LAT);
    const dLng = toRad(lng - HOSTEL_LNG);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(HOSTEL_LAT)) * Math.cos(toRad(lat)) * Math.sin(dLng / 2) ** 2;
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
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          streamRef.current = stream;
          if (videoRef.current) videoRef.current.srcObject = stream;
        })
        .catch(() => {
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

    if (!isWithinRange) return toast.error("You are not near the hostel!");

    try {
      setLoading(true);
      const res = await api.post(isCheckIn ? "/check-in" : "/check-out", {
        selfie: selfieDataURL,
        location: userCoords,
      });

      if (res.status === 200) {
        const newStatus = isCheckIn ? "Checked In" : "Checked Out";
        setCheckStatus(newStatus);
        setCheckTime(new Date().toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit' }));
        toast.success(`${newStatus} recorded!`);
      }
    } catch (err) {
      toast.error("Failed to record entry");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const id = localStorage.getItem("studentId");
    if (id) setStudentId(id);
  }, []);

  useEffect(() => {
    if (!studentId) return;
    api.get(`/notices`).then(res => {
      if (res.data.notices && res.data.notices.length > 0) {
        const sorted = [...res.data.notices].sort((a, b) => new Date(b.issueDate) - new Date(a.issueDate));
        setRecentNotices(sorted.slice(0, 3));
        const newest = sorted[0];
        if (localStorage.getItem(`lastReadNotice_${studentId}`) !== (newest._id || newest.id)) {
          setLatestNotice(newest);
          setShowNoticePopup(true);
        }
      }
    });

    api.get(`/attendanceSummary/${studentId}?range=${selectedRange}`).then(res => {
      setAttendanceData({ present: res.data.present ?? 0, absent: res.data.absent ?? 0 });
      setTotalDays((res.data.present ?? 0) + (res.data.absent ?? 0));
    });

    api.get(`/profile/${studentId}`).then(res => {
      setCheckStatus(res.data.checkStatus || "Pending");
      setCheckTime(res.data.checkTime || "--:--");
      setRoomNo(res.data.roomNo);
      setBedAllotment(res.data.bedAllotment || "N/A");
      setFloor(res.data.floor || "N/A");
    });

    api.get(`/feeStatus`).then(res => setFees(res.data.fees || []));
    api.get(`/complaints`).then(res => setComplaints(res.data.complaints?.slice(0, 2) || []));
    api.get("/inspectionSchedule").then(res => setInspection(res.data?.date ? res.data : null));
  }, [studentId, selectedRange]);

  const chartData = {
    labels: ["Present", "Absent"],
    datasets: [{
      data: [attendanceData.present, attendanceData.absent],
      backgroundColor: ["#7A8B5E", "#E30007"],
      borderWidth: 0,
      hoverOffset: 4
    }]
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Toaster position="top-right" />
      
      {/* ── Quick Action Tiles ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <QuickAction href="/leaves" label="Gate Pass" sub="Apply Leave" icon={<FileText />} color="bg-blue-50 text-blue-600" />
        <QuickAction href="/complaints" label="Report" sub="Support Desk" icon={<AlertCircle />} color="bg-amber-50 text-amber-600" />
        <QuickAction href="/fees-status" label="Payments" sub="Fee Records" icon={<CreditCard />} color="bg-emerald-50 text-emerald-600" />
        <QuickAction href="/profile" label="Identity" sub="My Records" icon={<User />} color="bg-purple-50 text-purple-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ── Check-In/Out Premium Card ── */}
        <div className="lg:col-span-7 bg-white rounded-[40px] shadow-2xl shadow-[#7A8B5E]/5 border border-[#7A8B5E]/5 overflow-hidden flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 p-10 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#7A8B5E]/5">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-2 h-2 rounded-full bg-[#7A8B5E] animate-pulse"></div>
                <h3 className="text-[10px] font-black text-[#7A8B5E] uppercase tracking-[0.2em]">Gate Security</h3>
              </div>
              <h2 className="text-3xl font-black text-[#1A1F16] tracking-tight uppercase italic mb-8 leading-none">Attendance <br />Terminal</h2>
            </div>

            <div className="space-y-4">
              <div className="bg-[#F8FAF5] p-5 rounded-3xl flex items-center justify-between">
                <span className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest">Current Status</span>
                <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                  checkStatus === "Checked In" ? "bg-green-50 text-green-600 border-green-100" : "bg-amber-50 text-amber-600 border-amber-100"
                }`}>
                  {checkStatus}
                </span>
              </div>
              <div className="bg-[#F8FAF5] p-5 rounded-3xl flex items-center justify-between">
                <span className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest">Last Entry</span>
                <span className="text-sm font-black text-[#1A1F16]">{checkTime}</span>
              </div>
            </div>
          </div>

          <div className="w-full md:w-1/2 p-10 bg-[#F8FAF5]/50 flex flex-col items-center justify-center text-center">
            <div className="mb-8 relative group">
              <div className="absolute inset-0 bg-[#7A8B5E]/10 rounded-full scale-150 blur-2xl group-hover:scale-125 transition-transform"></div>
              <div className={`w-20 h-20 rounded-[28px] ${isWithinRange ? 'bg-[#7A8B5E]' : 'bg-gray-200'} flex items-center justify-center text-white shadow-xl shadow-[#7A8B5E]/20 relative z-10 transition-colors`}>
                {isWithinRange ? <MapPin size={32} /> : <AlertCircle size={32} />}
              </div>
            </div>
            
            <h4 className="text-sm font-black text-[#1A1F16] uppercase tracking-widest mb-2">Location Verified</h4>
            <p className="text-[11px] font-bold text-[#6B7280] mb-8 leading-relaxed">
              {isWithinRange 
                ? "You are within the hostel boundary. Please capture a selfie to record entry."
                : "Security terminal locked. Please be within 300m of the hostel gate."}
            </p>

            <button 
              onClick={() => { setIsCheckIn(checkStatus !== "Checked In"); setSelfieModalOpen(true); }}
              disabled={!isWithinRange || loading}
              className="w-full bg-[#1A1F16] text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-black/20 flex items-center justify-center gap-3 hover:bg-[#2A3324] transition-all disabled:opacity-20"
            >
              <Camera size={16} /> Open Terminal
            </button>
          </div>
        </div>

        {/* ── Attendance Summary ── */}
        <Link href="/attendance" className="lg:col-span-5 bg-white rounded-[40px] p-10 shadow-2xl shadow-[#7A8B5E]/5 border border-[#7A8B5E]/5 flex flex-col justify-between group hover:border-[#7A8B5E]/20 transition-all">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="text-[10px] font-black text-[#7A8B5E] uppercase tracking-[0.2em] mb-1">Performance</h3>
              <h2 className="text-2xl font-black text-[#1A1F16] tracking-tight uppercase italic">Monthly Stat</h2>
            </div>
            <div className="p-3 bg-[#F8FAF5] rounded-2xl text-[#7A8B5E] group-hover:bg-[#7A8B5E] group-hover:text-white transition-all">
              <ArrowUpRight size={20} />
            </div>
          </div>

          <div className="flex items-center gap-8">
            <div className="w-32 h-32 relative">
              <Pie data={chartData} options={{ cutout: "75%", plugins: { legend: { display: false } } }} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-black text-[#1A1F16] leading-none">{totalDays}</span>
                <span className="text-[8px] font-black text-[#6B7280] uppercase tracking-widest mt-1">Total</span>
              </div>
            </div>
            <div className="flex-1 space-y-4">
              <StatIndicator label="Present" val={attendanceData.present} color="bg-[#7A8B5E]" />
              <StatIndicator label="Absent" val={attendanceData.absent} color="bg-[#E30007]" />
              <div className="pt-2 flex items-center gap-2 text-[10px] font-black text-[#7A8B5E] uppercase tracking-widest opacity-60">
                <Clock size={12} /> View Details
              </div>
            </div>
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* ── Accomodation Detail ── */}
        <CardContainer title="Residence Info" icon={<Home />}>
          <div className="space-y-4 pt-4">
            <InfoRow label="Room Number" val={`Room ${roomNo}`} />
            <InfoRow label="Floor Level" val={`Floor ${floor}`} />
            <InfoRow label="Bed Position" val={bedAllotment} />
          </div>
        </CardContainer>

        {/* ── Fee Alerts ── */}
        <CardContainer title="Financials" icon={<Wallet />}>
          <div className="space-y-4 pt-4">
            {fees.slice(0, 3).map((fee, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-[#F8FAF5] rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className={`w-1.5 h-6 rounded-full ${fee.status === 'paid' ? 'bg-green-400' : 'bg-amber-400'}`}></div>
                  <span className="text-[10px] font-black text-[#1A1F16] uppercase tracking-tight">{fee.feeType}</span>
                </div>
                <span className="text-xs font-black text-[#1A1F16]">₹{fee.amount}</span>
              </div>
            ))}
            {fees.length === 0 && <p className="text-[10px] font-bold text-[#6B7280] italic">No active fee cycles.</p>}
          </div>
        </CardContainer>

        {/* ── Complaints & Notices ── */}
        <CardContainer title="Bulletin Board" icon={<Bell />}>
          <div className="space-y-3 pt-4">
            {recentNotices.map((n, i) => (
              <div key={i} className="border-l-2 border-[#7A8B5E]/20 pl-4 py-1">
                <h4 className="text-[10px] font-black text-[#1A1F16] uppercase tracking-tight truncate">{n.title}</h4>
                <p className="text-[9px] font-bold text-[#6B7280] truncate">{n.description}</p>
              </div>
            ))}
            <Link href="/notices" className="flex items-center gap-2 text-[10px] font-black text-[#7A8B5E] uppercase tracking-widest mt-4">
              Explore All <ArrowRight size={12} />
            </Link>
          </div>
        </CardContainer>
      </div>

      {/* Selfie Modal */}
      {selfieModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#1A1F16]/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[40px] p-8 max-w-md w-full shadow-2xl border border-[#7A8B5E]/10 animate-in zoom-in-95 duration-300">
            <h3 className="text-xl font-black text-[#1A1F16] mb-6 text-center uppercase italic">Identity Verification</h3>
            <div className="relative aspect-video bg-black rounded-3xl overflow-hidden mb-8 border-4 border-[#F8FAF5] shadow-inner">
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover scale-x-[-1]" />
              <div className="absolute inset-0 border-2 border-dashed border-white/30 rounded-[inherit] m-4 pointer-events-none"></div>
            </div>
            <div className="flex gap-4">
              <button onClick={() => { stopCamera(); setSelfieModalOpen(false); }} className="flex-1 py-4 rounded-2xl bg-[#F8FAF5] text-[#1A1F16] font-black text-[10px] uppercase tracking-widest transition-all">Cancel</button>
              <button onClick={handleCaptureSelfie} className="flex-1 py-4 rounded-2xl bg-[#7A8B5E] text-white font-black text-[10px] uppercase tracking-widest shadow-lg shadow-[#7A8B5E]/20 transition-all">Capture</button>
            </div>
          </div>
        </div>
      )}

      {showNoticePopup && <NoticePopup notice={latestNotice} onMarkAsRead={() => { localStorage.setItem(`lastReadNotice_${studentId}`, latestNotice._id); setShowNoticePopup(false); }} />}
    </div>
  );
}

function QuickAction({ href, label, sub, icon, color }) {
  return (
    <Link href={href} className="bg-white p-6 rounded-[32px] shadow-2xl shadow-[#7A8B5E]/5 border border-[#7A8B5E]/5 flex flex-col items-center gap-4 transition-all hover:scale-[1.03] active:scale-[0.97] group">
      <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center transition-transform group-hover:rotate-6`}>
        {React.cloneElement(icon, { size: 24 })}
      </div>
      <div className="text-center">
        <p className="text-[10px] font-black text-[#1A1F16] uppercase tracking-[0.1em]">{label}</p>
        <p className="text-[9px] font-bold text-[#6B7280] uppercase tracking-widest opacity-60 mt-1">{sub}</p>
      </div>
    </Link>
  );
}

function StatIndicator({ label, val, color }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={`w-2.5 h-2.5 rounded-full ${color}`}></div>
        <span className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest">{label}</span>
      </div>
      <span className="text-sm font-black text-[#1A1F16]">{val}</span>
    </div>
  );
}

function CardContainer({ title, icon, children }) {
  return (
    <div className="bg-white rounded-[40px] p-8 shadow-2xl shadow-[#7A8B5E]/5 border border-[#7A8B5E]/5 flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-[#F8FAF5] text-[#7A8B5E] flex items-center justify-center shadow-sm">
          {React.cloneElement(icon, { size: 18 })}
        </div>
        <h3 className="text-xs font-black text-[#1A1F16] uppercase tracking-[0.2em]">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function InfoRow({ label, val }) {
  return (
    <div className="flex items-center justify-between py-1 border-b border-[#7A8B5E]/5 last:border-0">
      <span className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest">{label}</span>
      <span className="text-[11px] font-black text-[#1A1F16] uppercase tracking-tight">{val}</span>
    </div>
  );
}
