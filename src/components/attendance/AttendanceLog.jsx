'use client';
import React, { useState, useEffect, useRef } from 'react';
import api from '@/lib/api';
import { FiClock, FiCalendar, FiMapPin, FiCamera, FiCheckCircle, FiXCircle, FiArrowRight, FiArrowLeft, FiLogOut, FiLogIn } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

export default function AttendanceLog() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [markingAttendance, setMarkingAttendance] = useState(false);
  const [studentId, setStudentId] = useState(null);
  const [currentStatus, setCurrentStatus] = useState('OUT'); // 'IN' or 'OUT'
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Camera & Location states
  const [showScanner, setShowScanner] = useState(false);
  const [selfie, setSelfie] = useState(null);
  const [location, setLocation] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const id = localStorage.getItem('studentId');
    if (id) setStudentId(id);
  }, []);

  const fetchLogs = async () => {
    if (!studentId) return;
    try {
      setLoading(true);
      const res = await api.get(`/attendance-log/${studentId}`);
      if (res.data && res.data.attendanceLog) {
        const sortedLogs = [...res.data.attendanceLog].sort((a, b) => 
          new Date(b.checkInDate) - new Date(a.checkInDate)
        );
        setLogs(sortedLogs);
        
        // Check current status
        const latest = sortedLogs[0];
        if (latest && !latest.checkOutDate) {
          setCurrentStatus('IN');
        } else {
          setCurrentStatus('OUT');
        }
      }
    } catch (err) {
      console.error("Error fetching attendance logs:", err);
      toast.error("Failed to load attendance logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [studentId]);

  // --- Attendance Logic ---
  
  const startAttendance = async (type) => {
    setMarkingAttendance(true);
    
    // Get Location
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setShowScanner(true);
          startCamera();
        },
        (error) => {
          toast.error("Location permission denied. Please enable GPS.");
          setMarkingAttendance(false);
        }
      );
    } else {
      toast.error("Geolocation is not supported by your browser.");
      setMarkingAttendance(false);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera error:", err);
      toast.error("Could not access camera");
      setShowScanner(false);
      setMarkingAttendance(false);
    }
  };

  const captureSelfie = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d').drawImage(video, 0, 0);
      const dataUrl = canvas.toDataURL('image/jpeg');
      setSelfie(dataUrl);
      
      // Stop camera
      const stream = video.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
    }
  };

  const submitAttendance = async () => {
    if (!selfie || !location) return;
    
    try {
      const endpoint = currentStatus === 'OUT' ? '/check-in' : '/check-out';
      const res = await api.post(endpoint, {
        selfie,
        location
      });
      
      toast.success(res.data.message || "Success!");
      setShowScanner(false);
      setSelfie(null);
      setMarkingAttendance(false);
      fetchLogs();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to record attendance");
      setMarkingAttendance(false);
    }
  };

  // --- Calendar Logic ---
  
  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
  const firstDay = getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());
  
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const hasAttendance = (day) => {
    const d = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dateStr = d.toDateString();
    return logs.some(log => new Date(log.checkInDate).toDateString() === dateStr);
  };

  return (
    <div className="w-full min-h-screen bg-[#F8FAF5] pb-10">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <div className={`p-4 rounded-2xl ${currentStatus === 'IN' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
              {currentStatus === 'IN' ? <FiLogIn size={32} /> : <FiLogOut size={32} />}
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-800">Attendance Center</h2>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                Status: <span className={currentStatus === 'IN' ? 'text-green-600' : 'text-orange-600'}>{currentStatus === 'IN' ? 'Checked IN' : 'Checked OUT'}</span>
              </p>
            </div>
          </div>
          
          {/* Mark Check-in button removed as requested */}
        </div>

        {/* Camera Modal */}
        {showScanner && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-black text-gray-800 uppercase tracking-widest">Selfie Verification</h3>
                <button onClick={() => { setShowScanner(false); setMarkingAttendance(false); }} className="p-2 bg-gray-100 rounded-full"><FiXCircle /></button>
              </div>
              
              <div className="relative aspect-square bg-black">
                {!selfie ? (
                  <>
                    <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                    <div className="absolute inset-0 border-[40px] border-black/40 rounded-full pointer-events-none"></div>
                    <button 
                      onClick={captureSelfie}
                      className="absolute bottom-8 left-1/2 -translate-x-1/2 w-16 h-16 bg-white rounded-full border-4 border-gray-300 active:scale-90 transition-transform flex items-center justify-center"
                    >
                      <div className="w-12 h-12 bg-red-500 rounded-full shadow-inner"></div>
                    </button>
                  </>
                ) : (
                  <img src={selfie} className="w-full h-full object-cover" />
                )}
              </div>
              
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6 p-3 bg-gray-50 rounded-xl">
                  <FiMapPin className="text-blue-500" />
                  <div className="text-xs font-bold text-gray-600">
                    <p>Verified Location:</p>
                    <p>{location?.lat.toFixed(6)}, {location?.lng.toFixed(6)}</p>
                  </div>
                </div>
                
                {selfie ? (
                  <div className="flex gap-4">
                    <button onClick={() => setSelfie(null)} className="flex-1 py-4 bg-gray-100 text-gray-600 rounded-2xl font-black uppercase tracking-widest text-xs">Retake</button>
                    <button onClick={submitAttendance} className="flex-1 py-4 bg-green-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-green-200">Confirm & Submit</button>
                  </div>
                ) : (
                  <p className="text-center text-xs font-bold text-gray-400 italic">Position your face in the circle and capture</p>
                )}
              </div>
            </div>
            <canvas ref={canvasRef} className="hidden" />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Calendar Section */}
          <div className="lg:col-span-1 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <button onClick={prevMonth} className="p-2 hover:bg-gray-50 rounded-lg transition-colors"><FiArrowLeft /></button>
              <h3 className="font-black text-gray-800 uppercase tracking-widest text-sm">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h3>
              <button onClick={nextMonth} className="p-2 hover:bg-gray-50 rounded-lg transition-colors"><FiArrowRight /></button>
            </div>
            
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                <div key={i} className="text-center text-[10px] font-black text-gray-400 p-2">{d}</div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-1">
              {[...Array(firstDay)].map((_, i) => <div key={`empty-${i}`} className="p-2"></div>)}
              {[...Array(daysInMonth)].map((_, i) => {
                const day = i + 1;
                const marked = hasAttendance(day);
                const isToday = day === new Date().getDate() && currentDate.getMonth() === new Date().getMonth() && currentDate.getFullYear() === new Date().getFullYear();
                
                return (
                  <div 
                    key={day} 
                    className={`aspect-square flex items-center justify-center text-xs font-bold rounded-xl transition-all relative ${
                      marked ? 'bg-blue-500 text-white shadow-md shadow-blue-100' : 
                      isToday ? 'bg-gray-100 text-gray-800 border-2 border-[#4F8CCF]' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {day}
                    {marked && <div className="absolute bottom-1 w-1 h-1 bg-white rounded-full"></div>}
                  </div>
                );
              })}
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-50 flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">
              <div className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-500 rounded-full"></div> Present</div>
              <div className="flex items-center gap-1"><div className="w-3 h-3 bg-gray-100 border border-[#4F8CCF] rounded-full"></div> Today</div>
            </div>
          </div>

          {/* History Section */}
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center">
              <h3 className="font-black text-gray-800 uppercase tracking-widest text-sm">Attendance History</h3>
              <div className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black">{logs.length} Records</div>
            </div>
            
            <div className="flex-1 overflow-y-auto max-h-[500px]">
              {loading ? (
                <div className="p-20 flex flex-col items-center justify-center gap-4">
                  <div className="w-8 h-8 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest animate-pulse">Syncing Logs...</p>
                </div>
              ) : logs.length === 0 ? (
                <div className="p-20 text-center">
                  <FiCalendar className="mx-auto text-4xl text-gray-200 mb-4" />
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">No records found</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {logs.map((log, idx) => (
                    <div key={idx} className="p-5 hover:bg-gray-50/50 transition-colors flex justify-between items-center group">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gray-50 flex flex-col items-center justify-center border border-gray-100 group-hover:bg-white transition-colors">
                          <span className="text-[8px] font-black text-gray-400 uppercase">{new Date(log.checkInDate).toLocaleDateString('en-US', { month: 'short' })}</span>
                          <span className="text-sm font-black text-gray-800 leading-none">{new Date(log.checkInDate).getDate()}</span>
                        </div>
                        <div>
                          <p className="text-xs font-black text-gray-800 flex items-center gap-2">
                            <FiClock className="text-blue-500" size={12} />
                            {new Date(log.checkInDate).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
                            {log.checkOutDate && (
                              <>
                                <FiArrowRight className="text-gray-300" />
                                {new Date(log.checkOutDate).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
                              </>
                            )}
                          </p>
                          <p className="text-[10px] font-bold text-gray-400 mt-0.5 flex items-center gap-1">
                            <FiMapPin size={10} /> 
                            {log.checkInLocation?.lat.toFixed(4)}, {log.checkInLocation?.lng.toFixed(4)}
                          </p>
                        </div>
                      </div>
                      
                      <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        log.checkOutDate ? 'bg-gray-100 text-gray-500' : 'bg-green-100 text-green-600'
                      }`}>
                        {log.checkOutDate ? 'Completed' : 'Active'}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
