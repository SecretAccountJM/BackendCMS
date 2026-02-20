'use client'

import React, { useState } from "react";
// @ts-ignore - Library doesn't have proper types
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import {
  X,
  Info,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
  MoreVertical,
  Link2,
  Trash2,
  Download
} from "lucide-react";

import { clsx } from "clsx";

function ExternalLinkIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M15 3h6v6" /><path d="M10 14 21 3" /><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </svg>
  );
}

const MEDIA_DATA = [
  { id: 1, url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800", alt: "Students in engineering lab", size: "2.4 MB", format: "JPG", optimized: true, usedIn: ["Engineering News #1", "Homepage Slider"] },
  { id: 2, url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600", alt: "Electronic circuit testing", size: "1.8 MB", format: "JPG", optimized: true, usedIn: ["Lab Requirements"] },
  { id: 3, url: "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=1200", alt: "University building facade", size: "4.2 MB", format: "PNG", optimized: false, usedIn: ["About Us"] },
  { id: 4, url: "https://images.unsplash.com/photo-1523240715181-014b9f30d741?auto=format&fit=crop&q=80&w=800", alt: "Group study session", size: "1.2 MB", format: "JPG", optimized: true, usedIn: ["Student Life Overview"] },
  { id: 5, url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=600", alt: "Software development meeting", size: "3.5 MB", format: "JPG", optimized: true, usedIn: ["IT Department News"] },
  { id: 6, url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800", alt: "Server room infrastructure", size: "5.1 MB", format: "JPG", optimized: false, usedIn: ["Network Maintenance Update"] },
  { id: 7, url: "https://images.unsplash.com/photo-1564910443496-5fd2d06847ad?auto=format&fit=crop&q=80&w=600", alt: "Structural design blueprint", size: "0.9 MB", format: "JPG", optimized: true, usedIn: ["CE Curriculum"] },
  { id: 8, url: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=1000", alt: "Industrial robot arm", size: "2.8 MB", format: "JPG", optimized: true, usedIn: ["Robotics Competition"] },
];

export function MediaLibrary() {
  const [selectedImage, setSelectedImage] = useState<typeof MEDIA_DATA[0] | null>(null);

  return (
    <div className="relative flex h-[calc(100vh-180px)] overflow-hidden">
      {/* Main Content Area */}
      <div className={clsx("flex-1 overflow-y-auto transition-all duration-300 pr-4", selectedImage ? "mr-96" : "")}>
        <div className="flex items-center justify-between mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search media assets..."
              className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all"
            />
          </div>
          <div className="flex gap-2">
            <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
              <Filter className="w-4 h-4" />
            </button>
            <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>

        <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3, 1200: 4 }}>
          {/* @ts-ignore - Library doesn't have proper types */}
          <Masonry gutter="20px">
            {MEDIA_DATA.map((image) => (
              <div
                key={image.id}
                onClick={() => setSelectedImage(image)}
                className={clsx(
                  "group relative rounded-2xl overflow-hidden cursor-pointer border-4 transition-all hover:scale-[1.02]",
                  selectedImage?.id === image.id ? "border-blue-500 shadow-xl" : "border-transparent"
                )}
              >
                <img
                  src={image.url}
                  alt={image.alt}
                  className="w-full object-cover h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                  <p className="text-white text-xs font-bold truncate uppercase tracking-wider">{image.alt}</p>
                  <p className="text-white/60 text-[10px] uppercase font-black">{image.format} • {image.size}</p>
                </div>
              </div>
            ))}
          </Masonry>
        </ResponsiveMasonry>
      </div>

      {/* Sidebar Info Pane (Right Slide-out) */}
      <aside
        className={clsx(
          "fixed right-0 top-20 bottom-0 w-96 bg-white border-l border-slate-100 shadow-2xl transition-transform duration-300 z-20 flex flex-col",
          selectedImage ? "translate-x-0" : "translate-x-full"
        )}
      >
        {selectedImage && (
          <>
            <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Asset Details</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Properties & Usage</p>
              </div>
              <button
                onClick={() => setSelectedImage(null)}
                className="p-2 hover:bg-slate-200/50 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              {/* Preview */}
              <div className="aspect-video rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                <img src={selectedImage.url} alt="Preview" className="w-full h-full object-cover" />
              </div>

              {/* Alt Text Input */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                  <Info className="w-3 h-3 text-blue-500" />
                  Alt Text (Accessibility)
                </label>
                <textarea
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none h-24"
                  defaultValue={selectedImage.alt}
                  placeholder="Describe the image content..."
                />
              </div>

              {/* Validation Check */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Optimization Status</label>
                <div className={clsx(
                  "p-4 rounded-2xl flex items-center justify-between border",
                  selectedImage.optimized ? "bg-green-50 border-green-100 text-green-700" : "bg-red-50 border-red-100 text-red-700"
                )}>
                  <div className="flex items-center gap-3">
                    {selectedImage.optimized ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    <div>
                      <p className="text-xs font-black uppercase tracking-tight">{selectedImage.optimized ? "Optimized" : "Large File Size"}</p>
                      <p className="text-[10px] opacity-70 font-bold uppercase">{selectedImage.size} • {selectedImage.format}</p>
                    </div>
                  </div>
                  {!selectedImage.optimized && (
                    <button className="text-[10px] font-black uppercase underline decoration-2 underline-offset-4">Optimize Now</button>
                  )}
                </div>
              </div>

              {/* "Used In" List */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Current Usage</label>
                <div className="space-y-2">
                  {selectedImage.usedIn.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl group hover:bg-white hover:border-blue-100 transition-all">
                      <div className="flex items-center gap-3">
                        <Link2 className="w-3 h-3 text-slate-400" />
                        <span className="text-xs font-bold text-slate-600">{item}</span>
                      </div>
                      <ExternalLinkIcon className="w-3 h-3 text-slate-300 group-hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-all" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Pane Actions */}
            <div className="p-6 border-t border-slate-50 bg-slate-50/30 flex gap-3 shrink-0">
              <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-100 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-colors">
                <Download className="w-4 h-4" />
                Download
              </button>
              <button className="p-3 bg-red-50 text-red-500 border border-red-100 rounded-xl hover:bg-red-100 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
