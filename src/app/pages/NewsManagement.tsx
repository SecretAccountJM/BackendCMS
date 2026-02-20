'use client'

import React, { useState } from "react";
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit2,
  EyeOff,
  BarChart2,
  Filter,
  CheckCircle2,
  Clock,
  Star,
  X,
  Paperclip,
  Trash2,
  Archive,
  ChevronRight,
  Info,
  Calendar,
  Save,
  Send,
  CloudUpload
} from "lucide-react";
import { clsx } from "clsx";
import { toast } from "sonner";


function StarIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="none"
      className={className}
    >
      <path d="M12 1.7L14.9 8.6L22.2 9.2L16.8 13.9L18.4 21L12 17.3L5.6 21L7.2 13.9L1.8 9.2L9.1 8.6L12 1.7Z" />
    </svg>
  );
}

const NEWS_DATA = [
  { id: 1, title: "Engineering Students Win National Innovation Award", slug: "students-win-innovation-award", category: "CE", status: "published", featured: true, date: "Feb 18, 2026", reads: "1.2k" },
  { id: 2, title: "New Electrical Engineering Lab Equipment Arrives", slug: "new-ee-lab-equipment", category: "EE", status: "published", featured: false, date: "Feb 15, 2026", reads: "840" },
  { id: 3, title: "IT Department to Host Cybersecurity Workshop", slug: "it-cybersecurity-workshop", category: "IT", status: "draft", featured: false, date: "Feb 12, 2026", reads: "0" },
];

