'use client'

import React, { useState, useEffect, useCallback } from "react";
import { Plus, Edit2, Users, Building2, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "../lib/api";

interface BoardMember {
  id: string;
  name: string;
  position: string;
  photo: string;
}

interface AdminContent {
  boardOfRegents: {
    members: BoardMember[];
  };
  organizationalChart: {
    members: BoardMember[];
  };
}

const INITIAL_DATA: AdminContent = {
  boardOfRegents: {
    members: [
      { id: "1", name: "CITY MAYOR WESLIE T. GATCHALIAN", position: "CHAIRMAN", photo: "" },
      { id: "2", name: "ATTY. DANILO L. CONCEPCION", position: "VICE-CHAIRMAN", photo: "" },
      { id: "3", name: "DR. NEDEÑA C. TORRALBA", position: "PLV PRESIDENT", photo: "" },
      { id: "4", name: "REGENT LORENA C. NATIVIDAD-BORJA", position: "MEMBER", photo: "" },
      { id: "5", name: "REGENT FLORO P. ALEJO", position: "MEMBER", photo: "" },
      { id: "6", name: "REGENT WILFRODO E. CARBAL", position: "MEMBER", photo: "" }
    ]
  },
  organizationalChart: {
    members: [
      { id: "1", name: "Dr. Nedeña C. Torralba", position: "University President", photo: "" },
      { id: "2", name: "Dr. Michville Rivera", position: "Vice President for Academic Affairs", photo: "" },
      { id: "3", name: "Engr. Jordan N. Velasco", position: "Dean, College of CEIT", photo: "" },
      { id: "4", name: "Norie Caunda", position: "Secretary, College of CEIT", photo: "" },
      { id: "5", name: "Engr. Tirao", position: "Civil Engineering Department Chairman", photo: "" },
      { id: "6", name: "Alex Montano", position: "Electrical Engineering Department Coordinator", photo: "" },
      { id: "7", name: "Kenmar Bernardino", position: "Information Technology Department Chairperson", photo: "" }
    ]
  }
};

export function AdministratorSettings() {
  const [data, setData] = useState<AdminContent>(INITIAL_DATA);
  const [activeTab, setActiveTab] = useState<'board' | 'org'>('board');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<BoardMember | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchContent = useCallback(async () => {
    try {
      const res = await apiFetch<{ content: AdminContent }>("/site-content/administration");
      setData(res.content);
    } catch {
      // No saved content yet — use defaults
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchContent(); }, [fetchContent]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await apiFetch("/site-content/administration", {
        method: "PUT",
        body: JSON.stringify({ content: data }),
      });
      toast.success("Administrator content saved!");
    } catch (err: any) {
      toast.error(`Failed to save: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const addMember = (tab: 'board' | 'org') => {
    const newMember: BoardMember = { id: Date.now().toString(), name: "New Member", position: "Position", photo: "" };
    setData(prev => ({
      ...prev,
      [tab === 'board' ? 'boardOfRegents' : 'organizationalChart']: {
        members: [...prev[tab === 'board' ? 'boardOfRegents' : 'organizationalChart'].members, newMember]
      }
    }));
  };

  const removeMember = (tab: 'board' | 'org', id: string) => {
    setData(prev => ({
      ...prev,
      [tab === 'board' ? 'boardOfRegents' : 'organizationalChart']: {
        members: prev[tab === 'board' ? 'boardOfRegents' : 'organizationalChart'].members.filter(m => m.id !== id)
      }
    }));
    toast.success("Member removed!");
  };

  const startEdit = (member: BoardMember) => {
    setEditingId(member.id);
    setEditForm({ ...member });
  };

  const saveEdit = () => {
    if (!editForm) return;
    setData(prev => ({
      ...prev,
      [activeTab === 'board' ? 'boardOfRegents' : 'organizationalChart']: {
        members: prev[activeTab === 'board' ? 'boardOfRegents' : 'organizationalChart'].members.map(m =>
          m.id === editForm.id ? editForm : m
        )
      }
    }));
    setEditingId(null);
    setEditForm(null);
    toast.success("Member updated!");
  };

  const currentMembers = activeTab === 'board' ? data.boardOfRegents.members : data.organizationalChart.members;
  const memberCount = currentMembers.length;

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3 pb-1">
        <button onClick={() => setActiveTab('board')} className={`ceit-subtab ${activeTab === 'board' ? 'ceit-subtab-active' : 'ceit-subtab-inactive'}`}>
          <Users className="w-4 h-4" /> Board of Regents
        </button>
        <button onClick={() => setActiveTab('org')} className={`ceit-subtab ${activeTab === 'org' ? 'ceit-subtab-active' : 'ceit-subtab-inactive'}`}>
          <Building2 className="w-4 h-4" /> Organizational Chart
        </button>
      </div>

      <div className="flex items-center justify-between pt-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">{activeTab === 'board' ? 'Board of Regents' : 'Organizational Chart'}</h2>
          <p className="text-xs text-gray-600 mt-1">{memberCount} {memberCount === 1 ? 'member' : 'members'}</p>
        </div>
        <button onClick={() => addMember(activeTab)} className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded text-xs font-bold hover:bg-slate-800 transition-colors">
          <Plus className="w-4 h-4" /> ADD MEMBER
        </button>
      </div>

      <div className="space-y-3">
        {currentMembers.map((member) => (
          <div key={member.id} className="ceit-card p-4 transition-colors">
            {editingId === member.id && editForm ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-2 uppercase">Name</label>
                  <input type="text" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-2 uppercase">Position</label>
                  <input type="text" value={editForm.position} onChange={(e) => setEditForm({ ...editForm, position: e.target.value })} className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" />
                </div>
                <div className="flex gap-2 justify-end">
                  <button onClick={() => { setEditingId(null); setEditForm(null); }} className="px-4 py-2 bg-gray-300 text-slate-900 rounded text-xs font-bold hover:bg-gray-400 transition-colors">CANCEL</button>
                  <button onClick={saveEdit} className="px-4 py-2 bg-slate-900 text-white rounded text-xs font-bold hover:bg-slate-800 transition-colors">SAVE</button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 font-bold uppercase tracking-wide">{member.position}</p>
                  <p className="text-sm font-bold text-slate-900 mt-1">{member.name}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => startEdit(member)} className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => removeMember(activeTab, member.id)} className="p-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-xs font-bold" title="Remove">REMOVE</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-5 py-2 bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors text-xs uppercase disabled:opacity-50">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
        </button>
      </div>
    </div>
  );
}
