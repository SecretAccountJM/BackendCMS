'use client'

import React, { useState, useEffect, useCallback } from "react";
import { Plus, Edit2, Trash2, Loader2, Save, Users, KeyRound, X } from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "../lib/api";
import { useAuth } from "../context/AuthContext";

interface UserFromAPI {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role_name: string;
  created_at: string;
}

interface NewUserForm {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  role_name: string;
}

interface EditUserForm {
  email: string;
  first_name: string;
  last_name: string;
  role_name: string;
}

const ROLE_OPTIONS = [
  { label: "Super Admin", value: "super_admin" },
  { label: "Author CE", value: "author_ce" },
  { label: "Author EE", value: "author_ee" },
  { label: "Author IT", value: "author_it" },
];

const roleBadgeColor = (role: string) => {
  switch (role) {
    case "super_admin": return "bg-purple-100 text-purple-700";
    case "author_ce": return "bg-blue-100 text-blue-700";
    case "author_ee": return "bg-amber-100 text-amber-700";
    case "author_it": return "bg-green-100 text-green-700";
    default: return "bg-slate-100 text-slate-700";
  }
};

const roleLabelMap: Record<string, string> = {
  super_admin: "Super Admin",
  author_ce: "Author CE",
  author_ee: "Author EE",
  author_it: "Author IT",
};

