'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface AdminUser {
    id: number;
    name: string;
    email: string;
    role: string;
}

interface AuthContextType {
    user: AdminUser | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => boolean;
    logout: () => void;
}

// ── 4 Hardcoded Admin Accounts ──────────────────────────────────────────────
const ADMIN_ACCOUNTS = [
    { id: 1, name: 'Dr. John Santos', email: 'dean@ceit.edu', password: 'admin1234', role: 'Dean' },
    { id: 2, name: 'Prof. Maria Reyes', email: 'bseechaiperson@ceit.edu', password: 'admin5678', role: 'Chairperson' },
    { id: 3, name: 'Engr. Carlo Cruz', email: 'bsitchaiperson.edu', password: 'admin9012', role: 'Chairperson' },
    { id: 4, name: 'Ms. Ana Lim', email: 'bscechaiperson', password: 'admin3456', role: 'Chairperson' },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AdminUser | null>(null);

    // Persist login across page refreshes
    useEffect(() => {
        const stored = sessionStorage.getItem('ceit_admin_user');
        if (stored) {
            try { setUser(JSON.parse(stored)); } catch { /* ignore */ }
        }
    }, []);

    const login = (email: string, password: string): boolean => {
        const match = ADMIN_ACCOUNTS.find(
            (a) => a.email.toLowerCase() === email.toLowerCase() && a.password === password
        );
        if (match) {
            const { password: _pw, ...safeUser } = match;
            setUser(safeUser);
            sessionStorage.setItem('ceit_admin_user', JSON.stringify(safeUser));
            return true;
        }
        return false;
    };

    const logout = () => {
        setUser(null);
        sessionStorage.removeItem('ceit_admin_user');
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
    return ctx;
}
