'use client'

import React, { useState } from "react";
import { Save, Plus, Newspaper, Megaphone } from "lucide-react";
import { toast } from "sonner";

interface NewsItem {
  id: string;
  title: string;
  category: string;
  summary: string;
  imageUrl: string;
}

const INITIAL_NEWS: NewsItem[] = [
  {
    id: "1",
    title: "Sample News Headline",
    category: "Announcements",
    summary: "Placeholder content for CEIT News. Replace this with your actual post summary.",
    imageUrl: "",
  },
];

const NEWS_CATEGORIES = [
  "Announcements",
  "Events",
  "Achievements",
  "Partnerships",
  "Student Activities",
];

export function NewsSettings() {
  const [items, setItems] = useState<NewsItem[]>(INITIAL_NEWS);

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        title: "New News Item",
        category: "Events",
        summary: "Write a short summary here...",
        imageUrl: "",
      },
    ]);
  };

  const updateItem = (id: string, field: keyof NewsItem, value: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const archiveItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSave = () => {
    toast.success("News placeholders saved (frontend only).");
  };

  return (
    <div className="space-y-5">
      <div className="ceit-card p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 uppercase tracking-wide">News Content Manager</h2>
            <p className="text-xs text-slate-600 mt-1">
              Frontend placeholders only. No backend or database integration.
            </p>
          </div>
          <button
            onClick={addItem}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 uppercase"
          >
            <Plus className="w-4 h-4" />
            Add News
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="ceit-card p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-md bg-slate-900 text-white flex items-center justify-center">
                <Newspaper className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">News Item</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-2 uppercase">Headline</label>
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => updateItem(item.id, "title", e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-2 uppercase">Category</label>
                <select
                  value={item.category}
                  onChange={(e) => updateItem(item.id, "category", e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                >
                  {NEWS_CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-900 mb-2 uppercase">Summary</label>
                <textarea
                  value={item.summary}
                  onChange={(e) => updateItem(item.id, "summary", e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 text-sm h-20 resize-none focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-900 mb-2 uppercase">Image URL (Placeholder)</label>
                <input
                  type="text"
                  placeholder="https://example.com/news-image.jpg"
                  value={item.imageUrl}
                  onChange={(e) => updateItem(item.id, "imageUrl", e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>
            </div>

            <div className="flex justify-end mt-3">
              <button
                onClick={() => archiveItem(item.id)}
                className="px-3 py-2 bg-orange-600 text-white text-xs font-bold hover:bg-orange-700 uppercase"
              >
                Archive
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="ceit-card-soft p-4 flex items-start gap-2">
        <Megaphone className="w-4 h-4 text-slate-700 mt-0.5" />
        <p className="text-xs text-slate-700">
          These fields are placeholders for frontend layout and content flow only.
        </p>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2 bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors text-xs uppercase"
        >
          <Save className="w-4 h-4" />
          Save News Placeholders
        </button>
      </div>
    </div>
  );
}
