'use client'

import React from "react";
import { Shield, Lock, Bell, Globe, Save } from "lucide-react";
import { clsx } from "clsx";

export function Settings() {
  return (
    <div className="max-w-4xl space-y-8">
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
        <div className="p-10 border-b border-slate-50 flex items-center justify-between">
           <div>
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">System Configuration</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Core Environment Settings</p>
           </div>
           <button className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 shadow-lg shadow-blue-600/20">
              <Save className="w-4 h-4" />
              Save All Changes
           </button>
        </div>

        <div className="p-10 space-y-12">
           <section className="space-y-6">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                 <Globe className="w-3 h-3 text-blue-500" />
                 Global Settings
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                    <label className="text-[10px] font-black text-slate-500 uppercase block mb-3">Portal Name</label>
                    <input type="text" defaultValue="University Engineering Admin" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500" />
                 </div>
                 <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                    <label className="text-[10px] font-black text-slate-500 uppercase block mb-3">Timezone</label>
                    <select className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500">
                       <option>Philippine Standard Time (GMT+8)</option>
                       <option>UTC (Coordinated Universal Time)</option>
                    </select>
                 </div>
              </div>
           </section>

           <section className="space-y-6">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                 <Shield className="w-3 h-3 text-orange-500" />
                 Security & Privacy
              </h4>
              <div className="space-y-4">
                 {[
                   { label: "Enable 2FA for all Admins", desc: "Requires a secondary authentication factor.", enabled: true },
                   { label: "Public Registration", desc: "Allow students to register via the public portal.", enabled: false },
                   { label: "IP Whitelisting", desc: "Restrict dashboard access to specific university IPs.", enabled: true },
                 ].map((item, idx) => (
                   <div key={idx} className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100">
                      <div>
                         <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{item.label}</p>
                         <p className="text-xs font-medium text-slate-500">{item.desc}</p>
                      </div>
                      <div className={clsx(
                        "w-12 h-6 rounded-full relative cursor-pointer transition-colors",
                        item.enabled ? "bg-blue-600" : "bg-slate-300"
                      )}>
                         <div className={clsx(
                           "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                           item.enabled ? "right-1" : "left-1"
                         )}></div>
                      </div>
                   </div>
                 ))}
              </div>
           </section>
        </div>
      </div>
    </div>
  );
}
