"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import toast, { Toaster } from "react-hot-toast";
import { 
  Upload, 
  X, 
  File, 
  Image as ImageIcon, 
  Video, 
  MessageSquare, 
  Send, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  ChevronDown,
  Layout
} from "lucide-react";

export default function Complaints() {
  const [complaintType, setComplaintType] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [complaints, setComplaints] = useState([]);
  const [studentId, setStudentId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [otherComplaintType, setOtherComplaintType] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [floorNumber, setFloorNumber] = useState("");
  const [maintenanceItems, setMaintenanceItems] = useState([]);

  const maintenanceOptions = [
    "Electrical Issues", "Plumbing Issues", "Water Supply Problem", "Furniture Damage",
    "Door Repair", "Window Repair", "Air Conditioning", "Fan Issues", "Ventilation Problem",
    "Lighting Issues", "Bulb Replacement", "Bed Issues", "Mattress Problem", "Cupboard Issues",
    "Wardrobe Problem", "Study Table Issues", "Chair Damage", "Bathroom Fittings", "Toilet Issues",
    "Flush Problem", "Washbasin Issues", "Tap Leakage", "Wall Damage", "Paint Issues", "Ceiling Issues",
    "Roof Leakage", "Flooring Issues", "Tiles Damage", "Lock Issues", "Key Problem", "Wi-Fi Problem",
    "Internet Issues", "Geyser Problem", "Water Heater Issues", "Pest Control", "Drainage Problem",
    "Sewage Issues", "Curtains Issues", "Blinds Problem", "Other"
  ];

  useEffect(() => {
    const id = localStorage.getItem("studentId");
    if (id) setStudentId(id);
  }, []);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/complaints`);
      setComplaints(res.data?.complaints || []);
    } catch (err) {
      console.error("History fetch failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (studentId) fetchComplaints();
  }, [studentId]);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => {
      const isValidType = /\.(jpg|jpeg|png|gif|mp4|mov|avi|webm)$/i.test(file.name);
      const isValidSize = file.size <= 50 * 1024 * 1024;
      if (!isValidType) toast.error(`${file.name} invalid format`);
      if (!isValidSize) toast.error(`${file.name} too large`);
      return isValidType && isValidSize;
    });

    if (selectedFiles.length + validFiles.length > 5) return toast.error("Max 5 files allowed");
    setSelectedFiles(prev => [...prev, ...validFiles]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!complaintType || !subject || !description) return toast.error("Missing mandatory fields");
    
    setLoading(true);
    const loadingToast = toast.loading("Submitting report...");
    try {
      const formData = new FormData();
      formData.append("complaintType", complaintType);
      formData.append("subject", subject);
      formData.append("description", description);
      if (complaintType === "Others") formData.append("otherComplaintType", otherComplaintType);
      if (complaintType === "Maintenance issue") {
        formData.append("floorNumber", floorNumber);
        formData.append("maintenanceItems", JSON.stringify(maintenanceItems));
      }
      selectedFiles.forEach(file => formData.append("attachments", file));

      await api.post("/complaint", formData, { headers: { "Content-Type": "multipart/form-data" } });
      toast.success("Report filed successfully", { id: loadingToast });
      
      // Reset
      setComplaintType(""); setSubject(""); setDescription(""); setSelectedFiles([]);
      setFloorNumber(""); setMaintenanceItems([]); fetchComplaints();
    } catch (err) {
      toast.error("Filing failed", { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Toaster position="top-right" />
      
      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1.5 h-6 bg-[#7A8B5E] rounded-full"></div>
            <h2 className="text-2xl font-black text-[#1A1F16] tracking-tight uppercase italic">Support Desk</h2>
          </div>
          <p className="text-xs font-bold text-[#6B7280] uppercase tracking-widest">Report issues or request maintenance</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-10">
        
        {/* ── Submission Form ── */}
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white rounded-[40px] shadow-2xl shadow-[#7A8B5E]/5 border border-[#7A8B5E]/5 overflow-hidden">
            <div className="bg-[#1A1F16] p-8 text-white">
              <h3 className="text-sm font-black uppercase tracking-[0.2em] flex items-center gap-3 italic">
                <MessageSquare size={18} className="text-[#7A8B5E]" /> File New Report
              </h3>
            </div>
            
            <form onSubmit={handleSubmit} className="p-10 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest ml-1">Issue Category</label>
                <div className="relative">
                  <select
                    value={complaintType}
                    onChange={(e) => setComplaintType(e.target.value)}
                    className="w-full px-6 py-4 rounded-2xl bg-[#F8FAF5] border-2 border-transparent focus:border-[#7A8B5E]/20 focus:bg-white outline-none font-bold text-[#1A1F16] transition-all text-sm appearance-none"
                  >
                    <option value="">Select Category</option>
                    <option value="Noise Disturbance">Noise Disturbance</option>
                    <option value="Maintenance issue">Maintenance issue</option>
                    <option value="Cleanliness issue">Cleanliness issue</option>
                    <option value="Others">Others</option>
                  </select>
                  <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-[#7A8B5E] pointer-events-none" size={16} />
                </div>
              </div>

              {complaintType === "Maintenance issue" && (
                <div className="space-y-4 p-6 bg-[#F8FAF5] rounded-[32px] border border-[#7A8B5E]/5 animate-in slide-in-from-top-2 duration-300">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-[#6B7280] uppercase tracking-widest ml-1">Floor Level</label>
                    <input
                      type="text"
                      value={floorNumber}
                      onChange={(e) => setFloorNumber(e.target.value)}
                      placeholder="e.g. Ground, 1st"
                      className="w-full px-5 py-3 rounded-xl bg-white border border-[#7A8B5E]/10 font-bold text-xs outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-[#6B7280] uppercase tracking-widest ml-1">Specific Items</label>
                    <div className="max-h-40 overflow-y-auto grid grid-cols-1 gap-2 pr-2 custom-scrollbar">
                      {maintenanceOptions.map(item => (
                        <label key={item} className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                          maintenanceItems.includes(item) ? 'bg-[#7A8B5E] border-[#7A8B5E] text-white' : 'bg-white border-[#7A8B5E]/10 text-[#6B7280]'
                        }`}>
                          <input 
                            type="checkbox" 
                            className="hidden" 
                            checked={maintenanceItems.includes(item)}
                            onChange={() => setMaintenanceItems(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item])}
                          />
                          <span className="text-[10px] font-black uppercase tracking-tight">{item}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest ml-1">Subject</label>
                <input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Summary of the issue"
                  className="w-full px-6 py-4 rounded-2xl bg-[#F8FAF5] border-2 border-transparent focus:border-[#7A8B5E]/20 focus:bg-white outline-none font-bold text-[#1A1F16] transition-all text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest ml-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Tell us more about the problem..."
                  className="w-full px-6 py-4 rounded-2xl bg-[#F8FAF5] border-2 border-transparent focus:border-[#7A8B5E]/20 focus:bg-white outline-none font-bold text-[#1A1F16] transition-all text-sm resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest ml-1">Evidence (Images/Video)</label>
                <div className="grid grid-cols-5 gap-3">
                  <label className="aspect-square rounded-2xl border-2 border-dashed border-[#7A8B5E]/20 flex flex-col items-center justify-center text-[#7A8B5E] hover:bg-[#7A8B5E]/5 cursor-pointer transition-all">
                    <Upload size={20} />
                    <input type="file" multiple className="hidden" onChange={handleFileSelect} accept="image/*,video/*" />
                  </label>
                  {selectedFiles.map((file, i) => (
                    <div key={i} className="aspect-square rounded-2xl bg-[#F8FAF5] border border-[#7A8B5E]/10 flex flex-col items-center justify-center relative group overflow-hidden">
                      {file.type.startsWith('image/') ? <ImageIcon size={18} /> : <Video size={18} />}
                      <span className="text-[8px] font-black truncate w-full px-2 text-center">{file.name}</span>
                      <button onClick={() => setSelectedFiles(prev => prev.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        <X size={8} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1A1F16] text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-black/20 flex items-center justify-center gap-3 hover:bg-[#2A3324] transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? 'Transmitting...' : <>Submit Report <Send size={16} /></>}
              </button>
            </form>
          </div>
        </div>

        {/* ── Case History ── */}
        <div className="xl:col-span-3 space-y-6">
          <div className="flex items-center justify-between px-4">
            <h3 className="text-sm font-black text-[#6B7280] uppercase tracking-[0.2em] flex items-center gap-3 italic">
              <Layout size={18} className="text-[#7A8B5E]" /> Resolved & Active Cases
            </h3>
          </div>

          <div className="space-y-4">
            {complaints.length === 0 ? (
              <div className="bg-white rounded-[40px] p-20 text-center border border-[#7A8B5E]/5 shadow-2xl shadow-[#7A8B5E]/5">
                <AlertCircle className="mx-auto text-[#7A8B5E] opacity-20 mb-4" size={48} />
                <p className="text-[10px] font-black text-[#6B7280] uppercase tracking-[0.2em]">No history on file</p>
              </div>
            ) : (
              complaints.map((comp, idx) => (
                <div key={idx} className="bg-white rounded-[32px] p-8 shadow-2xl shadow-[#7A8B5E]/5 border border-[#7A8B5E]/5 group hover:border-[#7A8B5E]/20 transition-all">
                  <div className="flex flex-col sm:flex-row justify-between gap-6">
                    <div className="flex gap-6">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${
                        comp.status === 'Resolved' ? 'bg-green-50 text-green-600' :
                        comp.status === 'In Progress' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'
                      }`}>
                        {comp.status === 'Resolved' ? <CheckCircle size={24} /> : <Clock size={24} />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1 flex-wrap">
                          <h4 className="text-sm font-black text-[#1A1F16] uppercase italic">{comp.subject}</h4>
                          <span className={`text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${
                            comp.status === 'Resolved' ? 'bg-green-50 text-green-600 border-green-100' :
                            comp.status === 'In Progress' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                          }`}>
                            {comp.status}
                          </span>
                        </div>
                        <p className="text-[10px] font-black text-[#7A8B5E] uppercase tracking-widest mb-2 opacity-80">{comp.complaintType}</p>
                        <p className="text-[11px] font-bold text-[#6B7280] italic leading-relaxed line-clamp-2">{comp.description}</p>
                        
                        {comp.hasAttachments && (
                          <div className="mt-4 flex items-center gap-2 text-[9px] font-black text-[#7A8B5E] uppercase tracking-widest">
                            <File size={12} /> {comp.attachmentCount} Attachment(s)
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right flex flex-row sm:flex-col justify-between items-center sm:items-end sm:min-w-[100px]">
                      <div className="bg-[#F8FAF5] px-4 py-2 rounded-xl border border-[#7A8B5E]/5">
                        <p className="text-[10px] font-black text-[#1A1F16] tracking-tight uppercase">
                          {new Date(comp.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                        </p>
                        <p className="text-[8px] font-black text-[#6B7280] uppercase tracking-widest opacity-60">Filed On</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}