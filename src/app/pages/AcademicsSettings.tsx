'use client'

import React, { useState } from "react";
import { Save, Plus, BookOpen, GraduationCap } from "lucide-react";
import { toast } from "sonner";

interface Requirement {
  id: string;
  text: string;
}

interface AcademicsContent {
  aboutCEIT: {
    description: string;
    bulletPoints: Requirement[];
  };
  coreValues: Requirement[];
  collegeAim: Requirement[];
  academicSupport: Requirement[];
  admission: string;
}

const INITIAL_DATA: AcademicsContent = {
  aboutCEIT: {
    description: "The Engineering and Information Technology programs are designed to:",
    bulletPoints: [
      { id: "1", text: "Acquire full understanding of scientific principles and knowledge in their respective fields" },
      { id: "2", text: "Develop a high level of competence in engineering and IT methods and applications" },
      { id: "3", text: "Communicate effectively and succinctly the results of technical studies (both verbally and in writing)" }
    ]
  },
  coreValues: [
    { id: "1", text: "Academic Excellence" },
    { id: "2", text: "Integrity and Professional Leadership" },
    { id: "3", text: "Scholarly Research" },
    { id: "4", text: "Commitment to Service" },
    { id: "5", text: "Lifelong Learning" }
  ],
  collegeAim: [
    { id: "1", text: "To become the premiere institution of higher learning in Valenzuela City" },
    { id: "2", text: "To produce competent and committed engineers and IT professionals" },
    { id: "3", text: "To contribute to the development of the City of Valenzuela and the nation" }
  ],
  academicSupport: [
    { id: "1", text: "Engineering seminars and review sessions for graduating students" },
    { id: "2", text: "Assessment examinations to monitor board exam readiness" },
    { id: "3", text: "Laboratory facilities for hands-on learning" }
  ],
  admission: `ADMISSION REQUIREMENTS
• Grade 12 students who are expected to graduate at the end of the Academic Year 2025-2026.
• Graduate of Senior High School of the previous Academic Year (2024-2025 and below) who have not enrolled in any colleges or universities.
• College Transferee - the applicant must be an incoming zero year level student at the time of application for the PLV.
• Alternative Learning System (ALS) or Philippine Education Placement Test (PEPT) completers whose eligibility is equivalent to a Senior High School Graduate as attested on the Certificate of Rating.

POLICIES & QUALIFICATIONS
• The applicant must be a registered voter of Valenzuela City.
• One (1) or both biological parents of the applicant must be a registered voter of Valenzuela City.
• The applicant must be a Filipino citizen.
• The applicant must comply with the Academic Residency Requirements. A graduate of any Public or Private School in Valenzuela City is not required.

ACADEMIC RETENTION
A student, in any regular semester and regardless of year level, who meets any of the following failure criteria within a single semester, shall be recommended for shifting to another degree program, subject to academic evaluation:
• Students enrolled in twenty-four (24) units or more; accumulation of twelve (12) units or more of failed courses.
• Students enrolled in fewer than twenty-four (24) units; failure of fifty percent (50%) or more of the total enrolled courses.
• A requirements for an Incomplete (INC) grade must be completed on or before the last day of enrollment of the succeeding semester.

SHIFTING REQUIREMENTS
A student applying for shifting to CEIT programs must meet at the following requirements:
• Must be an incoming second-year student.
• A minimum grade of 2.50 in all General Education, PATHFIT, and NSTP courses.
• Passing results in the shifting examination and interview.
• Availability of slots in the receiving department.`
};

