'use client'

import React, { useState } from "react";
import { 
  Cpu, 
  Lightbulb, 
  Building2, 
  ChevronRight, 
  Plus,
  Edit2
} from "lucide-react";
import { clsx } from "clsx";
import { toast } from "sonner";

interface CurriculumItem {
  id: string;
  text: string;
}

interface Program {
  id: string;
  name: string;
  icon: any;
  color: string;
  description: string;
  focusAreas: CurriculumItem[];
  stats: { students: number; faculty: number; labs: number };
}

const INITIAL_PROGRAMS: Program[] = [
  {
    id: "BSCE",
    name: "Bachelor of Science in Civil Engineering",
    icon: Building2,
    color: "bg-blue-600",
    description: "Civil engineering deals with the design, construction and maintenance of the physical and naturally built environments. This field is traditionally broken into several sub-disciplines.",
    focusAreas: [
      { id: "1", text: "Civil Engineering Curriculum: Civil engineering deals with the design, construction and maintenance of physical and naturally built environments, including works such as bridges, roads, canals, dams and buildings." },
      { id: "2", text: "Subdisciplines: Environmental engineering, geotechnical engineering, structural engineering, transportation engineering, municipal or urban engineering, water resources engineering..." }
    ],
    stats: { students: 450, faculty: 22, labs: 8 }
  },
  {
    id: "BSEE",
    name: "Bachelor of Science in Electrical Engineering",
    icon: Lightbulb,
    color: "bg-yellow-500",
    description: "The Electrical Engineering curriculum is designed to develop engineers equipped with knowledge in Mathematics, Natural Sciences, Engineering Sciences, Allied Courses, and Professional Electrical Engineering Courses.",
    focusAreas: [
      { id: "1", text: "Mathematics and Natural Sciences: Builds a strong theoretical and analytical foundation for engineering practice." },
      { id: "2", text: "Engineering and Allied Courses: Develops technical depth and multidisciplinary understanding in electrical engineering contexts." },
      { id: "3", text: "Professional Electrical Engineering Courses: Covers power systems, electrical machines, control systems, instrumentation, and electrical design." }
    ],
    stats: { students: 380, faculty: 18, labs: 6 }
  },
  {
    id: "BSIT",
    name: "Bachelor of Science in Information Technology",
    icon: Cpu,
    color: "bg-purple-600",
    description: "The Bachelor of Science in Information Technology curriculum emphasizes quantitative thinking and communications skills as well as providing a foundation in business environments.",
    focusAreas: [
      { id: "1", text: "Network and Systems Engineering: Infrastructure design, systems integration, and administration." },
      { id: "2", text: "Software Engineering: Software analysis, design, development, and quality assurance." },
      { id: "3", text: "Information Systems Administration: Enterprise systems, data management, and operations support." },
      { id: "4", text: "Telecommunications: Communication systems, connectivity, and network services." }
    ],
    stats: { students: 520, faculty: 25, labs: 12 }
  }
];

