'use client'

import React, { useMemo, useState } from "react";
import { Save, Plus, BookText, FileText, Star, Search } from "lucide-react";
import { toast } from "sonner";

interface NewsletterIssue {
  id: string;
  volume: string;
  issue: string;
  title: string;
  monthYear: string;
  views: number;
  pages: number;
  summary: string;
  highlights: string;
  tags: string;
  coverUrl: string;
  pdfUrl: string;
}

interface LatestIssueContent {
  volume: string;
  issue: string;
  title: string;
  monthYear: string;
  views: number;
  pages: number;
  summary: string;
  highlights: string;
  coverUrl: string;
  pdfUrl: string;
}

const INITIAL_LATEST_ISSUE: LatestIssueContent = {
  volume: "Vol. 5",
  issue: "Issue 2",
  title: "Engineering the Future: Innovation at CEIT",
  monthYear: "February 2026",
  views: 1204,
  pages: 24,
  summary:
    "This issue highlights student achievements, faculty milestones, and key CEIT initiatives.",
  highlights:
    "From the Dean's Desk; Regional Quiz Bee; ITlympics Highlights; Industry Partnerships",
  coverUrl: "",
  pdfUrl: "",
};

const INITIAL_PAST_ISSUES: NewsletterIssue[] = [
  {
    id: "1",
    volume: "Vol. 5",
    issue: "Issue 1",
    title: "Foundations: Celebrating CEIT's Growth",
    monthYear: "October 2025",
    views: 987,
    pages: 20,
    summary:
      "The first issue of Volume 5 celebrates enrollment growth, partnerships, and graduate milestones.",
    highlights: "CEIT at 12; Alumni Highlights; Board Exam Stories",
    tags: "Legacy, Growth, Alumni",
    coverUrl: "",
    pdfUrl: "",
  },
  {
    id: "2",
    volume: "Vol. 4",
    issue: "Issue 2",
    title: "Resilience & Renewal: CEIT Post-Pandemic",
    monthYear: "February 2025",
    views: 834,
    pages: 22,
    summary:
      "This issue captures campus transitions, student testimonials, and laboratory upgrades.",
    highlights: "Campus Life; Lab Upgrades; Research Symposium",
    tags: "Campus, Labs, Research",
    coverUrl: "",
    pdfUrl: "",
  },
  {
    id: "3",
    volume: "Vol. 4",
    issue: "Issue 1",
    title: "Digital Horizons: CEIT in the Modern Era",
    monthYear: "October 2024",
    views: 712,
    pages: 18,
    summary:
      "Explores digital tools in CEIT classrooms, new IT labs, and faculty interviews.",
    highlights: "Digital Learning; New IT Lab; Industry Talk",
    tags: "Digital, Education, Technology",
    coverUrl: "",
    pdfUrl: "",
  },
];

