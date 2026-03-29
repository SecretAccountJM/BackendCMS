'use client'

import React, { useMemo, useState, useEffect, useCallback } from "react";
import { Save, Plus, BookText, FileText, Star, Search, Loader2, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "../lib/api";

interface Newsletter {
  id: string;
  title: string;
  volume: string;
  issue: string;
  month_year: string;
  summary: string | null;
  highlights: string | null;
  tags: string | null;
  pages: number;
  cover_url: string | null;
  pdf_url: string | null;
  flipbook_url: string | null;
  is_latest: number;
  created_at: string;
  updated_at: string;
}

interface DraftNewsletter {
  title: string;
  volume: string;
  issue: string;
  month_year: string;
  summary: string;
  highlights: string;
  tags: string;
  pages: number;
  cover_url: string;
  pdf_url: string;
  flipbook_url: string;
  is_latest: number;
}

export function NewsletterSettings() {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState<DraftNewsletter | null>(null);
  const [editFields, setEditFields] = useState<Record<string, Partial<Newsletter>>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [volumeFilter, setVolumeFilter] = useState("All");
  const [uploadingPdf, setUploadingPdf] = useState<string | null>(null);

  const fetchNewsletters = useCallback(async () => {
    try {
      const data = await apiFetch<Newsletter[]>("/newsletters/");
      setNewsletters(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNewsletters();
  }, [fetchNewsletters]);

  const latestIssue = newsletters.find((n) => n.is_latest === 1);
  const pastIssues = newsletters.filter((n) => n.is_latest !== 1);

  const getEditValue = (id: string, field: keyof Newsletter, original: any) => {
    return editFields[id]?.[field] ?? original;
  };

  const setEditValue = (id: string, field: keyof Newsletter, value: any) => {
    setEditFields((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const handleSave = async (id: string) => {
    const changes = editFields[id];
    if (!changes || Object.keys(changes).length === 0) {
      toast.info("No changes to save.");
      return;
    }
    setSaving(id);
    try {
      await apiFetch(`/newsletters/${id}`, {
        method: "PUT",
        body: JSON.stringify(changes),
      });
      toast.success("Newsletter updated.");
      setEditFields((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      await fetchNewsletters();
    } catch (err: any) {
      toast.error(`Failed to save: ${err.message}`);
    } finally {
      setSaving(null);
    }
  };

  const handleCreate = async () => {
    if (!draft) return;
    if (!draft.title.trim() || !draft.volume.trim() || !draft.issue.trim() || !draft.month_year.trim()) {
      toast.error("Title, volume, issue, and month/year are required.");
      return;
    }
    setCreating(true);
    try {
      await apiFetch("/newsletters/", {
        method: "POST",
        body: JSON.stringify({
          ...draft,
          summary: draft.summary || null,
          highlights: draft.highlights || null,
          tags: draft.tags || null,
          cover_url: draft.cover_url || null,
          pdf_url: draft.pdf_url || null,
          flipbook_url: draft.flipbook_url || null,
        }),
      });
      toast.success("Newsletter created.");
      setDraft(null);
      await fetchNewsletters();
    } catch (err: any) {
      toast.error(`Failed to create: ${err.message}`);
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    setSaving(id);
    try {
      await apiFetch(`/newsletters/${id}`, { method: "DELETE" });
      toast.success("Newsletter deleted.");
      await fetchNewsletters();
    } catch (err: any) {
      toast.error(`Failed to delete: ${err.message}`);
    } finally {
      setSaving(null);
    }
  };

  const handlePdfUpload = async (id: string, file: File) => {
    setUploadingPdf(id);
    try {
      const token = sessionStorage.getItem("ceit_access_token");
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"}/newsletters/${id}/upload-pdf`,
        {
          method: "POST",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body: formData,
        }
      );
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: "Upload failed" }));
        throw new Error(err.detail);
      }
      toast.success("PDF uploaded to Cloudinary.");
      await fetchNewsletters();
    } catch (err: any) {
      toast.error(`PDF upload failed: ${err.message}`);
    } finally {
      setUploadingPdf(null);
    }
  };

  const volumeOptions = useMemo(() => {
    const uniqueVolumes = Array.from(new Set(pastIssues.map((n) => n.volume.trim()))).filter(Boolean);
    return ["All", ...uniqueVolumes];
  }, [pastIssues]);

  const filteredIssues = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return pastIssues.filter((item) => {
      const matchesVolume = volumeFilter === "All" || item.volume === volumeFilter;
      const matchesQuery =
        !q ||
        item.title.toLowerCase().includes(q) ||
        (item.summary || "").toLowerCase().includes(q) ||
        (item.tags || "").toLowerCase().includes(q);
      return matchesVolume && matchesQuery;
    });
  }, [pastIssues, searchTerm, volumeFilter]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-sm text-red-600">Failed to load newsletters: {error}</p>
          <button
            onClick={() => { setLoading(true); fetchNewsletters(); }}
            className="mt-3 px-4 py-2 bg-slate-900 text-white text-xs font-medium rounded-lg hover:bg-slate-800"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const renderNewsletterForm = (n: Newsletter) => (
    <div key={n.id} className="ceit-card p-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-bold text-slate-900 mb-2 uppercase">Volume</label>
          <input
            type="text"
            value={getEditValue(n.id, "volume", n.volume)}
            onChange={(e) => setEditValue(n.id, "volume", e.target.value)}
            className="w-full px-3 py-2 bg-white border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-900 mb-2 uppercase">Issue</label>
          <input
            type="text"
            value={getEditValue(n.id, "issue", n.issue)}
            onChange={(e) => setEditValue(n.id, "issue", e.target.value)}
            className="w-full px-3 py-2 bg-white border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-slate-900 mb-2 uppercase">Headline</label>
          <input
            type="text"
            value={getEditValue(n.id, "title", n.title)}
            onChange={(e) => setEditValue(n.id, "title", e.target.value)}
            className="w-full px-3 py-2 bg-white border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-900 mb-2 uppercase">Month & Year</label>
          <input
            type="text"
            value={getEditValue(n.id, "month_year", n.month_year)}
            onChange={(e) => setEditValue(n.id, "month_year", e.target.value)}
            className="w-full px-3 py-2 bg-white border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-900 mb-2 uppercase">Pages</label>
          <input
            type="number"
            min={0}
            value={getEditValue(n.id, "pages", n.pages)}
            onChange={(e) => setEditValue(n.id, "pages", Number(e.target.value) || 0)}
            className="w-full px-3 py-2 bg-white border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-slate-900 mb-2 uppercase">Summary</label>
          <textarea
            value={getEditValue(n.id, "summary", n.summary || "")}
            onChange={(e) => setEditValue(n.id, "summary", e.target.value)}
            className="w-full px-3 py-2 bg-white border border-gray-300 text-sm h-20 resize-none focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-slate-900 mb-2 uppercase">Highlights (semicolon-separated)</label>
          <textarea
            value={getEditValue(n.id, "highlights", n.highlights || "")}
            onChange={(e) => setEditValue(n.id, "highlights", e.target.value)}
            className="w-full px-3 py-2 bg-white border border-gray-300 text-sm h-16 resize-none focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-900 mb-2 uppercase">Tags (comma-separated)</label>
          <input
            type="text"
            value={getEditValue(n.id, "tags", n.tags || "")}
            onChange={(e) => setEditValue(n.id, "tags", e.target.value)}
            className="w-full px-3 py-2 bg-white border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-900 mb-2 uppercase">Flipbook URL</label>
          <input
            type="text"
            placeholder="https://online.fliphtml5.com/..."
            value={getEditValue(n.id, "flipbook_url", n.flipbook_url || "")}
            onChange={(e) => setEditValue(n.id, "flipbook_url", e.target.value)}
            className="w-full px-3 py-2 bg-white border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-slate-900 mb-2 uppercase">PDF</label>
          {n.pdf_url ? (
            <div className="flex items-center gap-2">
              <a href={n.pdf_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline truncate flex-1">
                {n.pdf_url}
              </a>
              <label className="flex items-center gap-1 px-3 py-1.5 bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer hover:bg-slate-300 uppercase">
                <Upload className="w-3 h-3" />
                Replace
                <input
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handlePdfUpload(n.id, file);
                  }}
                />
              </label>
            </div>
          ) : (
            <label className={`flex items-center justify-center gap-1.5 px-4 py-2.5 border-2 border-dashed border-gray-300 text-xs font-bold text-gray-500 cursor-pointer hover:border-slate-900 hover:text-slate-900 transition-colors uppercase ${uploadingPdf === n.id ? "opacity-50 pointer-events-none" : ""}`}>
              {uploadingPdf === n.id ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</>
              ) : (
                <><Upload className="w-4 h-4" /> Upload PDF to Cloudinary</>
              )}
              <input
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handlePdfUpload(n.id, file);
                }}
              />
            </label>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-3">
        <button
          onClick={() => handleDelete(n.id)}
          disabled={saving === n.id}
          className="px-3 py-2 bg-red-600 text-white text-xs font-bold hover:bg-red-700 uppercase disabled:opacity-50"
        >
          Delete
        </button>
        <button
          onClick={() => handleSave(n.id)}
          disabled={saving === n.id}
          className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 uppercase disabled:opacity-50"
        >
          {saving === n.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-5">
      <div className="ceit-card p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 uppercase tracking-wide">CEIT Newsletter Manager</h2>
            <p className="text-xs text-slate-600 mt-1">
              Manage newsletter issues. Upload PDFs to Cloudinary for public download.
            </p>
          </div>
          <button
            onClick={() => setDraft({
              title: "",
              volume: "",
              issue: "",
              month_year: "",
              summary: "",
              highlights: "",
              tags: "",
              pages: 0,
              cover_url: "",
              pdf_url: "",
              flipbook_url: "",
              is_latest: 0,
            })}
            disabled={!!draft}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 uppercase disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            Add Issue
          </button>
        </div>
      </div>

      {/* New Issue Draft Form */}
      {draft && (
        <div className="ceit-card p-5 border-2 border-blue-200">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-md bg-blue-600 text-white flex items-center justify-center">
              <Plus className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">New Newsletter Issue</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-900 mb-2 uppercase">Volume</label>
              <input type="text" value={draft.volume} onChange={(e) => setDraft({ ...draft, volume: e.target.value })} placeholder="Vol. 5" className="w-full px-3 py-2 bg-white border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-900 mb-2 uppercase">Issue</label>
              <input type="text" value={draft.issue} onChange={(e) => setDraft({ ...draft, issue: e.target.value })} placeholder="Issue 2" className="w-full px-3 py-2 bg-white border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-900 mb-2 uppercase">Title</label>
              <input type="text" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} placeholder="Newsletter title..." className="w-full px-3 py-2 bg-white border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-900 mb-2 uppercase">Month & Year</label>
              <input type="text" value={draft.month_year} onChange={(e) => setDraft({ ...draft, month_year: e.target.value })} placeholder="February 2026" className="w-full px-3 py-2 bg-white border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-900 mb-2 uppercase">Pages</label>
              <input type="number" min={0} value={draft.pages} onChange={(e) => setDraft({ ...draft, pages: Number(e.target.value) || 0 })} className="w-full px-3 py-2 bg-white border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-900 mb-2 uppercase">Summary</label>
              <textarea value={draft.summary} onChange={(e) => setDraft({ ...draft, summary: e.target.value })} className="w-full px-3 py-2 bg-white border border-gray-300 text-sm h-20 resize-none focus:outline-none focus:ring-2 focus:ring-slate-900" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-900 mb-2 uppercase">Highlights (semicolon-separated)</label>
              <textarea value={draft.highlights} onChange={(e) => setDraft({ ...draft, highlights: e.target.value })} className="w-full px-3 py-2 bg-white border border-gray-300 text-sm h-16 resize-none focus:outline-none focus:ring-2 focus:ring-slate-900" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-900 mb-2 uppercase">Tags (comma-separated)</label>
              <input type="text" value={draft.tags} onChange={(e) => setDraft({ ...draft, tags: e.target.value })} className="w-full px-3 py-2 bg-white border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-900 mb-2 uppercase">Flipbook URL</label>
              <input type="text" value={draft.flipbook_url} onChange={(e) => setDraft({ ...draft, flipbook_url: e.target.value })} placeholder="https://online.fliphtml5.com/..." className="w-full px-3 py-2 bg-white border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" />
            </div>
            <div className="md:col-span-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={draft.is_latest === 1}
                  onChange={(e) => setDraft({ ...draft, is_latest: e.target.checked ? 1 : 0 })}
                  className="rounded border-gray-300"
                />
                <span className="text-xs font-bold text-slate-900 uppercase">Mark as Latest Issue</span>
              </label>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-3">
            <button onClick={() => setDraft(null)} className="px-3 py-2 bg-gray-200 text-gray-700 text-xs font-bold hover:bg-gray-300 uppercase">Cancel</button>
            <button
              onClick={handleCreate}
              disabled={creating}
              className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 uppercase disabled:opacity-50"
            >
              {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Create Issue
            </button>
          </div>
        </div>
      )}

      {/* Latest Issue */}
      {latestIssue && (
        <>
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-orange-600" />
            <h3 className="text-sm font-bold text-slate-900 uppercase">Latest Issue</h3>
          </div>
          {renderNewsletterForm(latestIssue)}
        </>
      )}

      {/* Past Issues with Search/Filter */}
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
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          <div className="ceit-card p-4">
            <h3 className="text-xs font-bold text-slate-900 mb-3 uppercase">Publication Stats</h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Total Issues</span>
                <span className="font-bold text-slate-900">{newsletters.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Past Issues</span>
                <span className="font-bold text-slate-900">{filteredIssues.length}</span>
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
            <h3 className="text-sm font-bold text-slate-900 uppercase">Past Issues</h3>
            <p className="text-xs text-slate-600">{filteredIssues.length} item(s)</p>
          </div>

          {filteredIssues.length === 0 ? (
            <div className="ceit-card p-10 text-center">
              <BookText className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600 font-medium text-sm">No past issues</p>
              <p className="text-xs text-gray-500 mt-1">Add a new issue to get started.</p>
            </div>
          ) : (
            filteredIssues.map(renderNewsletterForm)
          )}
        </div>
      </div>

      <div className="ceit-card-soft p-4 flex items-start gap-2">
        <FileText className="w-4 h-4 text-slate-700 mt-0.5" />
        <p className="text-xs text-slate-700">
          PDFs are uploaded to Cloudinary and served to the public frontend. Flipbook URLs point to FlipHTML5 embeds.
        </p>
      </div>
    </div>
  );
}