export function NewsManagement() {
  const [filter, setFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-8">
      {/* Filters & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 w-fit shadow-sm">
          {["All", "CE", "EE", "IT"].map((pill) => (
            <button
              key={pill}
              onClick={() => setFilter(pill)}
              className={clsx(
                "px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                filter === pill ? "bg-[#0A192F] text-white shadow-lg" : "text-slate-400 hover:bg-slate-50"
              )}
            >
              {pill}
            </button>
          ))}
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-xl shadow-slate-200/50">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Article</th>
              <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Stats</th>
              <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {NEWS_DATA.map((article) => (
              <tr key={article.id} className="group hover:bg-slate-50/30 transition-colors">
                <td className="px-10 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-slate-100 overflow-hidden shrink-0 border border-slate-100">
                      <img src={`https://images.unsplash.com/photo-${1517245386807 + article.id}?auto=format&fit=crop&q=80&w=200`} alt="Cover" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{article.title}</span>
                        {article.featured && <StarIcon className="w-3 h-3 text-orange-500 fill-current" />}
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{article.date}</span>
                        <div className="flex items-center gap-1.5">
                          <span className={clsx("w-2 h-2 rounded-full", article.status === 'published' ? 'bg-green-500' : 'bg-slate-300')}></span>
                          <span className="text-[10px] font-black text-slate-500 uppercase">{article.status}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-10 py-6">
                  <div className="flex items-center gap-2">
                    <BarChart2 className="w-4 h-4 text-slate-300" />
                    <span className="text-xs font-black text-slate-600">{article.reads} Reads</span>
                  </div>
                </td>
                <td className="px-10 py-6 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => setIsModalOpen(true)} className="p-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-white hover:shadow-md transition-all">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:text-slate-600 transition-colors">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Article Creator (Split-Screen) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-[#F8FAFC]">
          {/* Header */}
          <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-10 shrink-0">
            <div className="flex items-center gap-6">
              <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-slate-50 rounded-2xl transition-colors">
                <X className="w-6 h-6 text-slate-400" />
              </button>
              <div>
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Article Editor</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Editing Mode • System V.4.2</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-6 py-2.5 bg-slate-100 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200">History</button>
              <button className="px-6 py-2.5 bg-blue-50 text-blue-600 border border-blue-100 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-100">Preview</button>
            </div>
          </header>

          {/* Main Content (Split-Screen) */}
          <div className="flex-1 flex overflow-hidden">
            {/* Left Side (Input Fields) */}
            <div className="flex-1 overflow-y-auto p-12 bg-white space-y-12">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Headline</label>
                <input
                  type="text"
                  placeholder="Enter a powerful headline..."
                  className="w-full text-5xl font-black text-[#0A192F] placeholder:text-slate-100 outline-none border-none p-0 uppercase leading-tight tracking-tighter"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Slug (Custom URL)</label>
                <div className="flex items-center gap-2 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-sm font-bold text-slate-400">site.com/news/</span>
                  <input type="text" placeholder="unique-identifier" className="flex-1 bg-transparent border-none outline-none text-sm font-black text-blue-600 uppercase tracking-widest p-0" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Article Content</label>
                  <div className="flex gap-4">
                    <button className="text-[10px] font-black text-blue-600 uppercase">Auto-format</button>
                    <button className="text-[10px] font-black text-slate-400 uppercase">Clear</button>
                  </div>
                </div>
                <div className="min-h-[400px] bg-slate-50/50 rounded-3xl border border-slate-100 p-10 font-medium text-slate-700 leading-relaxed text-lg outline-none focus:bg-white transition-colors">
                  {/* Rich Text Area (Toolbar-less writing space) */}
                  <textarea
                    className="w-full h-full bg-transparent border-none outline-none resize-none"
                    placeholder="Start telling the story here... Support for Markdown enabled."
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Attachments & Resources</label>
                <div className="p-8 border-2 border-dashed border-slate-200 rounded-3xl flex items-center justify-center gap-4 bg-slate-50/30 group hover:border-blue-400 hover:bg-blue-50/30 transition-all cursor-pointer">
                  <div className="p-4 bg-white rounded-2xl shadow-sm text-slate-400 group-hover:text-blue-500 transition-colors">
                    <Paperclip className="w-8 h-8" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-black text-slate-900 uppercase">Add Attachments</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Upload PDF, Excel, or Documents</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side (Configuration Sidebar) */}
            <div className="w-[420px] bg-[#F8FAFC] border-l border-slate-100 overflow-y-auto p-12 space-y-12">
              {/* Cover Image Slot */}
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Cover Image</label>
                <div className="aspect-video bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm relative group cursor-pointer">
                  <img src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=400" alt="Cover" className="w-full h-full object-cover brightness-75 group-hover:brightness-50 transition-all" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <CloudUpload className="w-10 h-10 text-white" />
                  </div>
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase text-center tracking-widest italic">Click to change cover photo</p>
              </div>

              {/* Metadata Fields */}
              <div className="space-y-6">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">SEO Metadata</label>
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                    <label className="text-[9px] font-black text-slate-300 uppercase block mb-1">Meta Title</label>
                    <input type="text" placeholder="SEO optimized title..." className="w-full bg-transparent border-none outline-none text-xs font-bold text-slate-700 p-0" />
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                    <label className="text-[9px] font-black text-slate-300 uppercase block mb-1">Meta Description</label>
                    <textarea rows={3} placeholder="Brief summary for search engines..." className="w-full bg-transparent border-none outline-none text-xs font-bold text-slate-700 p-0 resize-none" />
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                    <label className="text-[9px] font-black text-slate-300 uppercase block mb-1">Keywords</label>
                    <input type="text" placeholder="Engineering, Innovation, Awards..." className="w-full bg-transparent border-none outline-none text-xs font-bold text-slate-700 p-0" />
                  </div>
                </div>
              </div>

              {/* Department Tags */}
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Department Tags</label>
                <div className="flex flex-wrap gap-3">
                  {["CE", "EE", "IT", "General"].map((dept) => (
                    <button key={dept} className="w-16 h-16 rounded-full border-2 border-slate-200 bg-white flex flex-col items-center justify-center group hover:border-blue-600 hover:text-blue-600 transition-all">
                      <span className="text-xs font-black uppercase">{dept}</span>
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-200 mt-1 group-hover:bg-blue-600"></div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6 bg-[#0A192F] rounded-[2rem] text-white space-y-4 shadow-2xl">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                  <Info className="w-3 h-3 text-orange-500" />
                  Validation Check
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase">
                    <span className="text-white/40 tracking-wider">Alt Text</span>
                    <span className="text-green-400 tracking-widest">Valid</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase">
                    <span className="text-white/40 tracking-wider">Cover Size</span>
                    <span className="text-orange-400 tracking-widest">Large</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Bar (Workflow Controls) - Sticky Bar */}
          <footer className="h-24 bg-white border-t border-slate-100 flex items-center justify-between px-10 shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 px-6 py-3 text-red-500 bg-red-50 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-100 transition-all">
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
              <button className="flex items-center gap-2 px-6 py-3 text-slate-500 bg-slate-50 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-100 transition-all">
                <Archive className="w-4 h-4" />
                Archive
              </button>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => toast.success("Draft saved successfully!")}
                className="px-8 py-3 bg-white border border-slate-200 text-slate-900 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 shadow-sm"
              >
                Save Draft
              </button>
              <button
                onClick={() => toast.info("Submitted for approval to Chairperson.")}
                className="px-8 py-3 bg-blue-50 text-blue-700 border border-blue-100 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-100"
              >
                Submit for Approval
              </button>
              <button
                onClick={() => {
                  toast.success("Article Published Successfully!");
                  setIsModalOpen(false);
                }}
                className="flex items-center gap-2 px-10 py-3 bg-orange-500 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-orange-600 shadow-lg shadow-orange-500/20 transition-all hover:scale-105 active:scale-95"
              >
                <Send className="w-4 h-4" />
                Publish Live
              </button>
            </div>
          </footer>
        </div>
      )}
    </div>
  );
}
