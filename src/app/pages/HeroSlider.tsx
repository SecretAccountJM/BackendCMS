'use client'

import React, { useState } from "react";
import {
  GripVertical,
  Plus,
  Trash2,
  Monitor,
  Smartphone,
  CheckCircle2,
  Clock,
  Calendar,
  ExternalLink,
  ChevronRight,
  ChevronLeft
} from "lucide-react";
import { motion, Reorder } from "motion/react";

import { toast } from "sonner";
import { clsx } from "clsx";

const INITIAL_SLIDES = [
  {
    id: "1",
    title: "April Joy: Student of the Year",
    subtitle: "Recognition for outstanding academic achievement in Civil Engineering.",
    image: "https://images.unsplash.com/photo-1523240715181-014b9f30d741?auto=format&fit=crop&q=80&w=800",
    status: "active",
    expiresAt: "2026-03-01"
  },
  {
    id: "2",
    title: "Enrollment for SY 2026-2027",
    subtitle: "Official registration is now open for all engineering programs.",
    image: "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=800",
    status: "active",
    expiresAt: "2026-04-15"
  },
  {
    id: "3",
    title: "New Research Lab Opening",
    subtitle: "Modern facilities for innovation in Electronics and IT.",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800",
    status: "active",
    expiresAt: "2026-02-28"
  }
];

export function HeroSlider() {
  const [items, setItems] = useState(INITIAL_SLIDES);
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");

  const handlePublish = () => {
    toast.success("Carousel configuration published successfully!");
  };

  return (
    <div className="space-y-12">
      {/* Visual Horizontal Stage */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-orange-500 flex items-center justify-center text-white text-[10px]">C</span>
              Active Carousel Stage
            </h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 italic">Drag cards to reorder slides live</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50">
              <Calendar className="w-4 h-4" />
              Schedule All
            </button>
            <button className="flex items-center gap-2 px-6 py-2.5 bg-[#0A192F] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#112240] shadow-lg shadow-blue-900/10">
              <Plus className="w-4 h-4" />
              New Slide
            </button>
          </div>
        </div>

        <div className="relative">
          <Reorder.Group axis="x" values={items} onReorder={setItems} className="flex gap-6 pb-8 overflow-x-auto snap-x px-2">
            {items.map((item) => (
              <Reorder.Item
                key={item.id}
                value={item}
                className="shrink-0 w-[420px] snap-start"
              >
                <div className="bg-white border-2 border-slate-100 rounded-[2.5rem] overflow-hidden shadow-xl shadow-slate-200/50 hover:border-blue-500 transition-all group flex flex-col h-full relative">
                  {/* Drag Handle Overlay */}
                  <div className="absolute top-6 left-6 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-white/90 backdrop-blur p-2 rounded-xl shadow-sm cursor-grab active:cursor-grabbing text-slate-400 hover:text-blue-500">
                      <GripVertical className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Expiration Timer Badge */}
                  <div className="absolute top-6 right-6 z-10">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-full text-white">
                      <Clock className="w-3 h-3 text-orange-500" />
                      <span className="text-[9px] font-black uppercase tracking-widest">Exp: {item.expiresAt}</span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="aspect-[16/10] overflow-hidden">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  </div>

                  <div className="p-8 flex-1 flex flex-col">
                    <div className="flex-1">
                      <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-2 leading-tight line-clamp-2">{item.title}</h4>
                      <p className="text-xs font-medium text-slate-500 line-clamp-2 leading-relaxed">{item.subtitle}</p>
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Live</span>
                      </div>
                      <div className="flex gap-2">
                        <button className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:text-slate-600 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button className="p-2.5 bg-slate-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors">
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Reorder.Item>
            ))}
          </Reorder.Group>

          <div className="absolute top-1/2 -translate-y-1/2 -left-4 z-10">
            <button className="w-10 h-10 rounded-full bg-white border border-slate-100 shadow-xl flex items-center justify-center text-slate-400 hover:text-blue-500 transition-all">
              <ChevronLeft className="w-6 h-6" />
            </button>
          </div>
          <div className="absolute top-1/2 -translate-y-1/2 -right-4 z-10">
            <button className="w-10 h-10 rounded-full bg-white border border-slate-100 shadow-xl flex items-center justify-center text-slate-400 hover:text-blue-500 transition-all">
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Preview Section */}
      <div className="pt-12 border-t border-slate-100">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">Device Preview</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Check responsiveness before deployment</p>
          </div>
          <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl">
            <button
              onClick={() => setPreviewMode("desktop")}
              className={clsx(
                "flex items-center gap-2 px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                previewMode === "desktop" ? "bg-white shadow-sm text-blue-600" : "text-slate-500 hover:text-slate-700"
              )}
            >
              <Monitor className="w-4 h-4" />
              Desktop
            </button>
            <button
              onClick={() => setPreviewMode("mobile")}
              className={clsx(
                "flex items-center gap-2 px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                previewMode === "mobile" ? "bg-white shadow-sm text-blue-600" : "text-slate-500 hover:text-slate-700"
              )}
            >
              <Smartphone className="w-4 h-4" />
              Mobile
            </button>
          </div>
        </div>

        <div className="flex justify-center">
          <div className={clsx(
            "relative bg-[#0A192F] rounded-[3rem] overflow-hidden shadow-2xl border-[12px] border-slate-900 transition-all duration-500",
            previewMode === "desktop" ? "w-full aspect-video" : "w-[360px] h-[640px]"
          )}>
            <div className="absolute inset-0">
              <img src={items[0].image} alt="Preview" className="w-full h-full object-cover brightness-50" />
              <div className="absolute inset-0 flex flex-col justify-center px-16 text-white">
                <motion.div
                  key={items[0].id}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <h2 className={clsx("font-black uppercase leading-tight tracking-tighter mb-6", previewMode === 'desktop' ? 'text-6xl' : 'text-3xl')}>
                    {items[0].title}
                  </h2>
                  <p className={clsx("font-medium text-white/70 max-w-xl", previewMode === 'desktop' ? 'text-xl' : 'text-sm')}>
                    {items[0].subtitle}
                  </p>
                  <button className="mt-12 px-12 py-5 bg-orange-500 text-white text-xs font-black uppercase tracking-[0.2em] hover:bg-orange-600 transition-all shadow-xl shadow-orange-500/20">
                    Read Story
                  </button>
                </motion.div>
              </div>
            </div>

            {/* Status Bar for mobile preview */}
            {previewMode === "mobile" && (
              <div className="absolute top-0 inset-x-0 h-6 bg-transparent flex justify-between px-6 pt-2">
                <span className="text-[10px] text-white font-bold tracking-widest">9:41</span>
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 border border-white rounded-full"></div>
                  <div className="w-3 h-3 border border-white rounded-full"></div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 flex justify-center">
          <button
            onClick={handlePublish}
            className="px-16 py-5 bg-orange-500 text-white rounded-2xl text-xs font-black uppercase tracking-[0.3em] hover:bg-orange-600 shadow-2xl shadow-orange-500/30 transition-all hover:scale-105 active:scale-95"
          >
            Deploy active stage
          </button>
        </div>
      </div>
    </div>
  );
}
