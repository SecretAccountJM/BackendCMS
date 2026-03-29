'use client'

import React, { useState, useEffect, useCallback } from "react";
import { Save, Plus, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "../lib/api";

interface Service {
  id: string;
  title: string;
}

interface HomeContent {
  collegeSection: {
    title: string;
    description: string;
  };
  deanSection: {
    name: string;
    photoUrl: string;
    description: string;
  };
  registrarSection: {
    title: string;
    description: string;
    phone: string;
    email: string;
    location: string;
    hours: string;
    services: Service[];
  };
}

const INITIAL_DATA: HomeContent = {
  collegeSection: {
    title: "College of Engineering and Information Technology",
    description: "Our college offers Civil Engineering, Electrical Engineering, and Information Technology programs. Each program is supported by a dedicated student organization."
  },
  deanSection: {
    name: "Engr. Jordan Velasco",
    photoUrl: "/images/dean.jpg",
    description: "Under his guidance, the College continues to uphold its mission of producing future-ready engineers and IT professionals who are equipped to meet the evolving demands of society and industry."
  },
  registrarSection: {
    title: "Registrar's Office",
    description: "The Registrar's Office maintains academic records, coordinates course registration, and ensures the integrity of academic policies and procedures.",
    phone: "+63 (32) 7000 loc. 125",
    email: "registrar.office_un@yahoo.com",
    location: "Maysan Road corner Tongco Street, Maysan, Valenzuela City",
    hours: "Monday-Friday, 8:00 AM - 5:00 PM",
    services: [
      { id: "1", title: "Course Registration & Add/Drop" },
      { id: "2", title: "Transcript Requests" },
      { id: "3", title: "Degree Verification" },
      { id: "4", title: "Graduation Processing" }
    ]
  }
};

export function HomeSettings() {
  const [data, setData] = useState<HomeContent>(INITIAL_DATA);
  const [newService, setNewService] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchContent = useCallback(async () => {
    try {
      const res = await apiFetch<{ content: HomeContent }>("/site-content/home");
      setData(res.content);
    } catch {
      // No saved content yet — use defaults
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchContent(); }, [fetchContent]);

  const handleCollegeSectionChange = (field: string, value: string) => {
    setData(prev => ({ ...prev, collegeSection: { ...prev.collegeSection, [field]: value } }));
  };

  const handleDeanSectionChange = (field: string, value: string) => {
    setData(prev => ({ ...prev, deanSection: { ...prev.deanSection, [field]: value } }));
  };

  const handleRegistrarChange = (field: string, value: string) => {
    setData(prev => ({ ...prev, registrarSection: { ...prev.registrarSection, [field]: value } }));
  };

  const addService = () => {
    if (!newService.trim()) return;
    setData(prev => ({
      ...prev,
      registrarSection: {
        ...prev.registrarSection,
        services: [...prev.registrarSection.services, { id: Date.now().toString(), title: newService }]
      }
    }));
    setNewService("");
  };

  const removeService = (id: string) => {
    setData(prev => ({
      ...prev,
      registrarSection: {
        ...prev.registrarSection,
        services: prev.registrarSection.services.filter(s => s.id !== id)
      }
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await apiFetch("/site-content/home", {
        method: "PUT",
        body: JSON.stringify({ content: data }),
      });
      toast.success("Home page content updated successfully!");
    } catch (err: any) {
      toast.error(`Failed to save: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* College Intro Section */}
      <div className="ceit-card p-5">
        <h2 className="text-base font-bold text-slate-900 mb-4 uppercase tracking-wide">College Intro Section</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-900 mb-2 uppercase">Section Title</label>
            <input type="text" value={data.collegeSection.title} onChange={(e) => handleCollegeSectionChange('title', e.target.value)} className="w-full px-3 py-2 bg-white border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-900 mb-2 uppercase">Description</label>
            <textarea value={data.collegeSection.description} onChange={(e) => handleCollegeSectionChange('description', e.target.value)} className="w-full px-3 py-2 bg-white border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 resize-none h-20" />
          </div>
        </div>
      </div>

      {/* Meet the Dean Section */}
      <div className="ceit-card p-5">
        <h2 className="text-base font-bold text-slate-900 mb-4 uppercase tracking-wide">Meet the Dean</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-900 mb-2 uppercase">Dean Name</label>
            <input type="text" value={data.deanSection.name} onChange={(e) => handleDeanSectionChange('name', e.target.value)} className="w-full px-3 py-2 bg-white border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-900 mb-2 uppercase">Description</label>
            <textarea value={data.deanSection.description} onChange={(e) => handleDeanSectionChange('description', e.target.value)} className="w-full px-3 py-2 bg-white border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 resize-none h-20" />
          </div>
        </div>
      </div>

      {/* Registrar Section */}
      <div className="ceit-card p-5">
        <h2 className="text-base font-bold text-slate-900 mb-4 uppercase tracking-wide">Registrar's Office</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-900 mb-2 uppercase">Office Title</label>
            <input type="text" value={data.registrarSection.title} onChange={(e) => handleRegistrarChange('title', e.target.value)} className="w-full px-3 py-2 bg-white border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-900 mb-2 uppercase">Description</label>
            <textarea value={data.registrarSection.description} onChange={(e) => handleRegistrarChange('description', e.target.value)} className="w-full px-3 py-2 bg-white border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 resize-none h-16" />
          </div>
          <div className="border-t border-gray-300 pt-3">
            <h3 className="text-xs font-bold text-slate-900 mb-3 uppercase">Contact Information</h3>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1 uppercase">Phone</label>
                <input type="text" value={data.registrarSection.phone} onChange={(e) => handleRegistrarChange('phone', e.target.value)} className="w-full px-3 py-2 bg-white border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1 uppercase">Email</label>
                <input type="text" value={data.registrarSection.email} onChange={(e) => handleRegistrarChange('email', e.target.value)} className="w-full px-3 py-2 bg-white border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-bold text-slate-900 mb-1 uppercase">Location</label>
                <input type="text" value={data.registrarSection.location} onChange={(e) => handleRegistrarChange('location', e.target.value)} className="w-full px-3 py-2 bg-white border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-bold text-slate-900 mb-1 uppercase">Office Hours</label>
                <input type="text" value={data.registrarSection.hours} onChange={(e) => handleRegistrarChange('hours', e.target.value)} className="w-full px-3 py-2 bg-white border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" />
              </div>
            </div>
          </div>
          <div className="border-t border-gray-300 pt-3">
            <h3 className="text-xs font-bold text-slate-900 mb-3 uppercase">Services</h3>
            <div className="space-y-2 mb-2">
              {data.registrarSection.services.map((service) => (
                <div key={service.id} className="ceit-card-soft flex items-center justify-between p-2">
                  <span className="text-xs text-slate-900 font-medium">{service.title}</span>
                  <button onClick={() => removeService(service.id)} className="px-3 py-1 bg-red-600 text-white rounded text-xs font-bold hover:bg-red-700">REMOVE</button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input type="text" placeholder="Add new service..." value={newService} onChange={(e) => setNewService(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && addService()} className="flex-1 px-3 py-2 bg-white border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" />
              <button onClick={addService} className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 uppercase">
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-5 py-2 bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors text-xs uppercase disabled:opacity-50">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Home Content
        </button>
      </div>
    </div>
  );
}