export function UserManagement() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<UserFromAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Add user
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUser, setNewUser] = useState<NewUserForm>({ email: "", first_name: "", last_name: "", password: "", role_name: "author_it" });
  const [addSaving, setAddSaving] = useState(false);

  // Edit user
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<EditUserForm | null>(null);
  const [editSaving, setEditSaving] = useState(false);

  // Reset password
  const [resetPasswordId, setResetPasswordId] = useState<string | null>(null);
  const [resetPassword, setResetPassword] = useState("");
  const [resetSaving, setResetSaving] = useState(false);

  // Delete confirmation
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      const data = await apiFetch<UserFromAPI[]>("/users/");
      setUsers(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleAddUser = async () => {
    if (!newUser.email.trim() || !newUser.first_name.trim() || !newUser.last_name.trim() || !newUser.password.trim()) {
      toast.error("All fields are required.");
      return;
    }
    if (newUser.password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    setAddSaving(true);
    try {
      await apiFetch("/users/", {
        method: "POST",
        body: JSON.stringify(newUser),
      });
      toast.success("User created successfully.");
      setShowAddForm(false);
      setNewUser({ email: "", first_name: "", last_name: "", password: "", role_name: "author_it" });
      await fetchUsers();
    } catch (err: any) {
      toast.error(`Failed to create user: ${err.message}`);
    } finally {
      setAddSaving(false);
    }
  };

  const startEdit = (user: UserFromAPI) => {
    setEditingId(user.id);
    setEditForm({
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      role_name: user.role_name,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm(null);
  };

  const handleEditSave = async () => {
    if (!editingId || !editForm) return;
    if (!editForm.email.trim() || !editForm.first_name.trim() || !editForm.last_name.trim()) {
      toast.error("Name and email are required.");
      return;
    }
    setEditSaving(true);
    try {
      await apiFetch(`/users/${editingId}`, {
        method: "PUT",
        body: JSON.stringify(editForm),
      });
      toast.success("User updated successfully.");
      cancelEdit();
      await fetchUsers();
    } catch (err: any) {
      toast.error(`Failed to update user: ${err.message}`);
    } finally {
      setEditSaving(false);
    }
  };

  const handleResetPassword = async (userId: string) => {
    if (!resetPassword.trim()) {
      toast.error("Password is required.");
      return;
    }
    if (resetPassword.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    setResetSaving(true);
    try {
      await apiFetch(`/users/${userId}/reset-password`, {
        method: "PUT",
        body: JSON.stringify({ new_password: resetPassword }),
      });
      toast.success("Password reset successfully.");
      setResetPasswordId(null);
      setResetPassword("");
    } catch (err: any) {
      toast.error(`Failed to reset password: ${err.message}`);
    } finally {
      setResetSaving(false);
    }
  };

  const handleDelete = async (userId: string) => {
    setDeleteLoading(true);
    try {
      await apiFetch(`/users/${userId}`, { method: "DELETE" });
      toast.success("User deleted.");
      setDeletingId(null);
      await fetchUsers();
    } catch (err: any) {
      toast.error(`Failed to delete user: ${err.message}`);
    } finally {
      setDeleteLoading(false);
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
          <p className="text-sm text-red-600">Failed to load users: {error}</p>
          <button
            onClick={() => { setLoading(true); fetchUsers(); }}
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
      {/* Header */}
      <div className="ceit-card p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 uppercase tracking-wide">User Management</h2>
            <p className="text-xs text-slate-600 mt-1">
              Manage system users, roles, and credentials.
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            disabled={showAddForm}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 uppercase disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            Add User
          </button>
        </div>
      </div>

      {/* Add User Form */}
      {showAddForm && (
        <div className="ceit-card p-5 border-2 border-blue-200">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-md bg-blue-600 text-white flex items-center justify-center">
              <Plus className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">New User</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-900 mb-2 uppercase">First Name</label>
              <input
                type="text"
                value={newUser.first_name}
                onChange={(e) => setNewUser({ ...newUser, first_name: e.target.value })}
                placeholder="Enter first name..."
                className="w-full px-3 py-2 bg-white border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-900 mb-2 uppercase">Last Name</label>
              <input
                type="text"
                value={newUser.last_name}
                onChange={(e) => setNewUser({ ...newUser, last_name: e.target.value })}
                placeholder="Enter last name..."
                className="w-full px-3 py-2 bg-white border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-900 mb-2 uppercase">Email</label>
              <input
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                placeholder="Enter email..."
                className="w-full px-3 py-2 bg-white border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-900 mb-2 uppercase">Password</label>
              <input
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                placeholder="Enter password..."
                className="w-full px-3 py-2 bg-white border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-900 mb-2 uppercase">Role</label>
              <select
                value={newUser.role_name}
                onChange={(e) => setNewUser({ ...newUser, role_name: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                {ROLE_OPTIONS.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-3">
            <button
              onClick={() => { setShowAddForm(false); setNewUser({ email: "", first_name: "", last_name: "", password: "", role_name: "author_it" }); }}
              className="px-3 py-2 bg-gray-200 text-gray-700 text-xs font-bold hover:bg-gray-300 uppercase"
            >
              Cancel
            </button>
            <button
              onClick={handleAddUser}
              disabled={addSaving}
              className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 uppercase disabled:opacity-50"
            >
              {addSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Create User
            </button>
          </div>
        </div>
      )}

      {/* User Cards */}
      <div className="space-y-3">
        {users.length === 0 && !showAddForm ? (
          <div className="ceit-card p-10 text-center">
            <Users className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600 font-medium text-sm">No users found</p>
            <p className="text-xs text-gray-500 mt-1">Click &quot;Add User&quot; to create the first user.</p>
          </div>
        ) : (
          users.map((user) => (
            <div key={user.id} className={`ceit-card p-5 ${editingId === user.id ? "border-2 border-blue-200" : ""}`}>
              {/* Edit Mode */}
              {editingId === user.id && editForm ? (
                <>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-md bg-blue-600 text-white flex items-center justify-center">
                      <Edit2 className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900">Edit User</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-900 mb-2 uppercase">First Name</label>
                      <input
                        type="text"
                        value={editForm.first_name}
                        onChange={(e) => setEditForm({ ...editForm, first_name: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-900 mb-2 uppercase">Last Name</label>
                      <input
                        type="text"
                        value={editForm.last_name}
                        onChange={(e) => setEditForm({ ...editForm, last_name: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-900 mb-2 uppercase">Email</label>
                      <input
                        type="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-900 mb-2 uppercase">Role</label>
                      <select
                        value={editForm.role_name}
                        onChange={(e) => setEditForm({ ...editForm, role_name: e.target.value })}
                        disabled={editingId === currentUser?.id}
                        title={editingId === currentUser?.id ? "Cannot change your own role" : undefined}
                        className="w-full px-3 py-2 bg-white border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {ROLE_OPTIONS.map((r) => (
                          <option key={r.value} value={r.value}>{r.label}</option>
                        ))}
                      </select>
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
                  {/* Display Mode */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-md bg-slate-900 text-white flex items-center justify-center">
                      <Users className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-slate-900 truncate">
                        {user.first_name} {user.last_name}
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase ${roleBadgeColor(user.role_name)}`}>
                          {roleLabelMap[user.role_name] || user.role_name}
                        </span>
                        <span className="text-[10px] text-gray-400">{user.email}</span>
                      </div>
                    </div>
                  </div>

                  {/* Inline Reset Password */}
                  {resetPasswordId === user.id && (
                    <div className="mb-3 p-3 bg-slate-50 border border-slate-200 rounded">
                      <div className="flex items-center gap-2 mb-2">
                        <KeyRound className="w-3.5 h-3.5 text-slate-600" />
                        <span className="text-xs font-bold text-slate-900 uppercase">Reset Password</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="password"
                          value={resetPassword}
                          onChange={(e) => setResetPassword(e.target.value)}
                          placeholder="Enter new password..."
                          className="flex-1 px-3 py-2 bg-white border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                        />
                        <button
                          onClick={() => handleResetPassword(user.id)}
                          disabled={resetSaving}
                          className="flex items-center gap-1 px-3 py-2 bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 uppercase disabled:opacity-50"
                        >
                          {resetSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                          Save
                        </button>
                        <button
                          onClick={() => { setResetPasswordId(null); setResetPassword(""); }}
                          className="p-2 bg-gray-200 text-gray-700 hover:bg-gray-300 rounded"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Delete Confirmation */}
                  {deletingId === user.id && (
                    <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded">
                      <p className="text-xs text-red-700 font-medium mb-2">Are you sure you want to delete this user? This action cannot be undone.</p>
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setDeletingId(null)}
                          className="px-3 py-1.5 bg-gray-200 text-gray-700 text-xs font-bold hover:bg-gray-300 uppercase"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          disabled={deleteLoading}
                          className="flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white text-xs font-bold hover:bg-red-700 uppercase disabled:opacity-50"
                        >
                          {deleteLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                          Confirm Delete
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-gray-400">
                      Created {new Date(user.created_at).toLocaleDateString()}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => startEdit(user)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-slate-700 text-white text-xs font-bold hover:bg-slate-800 uppercase"
                      >
                        <Edit2 className="w-3 h-3" />
                        Edit
                      </button>
                      <button
                        onClick={() => { setResetPasswordId(user.id); setResetPassword(""); }}
                        className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 uppercase"
                      >
                        <KeyRound className="w-3 h-3" />
                        Reset Password
                      </button>
                      {user.id !== currentUser?.id && (
                        <button
                          onClick={() => setDeletingId(user.id)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white text-xs font-bold hover:bg-red-700 uppercase"
                        >
                          <Trash2 className="w-3 h-3" />
                          Delete
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
    </div>
  );
}
