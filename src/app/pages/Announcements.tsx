'use client'

import React from "react";
import { Megaphone, Plus, Bell, Clock, Trash2, Send } from "lucide-react";

export function Announcements() {
  const announcements = [
    { id: 1, title: "Midterm Examination Schedule", date: "Feb 20, 2026", type: "Academic", priority: "High" },
    { id: 2, title: "Engineering Week 2026 Registration", date: "Feb 18, 2026", type: "Event", priority: "Normal" },
    { id: 3, title: "Laboratory Maintenance Notice", date: "Feb 15, 2026", type: "System", priority: "Low" },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {announcements.map((ann) => (
          <div key={ann.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl transition-all group">
            <div className="flex justify-between items-start mb-6">
              <div className="p-4 bg-orange-50 text-orange-500 rounded-2xl group-hover:bg-orange-500 group-hover:text-white transition-all">
                <Megaphone className="w-6 h-6" />
              </div>
              <span className={`text-[9px] px-2 py-1 rounded-full font-black uppercase tracking-widest ${
                ann.priority === 'High' ? 'bg-red-50 text-red-500' : 'bg-slate-50 text-slate-400'
              }`}>
                {ann.priority} Priority
              </span>
            </div>
            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-2 leading-tight">{ann.title}</h3>
            <div className="flex items-center gap-4 mt-6 pt-6 border-t border-slate-50">
               <div className="flex items-center gap-2">
                  <Clock className="w-3 h-3 text-slate-300" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase">{ann.date}</span>
               </div>
               <div className="flex items-center gap-2">
                  <Bell className="w-3 h-3 text-slate-300" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase">{ann.type}</span>
               </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-100 p-10 flex items-center justify-between shadow-sm">
         <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
               <Plus className="w-8 h-8" />
            </div>
            <div>
               <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Create New Announcement</h4>
               <p className="text-xs font-medium text-slate-400">Broadcast messages to all student dashboards instantly.</p>
            </div>
         </div>
         <button className="px-10 py-4 bg-[#0A192F] text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#112240] transition-all">
            Compose Message
         </button>
      </div>
    </div>
  );
}
