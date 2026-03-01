'use client'

import React, { useState } from "react";
import { 
  Cpu, 
  Lightbulb, 
  Building2, 
  ChevronRight, 
  ExternalLink,
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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
      {/* Program Selection Sidebar */}
      <div className="lg:col-span-3 space-y-3">
        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-tight mb-3">Engineering Departments</label>
        <div className="space-y-2">
          {PROGRAMS.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedId(p.id)}
              className={clsx(
                "w-full flex items-center gap-3 p-3 rounded-lg border transition-all text-left group",
                selectedId === p.id 
                  ? "ceit-card ring-2 ring-blue-100" 
                  : "ceit-card text-gray-500 hover:border-blue-200"
              )}
            >
              <div className={clsx("w-10 h-10 rounded-lg flex items-center justify-center text-white shadow", p.color)}>
                <p.icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <span className={clsx("text-sm font-semibold block", selectedId === p.id ? "text-gray-900" : "text-gray-600")}>
                  {p.id}
                </span>
                <span className="text-xs font-medium text-gray-500">
                  {p.stats.students} students
                </span>
              </div>
              <ChevronRight className={clsx("w-4 h-4 transition-transform flex-shrink-0", selectedId === p.id ? "text-blue-500 translate-x-0.5" : "text-gray-300")} />
            </button>
          ))}
        </div>

        <div className="mt-6 p-4 ceit-card-soft">
          <h4 className="text-xs font-semibold text-blue-900 flex items-center gap-2 mb-1.5">
            <CheckCircle className="w-3.5 h-3.5" />
            Admin Tip
          </h4>
          <p className="text-xs text-blue-700 leading-relaxed">
            Changes here update the public Programs page.
          </p>
        </div>
      </div>

      {/* Program Editor Area */}
      <div className="lg:col-span-9">
        <div className="ceit-card overflow-hidden flex flex-col h-full">
          {/* Editor Header */}
          <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50">
            <div className="flex items-center gap-3">
              <div className={clsx("w-12 h-12 rounded-lg flex items-center justify-center text-white shadow", selectedProgram.color)}>
                <selectedProgram.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">{selectedProgram.name}</h3>
                <p className="text-xs text-gray-500 font-medium flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                  Active
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                <ExternalLink className="w-3.5 h-3.5" />
                View
              </button>
              <button 
                onClick={handleUpdate}
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-all shadow"
              >
                <Save className="w-3.5 h-3.5" />
                Update
              </button>
            </div>
          </div>

          {/* Editor Body */}
          <div className="flex-1 p-6 space-y-5 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 ceit-card-soft text-center transition-all">
                <span className="text-2xl font-bold text-gray-900 block">{selectedProgram.stats.students}</span>
                <span className="text-xs font-medium text-gray-500">Students</span>
              </div>
              <div className="p-4 ceit-card-soft text-center transition-all">
                <span className="text-2xl font-bold text-gray-900 block">{selectedProgram.stats.faculty}</span>
                <span className="text-xs font-medium text-gray-500">Faculty</span>
              </div>
              <div className="p-4 ceit-card-soft text-center transition-all">
                <span className="text-2xl font-bold text-gray-900 block">{selectedProgram.stats.labs}</span>
                <span className="text-xs font-medium text-gray-500">Labs</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-gray-900 flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-blue-500" />
                    Program Description
                  </label>
                  <span className="text-xs font-medium text-gray-400">Max 500 characters</span>
                </div>
                <textarea 
                  className="w-full h-32 bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all resize-none"
                  defaultValue={selectedProgram.description}
                ></textarea>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
