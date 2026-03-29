'use client'

import React, { useState, useEffect, useCallback } from "react";
import { Save, Plus, Newspaper, Megaphone, Loader2, Trash2, Upload, Image as ImageIcon, SendHorizonal, Edit2 } from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "../lib/api";

interface ArticleFromAPI {
  id: string;
  title: string;
  body: string;
  category: string;
  image_path: string | null;
  image_alt_text: string | null;
  status: string;
  like_count: number;
  created_at: string;
  updated_at: string;
  author_first_name: string;
  author_last_name: string;
  author_email: string;
}

interface DraftArticle {
  title: string;
  body: string;
  category: string;
}

const NEWS_CATEGORIES = [
  { label: "Announcements", value: "announcements" },
  { label: "Events", value: "events" },
  { label: "Achievements", value: "achievements" },
  { label: "Partnerships", value: "partnerships" },
];

export function NewsSettings() {
  const [articles, setArticles] = useState<ArticleFromAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [draft, setDraft] = useState<DraftArticle | null>(null);
  const [uploadingImage, setUploadingImage] = useState<string | null>(null);
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<DraftArticle | null>(null);
  const [editSaving, setEditSaving] = useState(false);

  const fetchArticles = useCallback(async () => {
    try {
      const data = await apiFetch<ArticleFromAPI[]>("/articles/my-articles");
      setArticles(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const startNewArticle = () => {
    setDraft({
      title: "",
      body: "",
      category: "announcements",
    });
  };

  const handleCreateArticle = async () => {
    if (!draft) return;
    if (!draft.title.trim() || !draft.body.trim()) {
      toast.error("Title and body are required.");
      return;
    }
    setSaving(true);
    try {
      await apiFetch("/articles/", {
        method: "POST",
        body: JSON.stringify({
          title: draft.title,
          body: draft.body,
          category: draft.category,
        }),
      });
      toast.success("Article created. You can now upload an image.");
      setDraft(null);
      await fetchArticles();
    } catch (err: any) {
      toast.error(`Failed to create article: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (articleId: string, file: File) => {
    setUploadingImage(articleId);
    try {
      const token = sessionStorage.getItem("ceit_access_token");
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"}/articles/${articleId}/upload-image`,
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
      toast.success("Image uploaded.");
      await fetchArticles();
    } catch (err: any) {
      toast.error(`Image upload failed: ${err.message}`);
    } finally {
      setUploadingImage(null);
    }
  };

  const handleSubmitForApproval = async (id: string) => {
    setSubmittingId(id);
    try {
      await apiFetch(`/articles/${id}`, {
        method: "PUT",
        body: JSON.stringify({ status: "pending" }),
      });
      toast.success("Article submitted for approval.");
      await fetchArticles();
    } catch (err: any) {
      toast.error(`Failed to submit: ${err.message}`);
    } finally {
      setSubmittingId(null);
    }
  };

  const handleArchive = async (id: string) => {
    try {
      await apiFetch(`/articles/${id}`, { method: "DELETE" });
      toast.success("Article archived.");
      await fetchArticles();
    } catch (err: any) {
      toast.error(`Failed to archive: ${err.message}`);
    }
  };

  const startEdit = (article: ArticleFromAPI) => {
    setEditingId(article.id);
    setEditForm({
      title: article.title,
      body: article.body,
      category: article.category,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm(null);
  };

  const handleEditSave = async () => {
    if (!editingId || !editForm) return;
    if (!editForm.title.trim() || !editForm.body.trim()) {
      toast.error("Title and body are required.");
      return;
    }
    setEditSaving(true);
    try {
      await apiFetch(`/articles/${editingId}`, {
        method: "PUT",
        body: JSON.stringify({
          title: editForm.title,
          body: editForm.body,
          category: editForm.category,
        }),
      });
      toast.success("Article updated.");
      setEditingId(null);
      setEditForm(null);
      await fetchArticles();
    } catch (err: any) {
      toast.error(`Failed to update article: ${err.message}`);
    } finally {
      setEditSaving(false);
    }
  };

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
          <p className="text-sm text-red-600">Failed to load articles: {error}</p>
          <button
            onClick={() => { setLoading(true); fetchArticles(); }}
            className="mt-3 px-4 py-2 bg-slate-900 text-white text-xs font-medium rounded-lg hover:bg-slate-800"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="ceit-card p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 uppercase tracking-wide">News Content Manager</h2>
            <p className="text-xs text-slate-600 mt-1">
              Create and manage your articles. New articles start as drafts.
            </p>
          </div>
          <button
            onClick={startNewArticle}
            disabled={!!draft}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 uppercase disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            New Article
          </button>
        </div>
      </div>

      {/* New Article Draft Form */}
      {draft && (
        <div className="ceit-card p-5 border-2 border-blue-200">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-md bg-blue-600 text-white flex items-center justify-center">
              <Plus className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">New Article</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-900 mb-2 uppercase">Title</label>
              <input
                type="text"
                value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                placeholder="Enter article title..."
                className="w-full px-3 py-2 bg-white border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-900 mb-2 uppercase">Category</label>
              <select
                value={draft.category}
                onChange={(e) => setDraft({ ...draft, category: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                {NEWS_CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-900 mb-2 uppercase">Body</label>
              <textarea
                value={draft.body}
                onChange={(e) => setDraft({ ...draft, body: e.target.value })}
                placeholder="Write article content..."
                className="w-full px-3 py-2 bg-white border border-gray-300 text-sm h-32 resize-none focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
          </div>

          <p className="text-[10px] text-gray-400 mt-2">You can upload an image after creating the article.</p>

          <div className="flex justify-end gap-2 mt-3">
            <button
              onClick={() => setDraft(null)}
              className="px-3 py-2 bg-gray-200 text-gray-700 text-xs font-bold hover:bg-gray-300 uppercase"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateArticle}
              disabled={saving}
              className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 uppercase disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Create Article
            </button>
          </div>
        </div>
      )}

      {/* Existing Articles List */}
      <div className="space-y-3">
        {articles.length === 0 && !draft ? (
          <div className="ceit-card p-10 text-center">
            <Newspaper className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600 font-medium text-sm">No articles yet</p>
            <p className="text-xs text-gray-500 mt-1">Click &quot;New Article&quot; to create your first article.</p>
          </div>
        ) : (
          articles.map((article) => (
            <div key={article.id} className={`ceit-card p-5 ${editingId === article.id ? "border-2 border-blue-200" : ""}`}>
              {editingId === article.id && editForm ? (
                <>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-md bg-blue-600 text-white flex items-center justify-center">
                      <Edit2 className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900">Edit Article</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-900 mb-2 uppercase">Title</label>
                      <input
                        type="text"
                        value={editForm.title}
                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-900 mb-2 uppercase">Category</label>
                      <select
                        value={editForm.category}
                        onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                      >
                        {NEWS_CATEGORIES.map((cat) => (
                          <option key={cat.value} value={cat.value}>
                            {cat.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-900 mb-2 uppercase">Body</label>
                      <textarea
                        value={editForm.body}
                        onChange={(e) => setEditForm({ ...editForm, body: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-gray-300 text-sm h-32 resize-none focus:outline-none focus:ring-2 focus:ring-slate-900"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 mt-3">
                    <button
                      onClick={cancelEdit}
                      className="px-3 py-2 bg-gray-200 text-gray-700 text-xs font-bold hover:bg-gray-300 uppercase"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleEditSave}
                      disabled={editSaving}
                      className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 uppercase disabled:opacity-50"
                    >
                      {editSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      Save
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-md bg-slate-900 text-white flex items-center justify-center">
                      <Newspaper className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-slate-900 truncate">{article.title}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase ${
                          article.status === "approved" ? "bg-green-100 text-green-700" :
                          article.status === "pending" ? "bg-amber-100 text-amber-700" :
                          article.status === "archived" ? "bg-red-100 text-red-700" :
                          "bg-slate-100 text-slate-700"
                        }`}>
                          {article.status}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          {article.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 line-clamp-3 mb-3">{article.body}</p>

                  {/* Image section */}
                  <div className="mb-3">
                    {article.image_path ? (
                      <div className="flex items-center gap-3">
                        <img
                          src={article.image_path}
                          alt={article.image_alt_text || article.title}
                          className="w-20 h-20 object-cover rounded border border-gray-200"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] text-gray-400 uppercase font-bold">Image uploaded</p>
                          <label className="mt-1 inline-flex items-center gap-1 px-2 py-1 bg-slate-200 text-slate-700 text-[10px] font-bold cursor-pointer hover:bg-slate-300 uppercase rounded">
                            <Upload className="w-3 h-3" /> Replace
                            <input
                              type="file"
                              accept="image/jpeg,image/png,image/webp,image/gif"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleImageUpload(article.id, file);
                              }}
                            />
                          </label>
                        </div>
                      </div>
                    ) : (
                      <label className={`flex items-center justify-center gap-1.5 px-4 py-3 border-2 border-dashed border-gray-300 text-xs font-bold text-gray-500 cursor-pointer hover:border-slate-900 hover:text-slate-900 transition-colors uppercase rounded ${uploadingImage === article.id ? "opacity-50 pointer-events-none" : ""}`}>
                        {uploadingImage === article.id ? (
                          <><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</>
                        ) : (
                          <><ImageIcon className="w-4 h-4" /> Upload Article Image</>
                        )}
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/gif"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageUpload(article.id, file);
                          }}
                        />
                      </label>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-gray-400">
                      Created {new Date(article.created_at).toLocaleDateString()}
                    </span>
                    <div className="flex items-center gap-2">
                      {(article.status === "draft" || article.status === "pending") && (
                        <button
                          onClick={() => startEdit(article)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-slate-700 text-white text-xs font-bold hover:bg-slate-800 uppercase"
                        >
                          <Edit2 className="w-3 h-3" />
                          Edit
                        </button>
                      )}
                      {article.status === "draft" && (
                        <button
                          onClick={() => handleSubmitForApproval(article.id)}
                          disabled={submittingId === article.id}
                          className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 uppercase disabled:opacity-50"
                        >
                          {submittingId === article.id ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <SendHorizonal className="w-3 h-3" />
                          )}
                          Submit for Approval
                        </button>
                      )}
                      {article.status !== "archived" && (
                        <button
                          onClick={() => handleArchive(article.id)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-orange-600 text-white text-xs font-bold hover:bg-orange-700 uppercase"
                        >
                          <Trash2 className="w-3 h-3" />
                          Archive
                        </button>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>

      <div className="ceit-card-soft p-4 flex items-start gap-2">
        <Megaphone className="w-4 h-4 text-slate-700 mt-0.5" />
        <p className="text-xs text-slate-700">
          New articles are created as drafts. Submit them for approval to publish on the public site.
        </p>
      </div>
    </div>
  );
}
