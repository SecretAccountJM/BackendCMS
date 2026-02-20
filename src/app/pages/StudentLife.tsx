'use client'

import React, { useState } from "react";
import { 
  Heart, 
  Book, 
  Shield, 
  Settings, 
  Plus, 
  Trash2, 
  MoveUp, 
  MoveDown, 
  ChevronRight,
  Info,
  Save,
  Grid
} from "lucide-react";
import { clsx } from "clsx";
import { toast } from "sonner";

const ICON_OPTIONS = [
  { id: "heart", icon: Heart, name: "Guidance / Heart" },
  { id: "book", icon: Book, name: "Education / Book" },
  { id: "shield", icon: Shield, name: "Security / Shield" },
  { id: "grid", icon: Grid, name: "Department / Grid" },
];

const INITIAL_OJT_STEPS = [
  { id: 1, title: "Company Matching", description: "Select from accredited partner companies." },
  { id: 2, title: "Interview Process", description: "Schedule and attend technical interviews." },
  { id: 3, title: "MOU Signing", description: "Formalize the partnership agreement." },
  { id: 4, title: "Deployment", description: "Start the required hours at the site." },
];

export function StudentLife() {
  const [activeTab, setActiveTab] = useState("OJT");
  const [ojtSteps, setOjtSteps] = useState(INITIAL_OJT_STEPS);
  const [selectedIcon, setSelectedIcon] = useState("heart");

  const addStep = () => {
    const newId = ojtSteps.length > 0 ? Math.max(...ojtSteps.map(s => s.id)) + 1 : 1;
    setOjtSteps([...ojtSteps, { id: newId, title: "New Step", description: "Enter instructions here." }]);
  };

  const removeStep = (id: number) => {
    setOjtSteps(ojtSteps.filter(s => s.id !== id));
  };

  const moveStep = (index: number, direction: "up" | "down") => {
    const newSteps = [...ojtSteps];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex >= 0 && targetIndex < newSteps.length) {
      [newSteps[index], newSteps[targetIndex]] = [newSteps[targetIndex], newSteps[index]];
      setOjtSteps(newSteps);
    }
  };

  const handleSave = () => {
    toast.success(`${activeTab} updates saved successfully!`);
  };

  return (
    <div className="space-y-8">
      {/* Tab Selector */}
      <div className="flex items-center gap-1 bg-white border border-gray-200 p-1 rounded-xl w-fit">
        {["Guidance", "NSTP", "OJT"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={clsx(
              "px-8 py-2.5 rounded-lg text-sm font-bold transition-all",
              activeTab === tab ? "bg-[#0A192F] text-white shadow-lg" : "text-gray-500 hover:bg-gray-50"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Editor */}
        <div className="lg:col-span-8 space-y-8">
          {/* Header Editor */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Settings className="w-5 h-5 text-blue-500" />
                {activeTab} Section Settings
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest">Section Icon</label>
                <div className="grid grid-cols-4 gap-3">
                  {ICON_OPTIONS.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setSelectedIcon(item.id)}
                      className={clsx(
                        "aspect-square flex flex-col items-center justify-center rounded-xl border-2 transition-all group",
                        selectedIcon === item.id 
                          ? "border-blue-600 bg-blue-50 text-blue-600" 
                          : "border-gray-100 bg-gray-50 text-gray-400 hover:border-gray-200"
                      )}
                    >
                      <item.icon className="w-6 h-6 mb-1 group-hover:scale-110 transition-transform" />
                      <span className="text-[10px] font-bold">{item.id.toUpperCase()}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest">Display Status</label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 cursor-pointer bg-green-50 text-green-700 px-4 py-2 rounded-lg border border-green-100 text-sm font-bold">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    Publicly Visible
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Section Intro</label>
              <textarea 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                defaultValue={`This section covers the ${activeTab} requirements and processes for the Engineering Department students.`}
              ></textarea>
            </div>
          </div>

          {/* OJT Process Editor (Conditional) */}
          {activeTab === "OJT" && (
            <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <ChevronRight className="w-5 h-5 text-blue-500" />
                  Process Workflow Steps
                </h3>
                <button 
                  onClick={addStep}
                  className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Step
                </button>
              </div>

              <div className="space-y-4">
                {ojtSteps.map((step, index) => (
                  <div key={step.id} className="flex gap-4 p-4 border border-gray-100 rounded-xl bg-gray-50/50 group">
                    <div className="flex flex-col items-center gap-2 text-gray-300">
                      <button 
                        onClick={() => moveStep(index, "up")}
                        disabled={index === 0}
                        className="hover:text-blue-500 disabled:opacity-30"
                      >
                        <MoveUp className="w-4 h-4" />
                      </button>
                      <span className="text-sm font-bold text-blue-600 bg-blue-100 w-6 h-6 flex items-center justify-center rounded-full">
                        {index + 1}
                      </span>
                      <button 
                        onClick={() => moveStep(index, "down")}
                        disabled={index === ojtSteps.length - 1}
                        className="hover:text-blue-500 disabled:opacity-30"
                      >
                        <MoveDown className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex-1 space-y-3">
                      <input 
                        type="text" 
                        defaultValue={step.title}
                        className="w-full bg-transparent border-none p-0 text-sm font-bold text-gray-900 focus:ring-0"
                        placeholder="Step Title"
                      />
                      <input 
                        type="text" 
                        defaultValue={step.description}
                        className="w-full bg-transparent border-none p-0 text-xs text-gray-500 font-medium focus:ring-0"
                        placeholder="Detailed description..."
                      />
                    </div>

                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => removeStep(step.id)}
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Info & Help Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#0A192F] rounded-2xl p-6 text-white shadow-xl">
            <h4 className="font-bold flex items-center gap-2 mb-4">
              <Info className="w-5 h-5 text-blue-400" />
              Live Preview Tip
            </h4>
            <p className="text-sm text-blue-100/80 leading-relaxed font-medium">
              Changes made here will update the "Student Life" landing page cards. The icons selected will appear in the circular badges on the frontend.
            </p>
            <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10 flex items-center gap-4">
              {React.createElement(ICON_OPTIONS.find(i => i.id === selectedIcon)?.icon || Heart, { className: "w-8 h-8 text-blue-400" })}
              <div>
                <span className="text-xs uppercase tracking-widest text-white/40 font-bold block">Selected Style</span>
                <span className="font-bold">{activeTab} Section</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4 shadow-sm">
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest border-b border-gray-100 pb-3">Actions</h4>
            <button 
              onClick={handleSave}
              className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
            >
              <Save className="w-4 h-4" />
              Save All Changes
            </button>
            <button className="w-full py-3 text-gray-500 text-sm font-bold hover:bg-gray-50 rounded-xl transition-colors">
              Reset to Defaults
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