export function AcademicsSettings() {
  const [data, setData] = useState<AcademicsContent>(INITIAL_DATA);
  const [activeTab, setActiveTab] = useState<'about' | 'admission'>('about');
  const [isAdmissionEditing, setIsAdmissionEditing] = useState(false);
  const [admissionDraft, setAdmissionDraft] = useState(INITIAL_DATA.admission);

  const updateListItem = (
    section: "coreValues" | "collegeAim" | "academicSupport",
    id: string,
    text: string
  ) => {
    setData((prev) => ({
      ...prev,
      [section]: prev[section].map((item) => (item.id === id ? { ...item, text } : item)),
    }));
  };

  const addListItem = (section: "coreValues" | "collegeAim" | "academicSupport") => {
    setData((prev) => ({
      ...prev,
      [section]: [...prev[section], { id: Date.now().toString(), text: "New item" }],
    }));
  };

  const removeListItem = (section: "coreValues" | "collegeAim" | "academicSupport", id: string) => {
    setData((prev) => ({
      ...prev,
      [section]: prev[section].filter((item) => item.id !== id),
    }));
  };

  const updateAboutDescription = (value: string) => {
    setData(prev => ({
      ...prev,
      aboutCEIT: { ...prev.aboutCEIT, description: value }
    }));
  };

  const updateBulletPoint = (id: string, text: string) => {
    setData(prev => ({
      ...prev,
      aboutCEIT: {
        ...prev.aboutCEIT,
        bulletPoints: prev.aboutCEIT.bulletPoints.map(bp =>
          bp.id === id ? { ...bp, text } : bp
        )
      }
    }));
  };

  const addBulletPoint = () => {
    setData(prev => ({
      ...prev,
      aboutCEIT: {
        ...prev.aboutCEIT,
        bulletPoints: [
          ...prev.aboutCEIT.bulletPoints,
          { id: Date.now().toString(), text: "New point" }
        ]
      }
    }));
  };

  const removeBulletPoint = (id: string) => {
    setData(prev => ({
      ...prev,
      aboutCEIT: {
        ...prev.aboutCEIT,
        bulletPoints: prev.aboutCEIT.bulletPoints.filter(bp => bp.id !== id)
      }
    }));
  };

  const handleSave = () => {
    localStorage.setItem('academicsContent', JSON.stringify(data));
    toast.success("Academics page content updated successfully!");
  };

  return (
    <div className="space-y-5">
      {/* Tabs */}
      <div className="flex flex-wrap gap-3 pb-1">
        <button
          onClick={() => setActiveTab('about')}
          className={`ceit-subtab ${
            activeTab === 'about'
              ? 'ceit-subtab-active'
              : 'ceit-subtab-inactive'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          About CEIT
        </button>
        <button
          onClick={() => setActiveTab('admission')}
          className={`ceit-subtab ${
            activeTab === 'admission'
              ? 'ceit-subtab-active'
              : 'ceit-subtab-inactive'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          Admission
        </button>
      </div>

      {/* About CEIT Tab */}
      {activeTab === 'about' && (
        <div className="space-y-5">
          {/* About Description */}
          <div className="ceit-card p-5">
            <h2 className="text-base font-bold text-slate-900 mb-3 uppercase">About CEIT Description</h2>
            <textarea
              value={data.aboutCEIT.description}
              onChange={(e) => updateAboutDescription(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 resize-none h-20"
            />
          </div>

          {/* Bullet Points */}
          <div className="ceit-card p-5">
            <h2 className="text-base font-bold text-slate-900 mb-3 uppercase">Key Points</h2>
            <div className="space-y-2 mb-3">
              {data.aboutCEIT.bulletPoints.map((point) => (
                <div key={point.id} className="flex gap-2">
                  <input
                    type="text"
                    value={point.text}
                    onChange={(e) => updateBulletPoint(point.id, e.target.value)}
                    className="flex-1 px-3 py-2 bg-white border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                  <button
                    onClick={() => removeBulletPoint(point.id)}
                    className="px-3 py-2 bg-orange-600 text-white text-sm hover:bg-orange-700 transition-colors font-bold"
                  >
                    ARCHIVE
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={addBulletPoint}
              className="flex items-center gap-2 px-3 py-2 bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 uppercase"
            >
              <Plus className="w-4 h-4" />
              Add Point
            </button>
          </div>

          {/* Core Values */}
          <div className="ceit-card p-5">
            <h2 className="text-base font-bold text-slate-900 mb-3 uppercase">Core Values</h2>
            <div className="space-y-2 mb-3">
              {data.coreValues.map((value) => (
                <div key={value.id} className="flex gap-2">
                  <input
                    type="text"
                    value={value.text}
                    onChange={(e) => updateListItem("coreValues", value.id, e.target.value)}
                    className="flex-1 px-3 py-2 bg-white border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                  <button
                    onClick={() => removeListItem("coreValues", value.id)}
                    className="px-3 py-2 bg-orange-600 text-white text-sm hover:bg-orange-700 transition-colors font-bold"
                  >
                    ARCHIVE
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={() => addListItem("coreValues")}
              className="flex items-center gap-2 px-3 py-2 bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 uppercase"
            >
              <Plus className="w-4 h-4" />
              Add Core Value
            </button>
          </div>

          {/* College Aim */}
          <div className="ceit-card p-5">
            <h2 className="text-base font-bold text-slate-900 mb-3 uppercase">College Aim</h2>
            <div className="space-y-2 mb-3">
              {data.collegeAim.map((aim) => (
                <div key={aim.id} className="flex gap-2">
                  <input
                    type="text"
                    value={aim.text}
                    onChange={(e) => updateListItem("collegeAim", aim.id, e.target.value)}
                    className="flex-1 px-3 py-2 bg-white border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                  <button
                    onClick={() => removeListItem("collegeAim", aim.id)}
                    className="px-3 py-2 bg-orange-600 text-white text-sm hover:bg-orange-700 transition-colors font-bold"
                  >
                    ARCHIVE
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={() => addListItem("collegeAim")}
              className="flex items-center gap-2 px-3 py-2 bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 uppercase"
            >
              <Plus className="w-4 h-4" />
              Add College Aim
            </button>
          </div>

          {/* Academic Support */}
          <div className="ceit-card p-5">
            <h2 className="text-base font-bold text-slate-900 mb-3 uppercase">Academic Support</h2>
            <div className="space-y-2 mb-3">
              {data.academicSupport.map((support) => (
                <div key={support.id} className="flex gap-2">
                  <input
                    type="text"
                    value={support.text}
                    onChange={(e) => updateListItem("academicSupport", support.id, e.target.value)}
                    className="flex-1 px-3 py-2 bg-white border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                  <button
                    onClick={() => removeListItem("academicSupport", support.id)}
                    className="px-3 py-2 bg-orange-600 text-white text-sm hover:bg-orange-700 transition-colors font-bold"
                  >
                    ARCHIVE
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={() => addListItem("academicSupport")}
              className="flex items-center gap-2 px-3 py-2 bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 uppercase"
            >
              <Plus className="w-4 h-4" />
              Add Support Item
            </button>
          </div>
        </div>
      )}

      {/* Admission Tab */}
      {activeTab === 'admission' && (
        <div className="space-y-5">
          <div className="ceit-card p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-slate-900 uppercase">Admission Information</h2>
              {!isAdmissionEditing ? (
                <button
                  onClick={() => {
                    setAdmissionDraft(data.admission);
                    setIsAdmissionEditing(true);
                  }}
                  className="px-3 py-2 bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 uppercase"
                >
                  Edit Admission
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setAdmissionDraft(data.admission);
                      setIsAdmissionEditing(false);
                    }}
                    className="px-3 py-2 bg-gray-300 text-slate-900 text-xs font-bold hover:bg-gray-400 uppercase"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setData((prev) => ({ ...prev, admission: admissionDraft }));
                      setIsAdmissionEditing(false);
                    }}
                    className="px-3 py-2 bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 uppercase"
                  >
                    Apply
                  </button>
                </div>
              )}
            </div>

            {isAdmissionEditing ? (
              <textarea
                value={admissionDraft}
                onChange={(e) => setAdmissionDraft(e.target.value)}
                className="w-full h-80 px-3 py-2 bg-white border border-gray-300 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all resize-vertical"
                placeholder="Enter all admission information here..."
              />
            ) : (
              <pre className="w-full h-80 px-3 py-2 bg-gray-50 border border-gray-300 text-sm text-slate-900 whitespace-pre-wrap overflow-auto">
                {data.admission}
              </pre>
            )}
            <p className="text-xs text-gray-600 mt-2 font-medium">
              {isAdmissionEditing
                ? "You are editing admission content. Click Apply when done."
                : "Admission is view-only. Click Edit Admission to make changes."}
            </p>
          </div>
        </div>
      )}

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2 bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors text-xs uppercase"
        >
          <Save className="w-4 h-4" />
          Save Academics Content
        </button>
      </div>
    </div>
  );
}
