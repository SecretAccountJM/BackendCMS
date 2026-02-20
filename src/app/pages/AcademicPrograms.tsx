'use client'

import React, { useState } from "react";
import { 
  Cpu, 
  Lightbulb, 
  Building2, 
  ChevronRight, 
  ExternalLink,
  Edit,
  Save,
  CheckCircle,
  FileText
} from "lucide-react";
import { clsx } from "clsx";
import { toast } from "sonner";

const PROGRAMS = [
  {
    id: "CE",
    name: "Civil Engineering",
    icon: Building2,
    color: "bg-blue-600",
    shadowColor: "shadow-blue-600/20",
    description: "Focuses on the design, construction, and maintenance of the physical and naturally built environment.",
    stats: { students: 450, faculty: 22, labs: 8 }
  },
  {
    id: "EE",
    name: "Electrical Engineering",
    icon: Lightbulb,
    color: "bg-yellow-500",
    shadowColor: "shadow-yellow-500/20",
    description: "Deals with the study and application of electricity, electronics, and electromagnetism.",
    stats: { students: 380, faculty: 18, labs: 6 }
  },
  {
    id: "IT",
    name: "Information Technology",
    icon: Cpu,
    color: "bg-purple-600",
    shadowColor: "shadow-purple-600/20",
    description: "Focuses on the use of systems for storing, retrieving, and sending information.",
    stats: { students: 520, faculty: 25, labs: 12 }
  }
];

export function AcademicPrograms() {
  const [selectedId, setSelectedId] = useState("CE");
  const selectedProgram = PROGRAMS.find(p => p.id === selectedId)!;

  const handleUpdate = () => {
    toast.success(`${selectedProgram.name} program details updated!`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
      {/* Program Selection Sidebar */}
      <div className="lg:col-span-3 space-y-4">
        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Engineering Departments</label>
        <div className="space-y-2">
          {PROGRAMS.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedId(p.id)}
              className={clsx(
                "w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left group",
                selectedId === p.id 
                  ? "border-blue-600 bg-white shadow-md ring-4 ring-blue-50" 
                  : "border-transparent bg-white/50 text-gray-500 hover:bg-white hover:border-gray-200"
              )}
            >
              <div className={clsx("w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg", p.color)}>
                <p.icon className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <span className={clsx("text-sm font-bold block", selectedId === p.id ? "text-gray-900" : "text-gray-600")}>
                  {p.id} Department
                </span>
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-tight">
                  {p.stats.students} Students
                </span>
              </div>
              <ChevronRight className={clsx("w-4 h-4 transition-transform", selectedId === p.id ? "text-blue-600 translate-x-1" : "text-gray-300")} />
            </button>
          ))}
        </div>

        <div className="mt-8 p-6 bg-blue-50 rounded-2xl border border-blue-100">
          <h4 className="text-sm font-bold text-blue-900 flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4" />
            Admin Quick Tip
          </h4>
          <p className="text-xs text-blue-700 font-medium leading-relaxed">
            Updating the description here will immediately change the program overview cards on the public "Programs" page.
          </p>
        </div>
      </div>

      {/* Program Editor Area */}
      <div className="lg:col-span-9">
        <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm flex flex-col h-full">
          {/* Editor Header */}
          <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/30">
            <div className="flex items-center gap-4">
              <div className={clsx("w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-xl", selectedProgram.color, selectedProgram.shadowColor)}>
                <selectedProgram.icon className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight">{selectedProgram.name}</h3>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  Active Program Dashboard
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors">
                <ExternalLink className="w-4 h-4" />
                View Page
              </button>
              <button 
                onClick={handleUpdate}
                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
              >
                <Save className="w-4 h-4" />
                Update Program
              </button>
            </div>
          </div>

          {/* Editor Body */}
          <div className="flex-1 p-8 space-y-8 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 text-center group hover:bg-white hover:shadow-md transition-all">
                <span className="text-3xl font-black text-gray-900 block mb-1">{selectedProgram.stats.students}</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Students</span>
              </div>
              <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 text-center group hover:bg-white hover:shadow-md transition-all">
                <span className="text-3xl font-black text-gray-900 block mb-1">{selectedProgram.stats.faculty}</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Faculty</span>
              </div>
              <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 text-center group hover:bg-white hover:shadow-md transition-all">
                <span className="text-3xl font-black text-gray-900 block mb-1">{selectedProgram.stats.labs}</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Labs</span>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-500" />
                    Program Description
                  </label>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Character Limit: 500</span>
                </div>
                <textarea 
                  className="w-full h-40 bg-gray-50 border border-gray-200 rounded-2xl p-6 text-base font-medium text-gray-700 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all resize-none shadow-inner"
                  defaultValue={selectedProgram.description}
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-xs font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                    <Edit className="w-4 h-4 text-blue-500" />
                    Quick Actions
                  </label>
                  <div className="grid grid-cols-1 gap-3">
                    <button className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl hover:border-blue-500 transition-colors shadow-sm text-left group">
                      <span className="text-sm font-bold text-gray-700">Update Curriculum PDF</span>
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500" />
                    </button>
                    <button className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl hover:border-blue-500 transition-colors shadow-sm text-left group">
                      <span className="text-sm font-bold text-gray-700">Manage Faculty Members</span>
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500" />
                    </button>
                  </div>
                </div>

                <div className="p-6 bg-[#0A192F] rounded-2xl text-white flex flex-col justify-center shadow-xl">
                  <h4 className="text-sm font-bold mb-2 uppercase tracking-tight">Active Curriculum</h4>
                  <p className="text-xs text-blue-100/60 font-medium mb-4">SY 2026-2027 v.2.4</p>
                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-3/4 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                  </div>
                  <span className="text-[10px] mt-2 font-bold text-blue-300/80 uppercase">75% Data Accuracy Score</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