export function NewsletterSettings() {
  const [latestIssue, setLatestIssue] = useState<LatestIssueContent>(INITIAL_LATEST_ISSUE);
  const [issues, setIssues] = useState<NewsletterIssue[]>(INITIAL_PAST_ISSUES);
  const [searchTerm, setSearchTerm] = useState("");
  const [volumeFilter, setVolumeFilter] = useState("All");

  const addIssue = () => {
    setIssues((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        volume: "Vol. X",
        issue: "Issue X",
        title: "New Newsletter Issue",
        monthYear: "Month Year",
        views: 0,
        pages: 0,
        summary: "Add issue summary here...",
        highlights: "Add highlights here...",
        tags: "Tag1, Tag2",
        coverUrl: "",
        pdfUrl: "",
      },
    ]);
  };

  const updateIssue = (id: string, field: keyof NewsletterIssue, value: string | number) => {
    setIssues((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const archiveIssue = (id: string) => {
    setIssues((prev) => prev.filter((item) => item.id !== id));
  };

  const volumeOptions = useMemo(() => {
    const uniqueVolumes = Array.from(new Set(issues.map((item) => item.volume.trim()))).filter(Boolean);
    return ["All", ...uniqueVolumes];
  }, [issues]);

  const filteredIssues = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return issues.filter((item) => {
      const matchesVolume = volumeFilter === "All" || item.volume === volumeFilter;
      const matchesQuery =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q) ||
        item.tags.toLowerCase().includes(q);
      return matchesVolume && matchesQuery;
    });
  }, [issues, searchTerm, volumeFilter]);

  const totalViews = filteredIssues.reduce((sum, item) => sum + item.views, 0);

  const handleSave = () => {
    toast.success("Newsletter placeholders saved (frontend only).");
  };

  return (
    <div className="space-y-5">
      <div className="ceit-card p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 uppercase tracking-wide">CEIT Newsletter Manager</h2>
            <p className="text-xs text-slate-600 mt-1">
              Frontend placeholders only. No backend and no database.
            </p>
          </div>
          <button
            onClick={addIssue}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 uppercase"
          >
            <Plus className="w-4 h-4" />
            Add Past Issue
          </button>
        </div>
      </div>

      <div className="ceit-card p-5">
        <div className="flex items-center gap-2 mb-3">
          <Star className="w-4 h-4 text-orange-600" />
          <h3 className="text-sm font-bold text-slate-900 uppercase">Latest Issue</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-900 mb-2 uppercase">Volume</label>
            <input
              type="text"
              value={latestIssue.volume}
              onChange={(e) => setLatestIssue((prev) => ({ ...prev, volume: e.target.value }))}
              className="w-full px-3 py-2 bg-white border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-900 mb-2 uppercase">Issue</label>
            <input
              type="text"
              value={latestIssue.issue}
              onChange={(e) => setLatestIssue((prev) => ({ ...prev, issue: e.target.value }))}
              className="w-full px-3 py-2 bg-white border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-900 mb-2 uppercase">Headline</label>
            <input
              type="text"
              value={latestIssue.title}
              onChange={(e) => setLatestIssue((prev) => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 bg-white border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-900 mb-2 uppercase">Month & Year</label>
            <input
              type="text"
              value={latestIssue.monthYear}
              onChange={(e) => setLatestIssue((prev) => ({ ...prev, monthYear: e.target.value }))}
              className="w-full px-3 py-2 bg-white border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-900 mb-2 uppercase">Views</label>
              <input
                type="number"
                min={0}
                value={latestIssue.views}
                onChange={(e) => setLatestIssue((prev) => ({ ...prev, views: Number(e.target.value) || 0 }))}
                className="w-full px-3 py-2 bg-white border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-900 mb-2 uppercase">Pages</label>
              <input
                type="number"
                min={0}
                value={latestIssue.pages}
                onChange={(e) => setLatestIssue((prev) => ({ ...prev, pages: Number(e.target.value) || 0 }))}
                className="w-full px-3 py-2 bg-white border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-900 mb-2 uppercase">Summary</label>
            <textarea
              value={latestIssue.summary}
              onChange={(e) => setLatestIssue((prev) => ({ ...prev, summary: e.target.value }))}
              className="w-full px-3 py-2 bg-white border border-gray-300 text-sm h-20 resize-none focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-900 mb-2 uppercase">Highlights (comma-separated)</label>
            <textarea
              value={latestIssue.highlights}
              onChange={(e) => setLatestIssue((prev) => ({ ...prev, highlights: e.target.value }))}
              className="w-full px-3 py-2 bg-white border border-gray-300 text-sm h-20 resize-none focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-900 mb-2 uppercase">Cover URL (Placeholder)</label>
            <input
              type="text"
              placeholder="https://example.com/latest-cover.jpg"
              value={latestIssue.coverUrl}
              onChange={(e) => setLatestIssue((prev) => ({ ...prev, coverUrl: e.target.value }))}
              className="w-full px-3 py-2 bg-white border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-900 mb-2 uppercase">PDF URL (Placeholder)</label>
            <input
              type="text"
              placeholder="https://example.com/latest-newsletter.pdf"
              value={latestIssue.pdfUrl}
              onChange={(e) => setLatestIssue((prev) => ({ ...prev, pdfUrl: e.target.value }))}
              className="w-full px-3 py-2 bg-white border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-4 space-y-3">
          <div className="ceit-card p-4">
            <h3 className="text-xs font-bold text-slate-900 mb-2 uppercase">Search Issues</h3>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search newsletter..."
                className="w-full pl-8 pr-3 py-2 bg-white border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
          </div>

          <div className="ceit-card p-4">
            <h3 className="text-xs font-bold text-slate-900 mb-2 uppercase">Filter by Volume</h3>
            <select
              value={volumeFilter}
              onChange={(e) => setVolumeFilter(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
            >
              {volumeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="ceit-card p-4">
            <h3 className="text-xs font-bold text-slate-900 mb-3 uppercase">Publication Stats</h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Past Issues</span>
                <span className="font-bold text-slate-900">{filteredIssues.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Total Views</span>
                <span className="font-bold text-slate-900">{totalViews.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Volumes</span>
                <span className="font-bold text-slate-900">{Math.max(volumeOptions.length - 1, 0)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase">Past Issues (Books)</h3>
            <p className="text-xs text-slate-600">{filteredIssues.length} item(s)</p>
          </div>

          {filteredIssues.map((issue) => (
            <div key={issue.id} className="ceit-card p-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-2 uppercase">Volume</label>
                  <input
                    type="text"
                    value={issue.volume}
                    onChange={(e) => updateIssue(issue.id, "volume", e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-2 uppercase">Issue</label>
                  <input
                    type="text"
                    value={issue.issue}
                    onChange={(e) => updateIssue(issue.id, "issue", e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-900 mb-2 uppercase">Headline</label>
                  <input
                    type="text"
                    value={issue.title}
                    onChange={(e) => updateIssue(issue.id, "title", e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-2 uppercase">Month & Year</label>
                  <input
                    type="text"
                    value={issue.monthYear}
                    onChange={(e) => updateIssue(issue.id, "monthYear", e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-900 mb-2 uppercase">Views</label>
                    <input
                      type="number"
                      min={0}
                      value={issue.views}
                      onChange={(e) => updateIssue(issue.id, "views", Number(e.target.value) || 0)}
                      className="w-full px-3 py-2 bg-white border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-900 mb-2 uppercase">Pages</label>
                    <input
                      type="number"
                      min={0}
                      value={issue.pages}
                      onChange={(e) => updateIssue(issue.id, "pages", Number(e.target.value) || 0)}
                      className="w-full px-3 py-2 bg-white border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-900 mb-2 uppercase">Summary</label>
                  <textarea
                    value={issue.summary}
                    onChange={(e) => updateIssue(issue.id, "summary", e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 text-sm h-16 resize-none focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-900 mb-2 uppercase">Highlights (comma-separated)</label>
                  <textarea
                    value={issue.highlights}
                    onChange={(e) => updateIssue(issue.id, "highlights", e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 text-sm h-16 resize-none focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-2 uppercase">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={issue.tags}
                    onChange={(e) => updateIssue(issue.id, "tags", e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-2 uppercase">Cover URL (Placeholder)</label>
                  <input
                    type="text"
                    placeholder="https://example.com/issue-cover.jpg"
                    value={issue.coverUrl}
                    onChange={(e) => updateIssue(issue.id, "coverUrl", e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-900 mb-2 uppercase">PDF URL (Placeholder)</label>
                  <input
                    type="text"
                    placeholder="https://example.com/newsletter.pdf"
                    value={issue.pdfUrl}
                    onChange={(e) => updateIssue(issue.id, "pdfUrl", e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
              </div>

              <div className="flex justify-end mt-3">
                <button
                  onClick={() => archiveIssue(issue.id)}
                  className="px-3 py-2 bg-orange-600 text-white text-xs font-bold hover:bg-orange-700 uppercase"
                >
                  Archive
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="ceit-card-soft p-4 flex items-start gap-2">
        <FileText className="w-4 h-4 text-slate-700 mt-0.5" />
        <p className="text-xs text-slate-700">
          This page contains both Latest Issue and Past Issues books as frontend placeholders only.
        </p>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2 bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors text-xs uppercase"
        >
          <Save className="w-4 h-4" />
          Save Newsletter Placeholders
        </button>
      </div>
    </div>
  );
}
