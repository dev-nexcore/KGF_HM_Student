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
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [attendanceStats, setAttendanceStats] = useState({ present: 0, absent: 0 });
  
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

  const fetchStats = async () => {
    if (!studentId) return;
    try {
      const res = await api.get(`/attendanceSummary/${studentId}?range=month`);
      if (res.data) {
        setAttendanceStats({
          present: res.data.present ?? 0,
          absent: res.data.absent ?? 0,
        });
      }
    } catch (err) {
      console.error("Failed to fetch attendance stats", err);
    }
  };

  useEffect(() => {
    fetchLogs();
    fetchStats();
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
    <main className="bg-[#ffffff] px-6 sm:px-8 lg:px-2.5 py-2 min-h-screen font-sans pb-10">
      <div className="max-w-7xl mx-auto space-y-6 mt-4">
        <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-black border-l-4 border-[#4F8CCF] pl-2">
          Attendance
        </h2>
        
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-[0_4px_15px_rgba(0,0,0,0.2)] w-full">
          <div className="bg-[#AAB491] px-6 py-3 rounded-t-lg">
            <h2 className="text-lg font-semibold text-black">Attendance Center</h2>
          </div>
          <div className="p-7 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4">
              <div className={`p-4 rounded-lg ${currentStatus === 'IN' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                {currentStatus === 'IN' ? <FiLogIn size={32} /> : <FiLogOut size={32} />}
              </div>
              <div>
                <p className="text-base font-semibold text-black">
                  Status: <span className={currentStatus === 'IN' ? 'text-green-600' : 'text-orange-600'}>{currentStatus === 'IN' ? 'Checked IN' : 'Checked OUT'}</span>
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="bg-blue-50 px-6 py-2 rounded-lg border border-blue-200 text-center min-w-[100px]">
                <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Present</p>
                <p className="text-xl font-bold text-blue-700">{attendanceStats.present}</p>
              </div>
              <div className="bg-red-50 px-6 py-2 rounded-lg border border-red-200 text-center min-w-[100px]">
                <p className="text-xs font-semibold text-red-600 uppercase tracking-wider">Absent</p>
                <p className="text-xl font-bold text-red-700">{attendanceStats.absent}</p>
              </div>
              <div className="bg-gray-50 px-6 py-2 rounded-lg border border-gray-200 text-center min-w-[100px]">
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Total</p>
                <p className="text-xl font-bold text-gray-700">{attendanceStats.present + attendanceStats.absent}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Camera Modal */}
        {showScanner && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-md rounded-lg overflow-hidden shadow-2xl font-sans">
              <div className="bg-[#AAB491] px-6 py-3 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-black">Selfie Verification</h3>
                <button onClick={() => { setShowScanner(false); setMarkingAttendance(false); }} className="p-2 bg-white/50 hover:bg-white/80 rounded-full text-black"><FiXCircle /></button>
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
                <div className="flex items-center gap-3 mb-6 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <FiMapPin className="text-blue-500" />
                  <div className="text-sm font-semibold text-black">
                    <p>Verified Location:</p>
                    <p className="text-xs text-gray-500">{location?.lat.toFixed(6)}, {location?.lng.toFixed(6)}</p>
                  </div>
                </div>
                
                {selfie ? (
                  <div className="flex gap-4">
                    <button onClick={() => setSelfie(null)} className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-black rounded-lg font-semibold text-sm transition-colors">Retake</button>
                    <button onClick={submitAttendance} className="flex-1 py-3 bg-[#AAB491] hover:bg-[#97a081] text-black rounded-lg font-semibold text-sm transition-colors">Confirm & Submit</button>
                  </div>
                ) : (
                  <p className="text-center text-sm font-semibold text-gray-500 italic">Position your face in the circle and capture</p>
                )}
              </div>
            </div>
            <canvas ref={canvasRef} className="hidden" />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Calendar Section */}
          <div className="lg:col-span-1 bg-white rounded-lg shadow-[0_4px_15px_rgba(0,0,0,0.2)] w-full">
            <div className="bg-[#AAB491] px-6 py-3 rounded-t-lg flex justify-between items-center">
              <button onClick={prevMonth} className="text-black hover:bg-black/10 p-1 rounded transition-colors"><FiArrowLeft /></button>
              <h3 className="text-lg font-semibold text-black">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h3>
              <button onClick={nextMonth} className="text-black hover:bg-black/10 p-1 rounded transition-colors"><FiArrowRight /></button>
            </div>
            
            <div className="p-7">
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                  <div key={i} className="text-center text-sm font-semibold text-gray-600 p-2">{d}</div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-1">
                {[...Array(firstDay)].map((_, i) => <div key={`empty-${i}`} className="p-2"></div>)}
                {[...Array(daysInMonth)].map((_, i) => {
                  const day = i + 1;
                  const iterDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                  const marked = hasAttendance(day);
                  const isToday = iterDate.toDateString() === new Date().toDateString();
                  const isSelected = iterDate.toDateString() === selectedDate.toDateString();
                  
                  // Calculate if absent (past day, not Sunday, and not marked)
                  const now = new Date();
                  now.setHours(0, 0, 0, 0);
                  const isAbsent = !marked && iterDate < now && iterDate.getDay() !== 0;

                  return (
                    <div 
                      key={day} 
                      onClick={() => setSelectedDate(iterDate)}
                      className={`aspect-square flex items-center justify-center text-sm font-semibold rounded-lg transition-all relative cursor-pointer ${
                        isSelected ? 'ring-2 ring-offset-2 ring-blue-500 ' : ''
                      }${
                        marked ? 'bg-blue-50 text-blue-600 border border-blue-500' : 
                        isAbsent ? 'bg-red-500 text-white' :
                        isToday ? 'bg-gray-100 text-black border border-[#4F8CCF]' : 'text-black hover:bg-gray-100'
                      }`}
                    >
                      {day}
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200 flex flex-wrap items-center gap-4 text-sm font-semibold text-gray-600">
                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-50 border border-blue-500 rounded-full"></div> Present</div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-500 rounded-full"></div> Absent</div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-gray-100 border border-[#4F8CCF] rounded-full"></div> Today</div>
              </div>
            </div>
          </div>

          {/* History Section */}
          {(() => {
            const filteredLogs = logs.filter(log => new Date(log.checkInDate).toDateString() === selectedDate.toDateString());
            return (
              <div className="lg:col-span-2 bg-white rounded-lg shadow-[0_4px_15px_rgba(0,0,0,0.2)] w-full flex flex-col">
                <div className="bg-[#AAB491] px-6 py-3 rounded-t-lg flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-black">Attendance History</h3>
                  <div className="px-3 py-1 bg-white text-black rounded-lg text-sm font-semibold">{filteredLogs.length} Records</div>
                </div>
                
                <div className="flex-1 overflow-y-auto max-h-[500px] p-7">
                  {loading ? (
                    <div className="p-10 flex flex-col items-center justify-center gap-4">
                      <div className="w-8 h-8 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                      <p className="text-sm font-semibold text-gray-600">Syncing Logs...</p>
                    </div>
                  ) : filteredLogs.length === 0 ? (
                    <div className="p-10 text-center">
                      <FiCalendar className="mx-auto text-4xl text-gray-300 mb-4" />
                      <p className="text-base font-semibold text-gray-500">No records found for {selectedDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-200">
                      {filteredLogs.map((log, idx) => (
                        <div key={idx} className="py-4 hover:bg-gray-50 transition-colors flex justify-between items-center group px-4 rounded-lg">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-lg bg-gray-100 flex flex-col items-center justify-center border border-gray-200 group-hover:bg-white transition-colors">
                              <span className="text-xs font-semibold text-gray-500">{new Date(log.checkInDate).toLocaleDateString('en-US', { month: 'short' })}</span>
                              <span className="text-lg font-semibold text-black leading-none">{new Date(log.checkInDate).getDate()}</span>
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-black flex items-center gap-2">
                                <FiLogIn className="text-green-500" size={14} />
                                {new Date(log.checkInDate).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
                                {log.checkOutDate && (
                                  <>
                                    <span className="text-gray-300 mx-1">|</span>
                                    <FiLogOut className="text-orange-500" size={14} />
                                    {new Date(log.checkOutDate).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
                                  </>
                                )}
                              </p>

                            </div>
                          </div>
                          
                          <div className={`px-4 py-1.5 rounded-lg text-xs font-semibold ${
                            log.checkOutDate ? 'bg-gray-200 text-gray-700' : 'bg-green-100 text-green-700'
                          }`}>
                            {log.checkOutDate ? 'Completed' : 'Active'}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })()}

        </div>
      </div>
    </main>
  );
}
