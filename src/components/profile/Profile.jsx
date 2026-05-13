'use client';
import api from '@/lib/api';
import React, { useEffect, useState, useRef } from 'react';
import { FiEdit, FiUpload, FiTrash2, FiUser, FiMail, FiPhone, FiHome, FiHash, FiMapPin, FiCalendar, FiAlertCircle, FiFileText, FiExternalLink } from 'react-icons/fi';
import { toast, Toaster } from "react-hot-toast";
import Image from 'next/image';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    attendance: '--',
    dues: '--',
    complaints: '--'
  });

  const [formData, setFormData] = useState({
    studentName: '',
    email: '',
    contactNumber: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // 1. Fetch Profile
        const res = await api.get(`/profile`);
        const data = res.data;
        setProfile(data);
        console.log(data)
        setFormData({
          studentName: `${data.firstName} ${data.lastName}`.trim(),
          email: data.email || '',
          contactNumber: data.contactNumber || '',
        });

        // 2. Fetch Stats in parallel
        const [feesRes, complaintsRes] = await Promise.all([
          api.get('/feeStatus'),
          api.get('/complaints')
        ]);

        const pendingFees = feesRes.data.fees?.filter(f => f.status !== 'paid') || [];
        const totalDues = pendingFees.reduce((sum, f) => sum + (f.amount || 0), 0);
        const activeComplaints = complaintsRes.data.complaints?.filter(c => c.status !== 'resolved') || [];

        setStats({
          attendance: '94%', // Fallback or fetched
          dues: `₹${totalDues.toLocaleString('en-IN')}`,
          complaints: activeComplaints.length
        });

      } catch (err) {
        console.error('Failed to fetch profile data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdate = async () => {
    try {
      const [firstName, ...rest] = formData.studentName.split(" ");
      const lastName = rest.join(" ") || "";

      await api.put(`/profile`, {
        firstName,
        lastName,
        email: formData.email,
        contactNumber: formData.contactNumber,
      });

      setProfile(prev => ({
        ...prev,
        firstName,
        lastName,
        email: formData.email,
        contactNumber: formData.contactNumber,
      }));

      setShowModal(false);
      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error('Failed to update profile:', err);
      toast.error("Failed to update profile");
    }
  };

  const handleImageUpload = async (e) => {
    const studentId = localStorage.getItem("studentId");
    const file = e.target.files[0];
    if (!file || !studentId) return;

    const uploadData = new FormData();
    uploadData.append("profileImage", file);

    try {
      toast.loading("Uploading image...", { id: 'upload' });
      const res = await api.post(`/upload-profile-image/${studentId}`, uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setProfile(prev => ({ ...prev, profileImage: res.data.imageUrl }));
      toast.success("Image updated", { id: 'upload' });
    } catch (err) {
      console.error('Image upload failed:', err);
      toast.error("Upload failed", { id: 'upload' });
    }
  };

  const handleImageDelete = async () => {
    const studentId = localStorage.getItem("studentId");
    if (!studentId) return;

    try {
      await api.delete(`/delete-profile-image/${studentId}`);
      setProfile(prev => ({ ...prev, profileImage: null }));
      toast.success("Image removed");
    } catch (err) {
      console.error('Image delete failed:', err);
      toast.error("Failed to remove image");
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="w-12 h-12 border-4 border-[#BEC5AD] border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-gray-500 font-medium">Loading your profile...</p>
    </div>
  );

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-[#FDFDFD] pb-12">
      <Toaster position="top-right" />
      
      {/* Header Spacer */}
      <div className="h-10"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Page Title */}
        <div className="flex items-center gap-3 mb-10">
          <div className="w-1.5 h-8 bg-[#4F8CCF] rounded-full"></div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Student Profile</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Profile Card */}
          <div className="lg:col-span-4">
            <div className="bg-[#BEC5AD] rounded-[2.5rem] p-8 sm:p-10 flex flex-col items-center text-center shadow-xl shadow-[#BEC5AD]/20 sticky top-6">
              <div className="relative group">
                <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-[3rem] overflow-hidden border-4 border-white shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]">
                  {profile.profileImage ? (
                    <Image
                      src={profile.profileImage}
                      alt="Profile"
                      width={200}
                      height={200}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-white/50 flex items-center justify-center text-white text-5xl">
                      <FiUser />
                    </div>
                  )}
                </div>

                {/* Photo Actions Overlay */}
                <div className="absolute -bottom-2 -right-2 flex gap-2">
                  <label className="w-10 h-10 bg-white text-[#4F8CCF] rounded-2xl flex items-center justify-center shadow-lg cursor-pointer hover:bg-gray-50 transition-all hover:scale-110 active:scale-95">
                    <FiUpload />
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                  {profile.profileImage && (
                    <button 
                      onClick={handleImageDelete}
                      className="w-10 h-10 bg-red-500 text-white rounded-2xl flex items-center justify-center shadow-lg hover:bg-red-600 transition-all hover:scale-110 active:scale-95"
                    >
                      <FiTrash2 />
                    </button>
                  )}
                </div>
              </div>

              <div className="mt-8">
                <h2 className="text-2xl font-black text-black leading-tight">
                  {profile.firstName} {profile.lastName}
                </h2>
                <div className="mt-3 inline-block px-4 py-1.5 bg-white/30 backdrop-blur-md rounded-full text-xs font-black text-black uppercase tracking-widest">
                  ID: {profile.studentId}
                </div>
              </div>

              <div className="mt-10 w-full grid grid-cols-2 gap-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                  <p className="text-[10px] font-black uppercase text-black/60 mb-1">Room</p>
                  <p className="text-lg font-bold text-black">{profile.roomNo || 'N/A'}</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                  <p className="text-[10px] font-black uppercase text-black/60 mb-1">Bed</p>
                  <p className="text-lg font-bold text-black">{profile.bedAllotment || 'N/A'}</p>
                </div>
              </div>

              <button
                onClick={() => setShowModal(true)}
                className="mt-8 w-full bg-black text-white px-6 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-900 transition-all active:scale-95 shadow-lg"
              >
                <FiEdit /> Edit Details
              </button>
            </div>
          </div>

          {/* Right Column: Details & Stats */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Stats Overview */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <StatCard label="Attendance" value={stats.attendance} color="text-blue-600" bg="bg-blue-50/50" />
              <StatCard label="Total Dues" value={stats.dues} color="text-red-600" bg="bg-red-50/50" />
              <StatCard label="Complaints" value={stats.complaints} color="text-orange-600" bg="bg-orange-50/50" />
            </div>

            {/* Information Grid */}
            <div className="bg-white rounded-[2.5rem] p-8 sm:p-10 border border-gray-100 shadow-sm">
              <h3 className="text-lg font-black text-gray-900 mb-8 flex items-center gap-3 uppercase tracking-wider">
                <FiUser className="text-[#4F8CCF]" />
                Personal Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                <InfoItem icon={<FiMail />} label="Email Address" value={profile.email} />
                <InfoItem icon={<FiPhone />} label="Phone Number" value={profile.contactNumber} />
                <InfoItem icon={<FiCalendar />} label="Admission Date" value={new Date(profile.admissionDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })} />
                <InfoItem icon={<FiMapPin />} label="Floor Level" value={profile.floor || 'N/A'} />
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="bg-red-50/50 border border-red-100 rounded-[2rem] p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-red-500 shadow-sm">
                  <FiAlertCircle className="text-2xl" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-red-900 leading-none">Emergency Contact</h3>
                  <p className="text-xs text-red-600 mt-1">Hostel security fallback info</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="text-[10px] font-black uppercase text-red-400 mb-1 tracking-widest">Name</p>
                  <p className="text-lg font-bold text-red-900">{profile.emergencyContactName || 'Not Set'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-red-400 mb-1 tracking-widest">Mobile Number</p>
                  <p className="text-lg font-bold text-red-900">{profile.emergencyContactNumber || 'Not Set'}</p>
                </div>
              </div>
            </div>

            {/* Academic Documents */}
            <div className="bg-white rounded-[2.5rem] p-8 sm:p-10 border border-gray-100 shadow-sm">
              <h3 className="text-lg font-black text-gray-900 mb-8 flex items-center gap-3 uppercase tracking-wider">
                <FiFileText className="text-[#4F8CCF]" />
                Verification Documents
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <DocumentItem 
                  label="Aadhar Card" 
                  url={profile.documents?.aadharCard} 
                />
                <DocumentItem 
                  label="PAN Card" 
                  url={profile.documents?.panCard} 
                />
                <DocumentItem 
                  label="College ID Card" 
                  url={profile.documents?.studentIdCard} 
                />
                <DocumentItem 
                  label="Admission Fees Receipt" 
                  url={profile.documents?.feesReceipt} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg p-8 sm:p-10 relative animate-in fade-in zoom-in duration-300">
            <h2 className="text-2xl font-black text-gray-900 mb-2">Edit Profile</h2>
            <p className="text-gray-500 mb-8">Update your contact details below.</p>

            <div className="space-y-6">
              <InputGroup label="Full Name" name="studentName" value={formData.studentName} onChange={handleInputChange} icon={<FiUser />} />
              <InputGroup label="Email" name="email" value={formData.email} onChange={handleInputChange} type="email" icon={<FiMail />} />
              <InputGroup label="Phone" name="contactNumber" value={formData.contactNumber} onChange={handleInputChange} icon={<FiPhone />} />
            </div>

            <div className="flex gap-4 mt-10">
              <button onClick={() => setShowModal(false)} className="flex-1 px-6 py-4 rounded-2xl bg-gray-100 text-gray-600 font-bold hover:bg-gray-200 transition-colors">Cancel</button>
              <button onClick={handleUpdate} className="flex-1 px-6 py-4 rounded-2xl bg-[#BEC5AD] text-black font-bold hover:bg-[#aeb898] transition-all shadow-lg">Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DocumentItem({ label, url }) {
  return (
    <div className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl border border-gray-100 hover:border-[#BEC5AD]/50 transition-all group">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#4F8CCF] shadow-sm">
          <FiFileText />
        </div>
        <div>
          <p className="text-[10px] font-black uppercase text-gray-400 mb-0.5 tracking-wider">{label}</p>
          <p className="text-xs font-bold text-gray-700">{url ? 'Document Uploaded' : 'Not Uploaded'}</p>
        </div>
      </div>
      
      {url && (
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-8 h-8 bg-white text-gray-400 rounded-lg flex items-center justify-center hover:text-[#4F8CCF] hover:shadow-md transition-all active:scale-90"
        >
          <FiExternalLink />
        </a>
      )}
    </div>
  );
}

function StatCard({ label, value, color, bg }) {
  return (
    <div className={`${bg} rounded-[2rem] p-6 border border-white flex flex-col items-center justify-center text-center shadow-sm`}>
      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{label}</p>
      <p className={`text-2xl font-black ${color}`}>{value}</p>
    </div>
  );
}

function InfoItem({ icon, label, value }) {
  return (
    <div className="flex items-start gap-4">
      <div className="mt-1 flex items-center justify-center w-10 h-10 rounded-xl bg-gray-50 text-[#4F8CCF]">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{label}</p>
        <p className="text-sm font-bold text-gray-800 break-all">{value || 'N/A'}</p>
      </div>
    </div>
  );
}

function InputGroup({ label, name, value, onChange, icon, type = "text" }) {
  return (
    <div>
      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">{label}</label>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          {icon}
        </div>
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className="w-full bg-gray-50 border-2 border-transparent rounded-2xl pl-12 pr-4 py-4 text-sm font-bold text-gray-800 focus:border-[#BEC5AD] transition-all outline-none"
        />
      </div>
    </div>
  );
}
