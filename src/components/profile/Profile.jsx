'use client';

import api, { API_URL } from '@/lib/api';
import React, { useEffect, useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  ShieldAlert, 
  FileText, 
  ExternalLink, 
  Edit3, 
  Camera, 
  Trash2, 
  Layout,
  Clock,
  CheckCircle,
  AlertCircle,
  Hash,
  Home,
  Upload
} from 'lucide-react';
import { toast, Toaster } from "react-hot-toast";
import Image from 'next/image';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ attendance: '--', dues: '--', complaints: '--' });

  const [formData, setFormData] = useState({
    studentName: '',
    email: '',
    contactNumber: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/profile`);
        const data = res.data;
        setProfile(data);
        setFormData({
          studentName: `${data.firstName} ${data.lastName}`.trim(),
          email: data.email || '',
          contactNumber: data.contactNumber || '',
        });

        const [feesRes, complaintsRes] = await Promise.all([
          api.get('/feeStatus'),
          api.get('/complaints')
        ]);

        const pendingFees = feesRes.data.fees?.filter(f => f.status !== 'paid') || [];
        const totalDues = pendingFees.reduce((sum, f) => sum + (f.amount || 0), 0);
        const activeComplaints = complaintsRes.data.complaints?.filter(c => c.status !== 'resolved') || [];

        setStats({
          attendance: '94%',
          dues: `₹${totalDues.toLocaleString()}`,
          complaints: activeComplaints.length
        });

      } catch (err) {
        console.error('Data fetch failed');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleUpdate = async () => {
    try {
      const [firstName, ...rest] = formData.studentName.split(" ");
      const lastName = rest.join(" ") || "";
      await api.put(`/profile`, { firstName, lastName, email: formData.email, contactNumber: formData.contactNumber });
      setProfile(prev => ({ ...prev, firstName, lastName, email: formData.email, contactNumber: formData.contactNumber }));
      setShowModal(false);
      toast.success("Identity updated");
    } catch (err) {
      toast.error("Update failed");
    }
  };

  const handleImageUpload = async (e) => {
    const studentId = localStorage.getItem("studentId");
    const file = e.target.files[0];
    if (!file || !studentId) return;
    const uploadData = new FormData();
    uploadData.append("profileImage", file);
    try {
      toast.loading("Syncing photo...", { id: 'upload' });
      const res = await api.post(`/upload-profile-image/${studentId}`, uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setProfile(prev => ({ ...prev, profileImage: res.data.imageUrl }));
      toast.success("Photo updated", { id: 'upload' });
    } catch (err) {
      toast.error("Upload failed", { id: 'upload' });
    }
  };

  const handleDocumentUpload = async (e, docType) => {
    const studentId = localStorage.getItem("studentId");
    const file = e.target.files[0];
    if (!file || !studentId) return;

    const uploadData = new FormData();
    uploadData.append("document", file);
    uploadData.append("documentType", docType);

    try {
      toast.loading(`Uploading ${docType}...`, { id: 'doc-upload' });
      const res = await api.post(`/upload-document/${studentId}`, uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      // Update local profile state
      setProfile(prev => ({
        ...prev,
        documents: {
          ...prev.documents,
          [docType]: res.data.url
        }
      }));
      
      toast.success("Document uploaded successfully", { id: 'doc-upload' });
    } catch (err) {
      console.error(err);
      toast.error("Upload failed. Please try again.", { id: 'doc-upload' });
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] animate-pulse">
      <div className="w-12 h-12 border-4 border-[#7A8B5E] border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-[10px] font-black text-[#7A8B5E] uppercase tracking-widest">Compiling Profile...</p>
    </div>
  );

  return (
    <div className="space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Toaster position="top-right" />
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* ── Left Sidebar: Identity Card ── */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#7A8B5E] rounded-[48px] p-10 flex flex-col items-center text-center shadow-2xl shadow-[#7A8B5E]/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
            
            <div className="relative group">
              <div className="w-44 h-44 rounded-[40px] overflow-hidden border-4 border-white/30 shadow-2xl transition-all duration-500 group-hover:scale-[1.02] bg-white/20 backdrop-blur-sm">
                {profile.profileImage ? (
                  <Image 
                    src={profile.profileImage.startsWith('http') ? profile.profileImage : `${API_URL}${profile.profileImage}`} 
                    alt="Profile" width={200} height={200} className="w-full h-full object-cover" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white text-5xl opacity-40"><User /></div>
                )}
              </div>
              <label className="absolute -bottom-2 -right-2 w-12 h-12 bg-white text-[#7A8B5E] rounded-2xl flex items-center justify-center shadow-xl cursor-pointer hover:scale-110 active:scale-95 transition-all">
                <Camera size={20} />
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>

            <div className="mt-8 relative z-10">
              <h2 className="text-3xl font-black text-white leading-none uppercase italic tracking-tight">
                {profile.firstName} <br /> <span className="opacity-80 font-serif lowercase italic normal-case">{profile.lastName}</span>
              </h2>
              <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 bg-black/20 backdrop-blur-md rounded-full text-[10px] font-black text-white uppercase tracking-widest border border-white/10">
                <Hash size={10} /> {profile.studentId}
              </div>
            </div>

            <div className="mt-10 w-full grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-5 border border-white/10">
                <p className="text-[8px] font-black uppercase text-white/60 mb-1 tracking-widest">Wing/Room</p>
                <p className="text-lg font-black text-white uppercase">{profile.roomNo || 'N/A'}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-5 border border-white/10">
                <p className="text-[8px] font-black uppercase text-white/60 mb-1 tracking-widest">Bed Allot</p>
                <p className="text-lg font-black text-white uppercase">{profile.bedAllotment || 'N/A'}</p>
              </div>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="mt-8 w-full bg-[#1A1F16] text-white px-6 py-5 rounded-[24px] font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-black transition-all flex items-center justify-center gap-3"
            >
              <Edit3 size={16} /> Modify Profile
            </button>
          </div>
          
          <div className="bg-white rounded-[40px] p-8 border border-[#7A8B5E]/5 shadow-2xl shadow-[#7A8B5E]/5">
            <h4 className="text-[10px] font-black text-[#7A8B5E] uppercase tracking-[0.2em] mb-6 flex items-center gap-2 italic">
              <ShieldAlert size={14} /> Emergency SOS
            </h4>
            <div className="space-y-6">
              <InfoRow label="Guardian" val={profile.emergencyContactName} icon={<User size={14} />} />
              <InfoRow label="Secure Line" val={profile.emergencyContactNumber} icon={<Phone size={14} />} />
            </div>
          </div>
        </div>

        {/* ── Right Content: Personal Archive ── */}
        <div className="lg:col-span-8 space-y-10">
          
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
            <StatCard label="Attendance" value={stats.attendance} icon={<CheckCircle />} color="text-emerald-600" bg="bg-emerald-50" />
            <StatCard label="Outstanding" value={stats.dues} icon={<AlertCircle />} color="text-amber-600" bg="bg-amber-50" />
            <StatCard label="Active Cases" value={stats.complaints} icon={<Clock />} color="text-blue-600" bg="bg-blue-50" />
          </div>

          {/* Detailed Info */}
          <div className="bg-white rounded-[48px] p-10 border border-[#7A8B5E]/5 shadow-2xl shadow-[#7A8B5E]/5">
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-sm font-black text-[#1A1F16] uppercase tracking-[0.2em] flex items-center gap-3 italic">
                <Layout size={18} className="text-[#7A8B5E]" /> Personal Dossier
              </h3>
              <div className="flex gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#7A8B5E]"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-[#7A8B5E]/30"></div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
              <InfoItem icon={<Mail />} label="Primary Email" value={profile.email} />
              <InfoItem icon={<Phone />} label="Mobile Contact" value={profile.contactNumber} />
              <InfoItem icon={<Calendar />} label="Enrolment Date" value={new Date(profile.admissionDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })} />
              <InfoItem icon={<MapPin />} label="Residential Floor" value={profile.floor || 'N/A'} />
              <InfoItem icon={<Home />} label="Hostel Block" value="KGF Premium Wings" />
              <InfoItem icon={<User />} label="Category" value={profile.category || 'Standard'} />
            </div>
          </div>

          {/* Verification Docs */}
          <div className="space-y-6">
            <h3 className="text-sm font-black text-[#6B7280] uppercase tracking-[0.2em] px-4 italic flex items-center gap-2">
              <FileText size={16} className="text-[#7A8B5E]" /> Compliance Documents
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <DocumentLink 
                label="Identity Proof (Aadhar)" 
                exists={!!profile.documents?.aadharCard} 
                docType="aadharCard"
                onUpload={(e) => handleDocumentUpload(e, 'aadharCard')}
                onOpen={() => handleOpen('aadharCard')}
              />
              <DocumentLink 
                label="Tax Identification (PAN)" 
                exists={!!profile.documents?.panCard} 
                docType="panCard"
                onUpload={(e) => handleDocumentUpload(e, 'panCard')}
                onOpen={() => handleOpen('panCard')}
              />
              <DocumentLink 
                label="University ID Card" 
                exists={!!profile.documents?.studentIdCard} 
                docType="studentIdCard"
                onUpload={(e) => handleDocumentUpload(e, 'studentIdCard')}
                onOpen={() => handleOpen('studentIdCard')}
              />
              <DocumentLink 
                label="Billing Receipt" 
                exists={!!profile.documents?.feesReceipt} 
                docType="feesReceipt"
                onUpload={(e) => handleDocumentUpload(e, 'feesReceipt')}
                onOpen={() => handleOpen('feesReceipt')}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Edit Identity Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#1A1F16]/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[48px] w-full max-w-lg p-10 shadow-2xl border border-[#7A8B5E]/10 animate-in zoom-in-95 duration-300">
            <h2 className="text-2xl font-black text-[#1A1F16] mb-2 uppercase italic tracking-tight">Modify Identity</h2>
            <p className="text-[11px] font-bold text-[#6B7280] uppercase tracking-widest mb-10">Update your verified contact profile</p>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[9px] font-black text-[#6B7280] uppercase tracking-widest ml-1">Full Legal Name</label>
                <input value={formData.studentName} onChange={(e) => setFormData(prev => ({ ...prev, studentName: e.target.value }))} className="w-full px-6 py-4 rounded-2xl bg-[#F8FAF5] border-2 border-transparent focus:border-[#7A8B5E]/20 outline-none font-bold text-sm text-[#1A1F16] transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-[#6B7280] uppercase tracking-widest ml-1">Secure Email</label>
                <input value={formData.email} onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))} className="w-full px-6 py-4 rounded-2xl bg-[#F8FAF5] border-2 border-transparent focus:border-[#7A8B5E]/20 outline-none font-bold text-sm text-[#1A1F16] transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-[#6B7280] uppercase tracking-widest ml-1">Contact Line</label>
                <input value={formData.contactNumber} onChange={(e) => setFormData(prev => ({ ...prev, contactNumber: e.target.value }))} className="w-full px-6 py-4 rounded-2xl bg-[#F8FAF5] border-2 border-transparent focus:border-[#7A8B5E]/20 outline-none font-bold text-sm text-[#1A1F16] transition-all" />
              </div>
            </div>

            <div className="flex gap-4 mt-12">
              <button onClick={() => setShowModal(false)} className="flex-1 py-5 rounded-2xl bg-[#F8FAF5] text-[#1A1F16] font-black text-[10px] uppercase tracking-widest transition-all">Cancel</button>
              <button onClick={handleUpdate} className="flex-1 py-5 rounded-2xl bg-[#7A8B5E] text-white font-black text-[10px] uppercase tracking-widest shadow-xl shadow-[#7A8B5E]/20 transition-all">Synchronize</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, icon, color, bg }) {
  return (
    <div className={`${bg} rounded-[32px] p-8 flex flex-col items-center justify-center text-center shadow-sm border border-white/40 group hover:scale-105 transition-all`}>
      <div className={`w-12 h-12 rounded-xl bg-white flex items-center justify-center ${color} mb-4 shadow-sm group-hover:rotate-6 transition-transform`}>
        {React.cloneElement(icon, { size: 20 })}
      </div>
      <p className="text-[8px] font-black uppercase tracking-[0.2em] text-[#6B7280] mb-1">{label}</p>
      <p className={`text-xl font-black ${color} tracking-tight`}>{value}</p>
    </div>
  );
}

function InfoItem({ icon, label, value }) {
  return (
    <div className="flex items-start gap-5">
      <div className="mt-1 flex items-center justify-center w-12 h-12 rounded-2xl bg-[#F8FAF5] text-[#7A8B5E] border border-[#7A8B5E]/5">
        {React.cloneElement(icon, { size: 20 })}
      </div>
      <div>
        <p className="text-[9px] font-black uppercase tracking-widest text-[#6B7280] mb-1">{label}</p>
        <p className="text-sm font-black text-[#1A1F16] tracking-tight">{value || 'N/A'}</p>
      </div>
    </div>
  );
}

function InfoRow({ label, val, icon }) {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-3 text-[#7A8B5E]">
        {icon}
        <span className="text-[9px] font-black uppercase tracking-widest opacity-60">{label}</span>
      </div>
      <span className="text-xs font-black text-[#1A1F16] tracking-tight">{val || 'N/A'}</span>
    </div>
  );
}

function DocumentLink({ label, exists, docType, onUpload }) {
  const handleOpen = () => {
    if (exists) {
      const token = localStorage.getItem('studentToken');
      window.open(`${API_URL}/student-document/${docType}?token=${token}`, '_blank');
    }
  };

  return (
    <div className="flex items-center justify-between p-6 bg-white rounded-[32px] border border-[#7A8B5E]/5 shadow-sm group hover:border-[#7A8B5E]/20 transition-all">
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${exists ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-50 text-gray-300'}`}>
          <FileText size={18} />
        </div>
        <div>
          <p className="text-[9px] font-black uppercase text-[#6B7280] mb-0.5 tracking-widest">{label}</p>
          <p className="text-[10px] font-black text-[#1A1F16] uppercase tracking-tight">{exists ? 'Verified Archive' : 'Pending Upload'}</p>
        </div>
      </div>
      <div className="flex gap-2">
        {exists ? (
          <button 
            onClick={handleOpen}
            className="p-2.5 bg-[#F8FAF5] text-[#7A8B5E] rounded-xl hover:bg-[#7A8B5E] hover:text-white transition-all shadow-sm"
            title="Open Document"
          >
            <ExternalLink size={14} />
          </button>
        ) : (
          <label className="p-2.5 bg-[#7A8B5E]/5 text-[#7A8B5E] rounded-xl hover:bg-[#7A8B5E] hover:text-white transition-all cursor-pointer shadow-sm">
            <Upload size={14} />
            <input type="file" onChange={onUpload} className="hidden" accept=".pdf,.jpg,.jpeg,.png" />
          </label>
        )}
      </div>
    </div>
  );
}