export function CurriculumSettings() {
  const [programs, setPrograms] = useState<Program[]>(INITIAL_PROGRAMS);
  const [selectedId, setSelectedId] = useState("BSCE");
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<{ description: string; focusAreas: CurriculumItem[] } | null>(null);

  const selectedProgram = programs.find(p => p.id === selectedId)!;

  const startEditing = () => {
    setDraft({
      description: selectedProgram.description,
      focusAreas: selectedProgram.focusAreas.map((fa) => ({ ...fa })),
    });
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setDraft(null);
    setIsEditing(false);
  };

  const applyEditing = () => {
    if (!draft) return;
    setPrograms(prev =>
      prev.map(p =>
        p.id === selectedId
          ? {
              ...p,
              description: draft.description,
              focusAreas: draft.focusAreas,
            }
          : p
      )
    );
    setIsEditing(false);
    setDraft(null);
    toast.success("Curriculum content applied.");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 h-full">
      {/* Program Selection Sidebar */}
      <div className="lg:col-span-3 space-y-2">
        <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide mb-3">Engineering Programs</label>
        <div className="space-y-1">
          {programs.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                setSelectedId(p.id);
                setIsEditing(false);
                setDraft(null);
              }}
              className={clsx(
                "w-full justify-between text-left",
                "ceit-subtab",
                selectedId === p.id 
                  ? "ceit-subtab-active"
                  : "ceit-subtab-inactive"
              )}
            >
              <div className={clsx("w-8 h-8 rounded-md flex items-center justify-center text-xs font-bold", selectedId === p.id ? "bg-white/20 text-white" : `${p.color} text-white`)}>
                <p.icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-xs font-bold block">
                  {p.id}
                </span>
              </div>
              <ChevronRight className="w-3 h-3 flex-shrink-0 opacity-80" />
            </button>
          ))}
        </div>
      </div>

      {/* Program Editor Area */}
      <div className="lg:col-span-9">
        <div className="ceit-card overflow-hidden flex flex-col h-full">
          {/* Editor Header */}
          <div className="p-4 border-b border-gray-300 flex items-center justify-between bg-gray-100">
            <div className="flex items-center gap-3">
              <div className={clsx("w-10 h-10 flex items-center justify-center text-white text-sm font-bold", selectedProgram.color)}>
                <selectedProgram.icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">{selectedProgram.name}</h3>
                <p className="text-xs text-slate-900 font-medium">Curriculum</p>
              </div>
            </div>
            {!isEditing ? (
              <button 
                onClick={startEditing}
                className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-all uppercase"
              >
                <Edit2 className="w-3.5 h-3.5" />
                Edit Curriculum
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={cancelEditing}
                  className="px-3 py-2 bg-gray-300 text-slate-900 text-xs font-bold hover:bg-gray-400 uppercase"
                >
                  Cancel
                </button>
                <button
                  onClick={applyEditing}
                  className="px-3 py-2 bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 uppercase"
                >
                  Apply
                </button>
              </div>
            )}
          </div>

          {/* Editor Body */}
          <div className="flex-1 p-5 space-y-4 overflow-y-auto">
            <div className="space-y-3">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-900 uppercase">Program Description</label>
                {isEditing && draft ? (
                  <textarea 
                    className="w-full h-20 bg-white border border-gray-300 p-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-900 transition-all resize-none"
                    value={draft.description}
                    onChange={(e) => setDraft((prev) => (prev ? { ...prev, description: e.target.value } : prev))}
                  ></textarea>
                ) : (
                  <div className="w-full min-h-20 bg-gray-50 border border-gray-300 p-2 text-sm text-slate-900">
                    {selectedProgram.description}
                  </div>
                )}
              </div>

              {/* Curriculum Focus Areas */}
              <div className="border-t border-gray-300 pt-3">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-slate-900 uppercase">Curriculum / Focus Areas</h4>
                  {isEditing && (
                    <button
                      onClick={() =>
                        setDraft((prev) =>
                          prev
                            ? {
                                ...prev,
                                focusAreas: [
                                  ...prev.focusAreas,
                                  { id: Date.now().toString(), text: "New focus area" },
                                ],
                              }
                            : prev
                        )
                      }
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded text-xs font-bold hover:bg-slate-800 uppercase"
                    >
                      <Plus className="w-3 h-3" />
                      Add
                    </button>
                  )}
                </div>
                
                <div className="space-y-2">
                  {(isEditing && draft ? draft.focusAreas : selectedProgram.focusAreas).map((area) => (
                    isEditing && draft ? (
                      <div key={area.id} className="flex gap-2">
                        <textarea
                          value={area.text}
                          onChange={(e) =>
                            setDraft((prev) =>
                              prev
                                ? {
                                    ...prev,
                                    focusAreas: prev.focusAreas.map((fa) =>
                                      fa.id === area.id ? { ...fa, text: e.target.value } : fa
                                    ),
                                  }
                                : prev
                            )
                          }
                          className="flex-1 h-14 px-2 py-2 bg-white border border-gray-300 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-slate-900 resize-none"
                        />
                        <button
                          onClick={() =>
                            setDraft((prev) =>
                              prev
                                ? {
                                    ...prev,
                                    focusAreas: prev.focusAreas.filter((fa) => fa.id !== area.id),
                                  }
                                : prev
                            )
                          }
                          className="px-3 py-2 bg-orange-600 text-white rounded text-xs font-bold hover:bg-orange-700 flex-shrink-0 whitespace-nowrap"
                        >
                          ARCHIVE
                        </button>
                      </div>
                    ) : (
                      <div key={area.id} className="flex-1 min-h-14 px-2 py-2 bg-gray-50 border border-gray-300 text-xs text-slate-900">
                        {area.text}
                      </div>
                    )
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
