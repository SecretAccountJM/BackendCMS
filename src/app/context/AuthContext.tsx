'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface AdminUser {
    id?: string;
    name?: string;
    email: string;
    role?: string;
    first_name?: string;
    last_name?: string;
    role_name?: string;
}

interface AuthContextType {
    user: AdminUser | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AdminUser | null>(null);

    // Persist login across page refreshes
    useEffect(() => {
        const stored = sessionStorage.getItem('ceit_admin_user');
        const token = sessionStorage.getItem('ceit_access_token');
        if (stored && token) {
            try { setUser(JSON.parse(stored)); } catch { /* ignore */ }
        }
    }, []);

    const login = async (email: string, password: string): Promise<boolean> => {
        try {
            const response = await fetch('http://localhost:8000/api/v1/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                console.error('Login failed:', response.status, errorData);
                return false;
            }

            const data = await response.json();
            
            // Store tokens
            sessionStorage.setItem('ceit_access_token', data.access_token);
            if (data.refresh_token) {
                sessionStorage.setItem('ceit_refresh_token', data.refresh_token);
            }

            // Decode JWT to get user info
            const decoded = JSON.parse(atob(data.access_token.split('.')[1]));
            
            const userData: AdminUser = {
                email,
                first_name: decoded.first_name,
                last_name: decoded.last_name,
                name: `${decoded.first_name} ${decoded.last_name}`,
                role_name: decoded.role_name,
                role: decoded.role_name,
                id: decoded.sub,
            };

            setUser(userData);
            sessionStorage.setItem('ceit_admin_user', JSON.stringify(userData));
            return true;
        } catch (error) {
            console.error('Login error:', error);
            return false;
        }
    };

    const logout = () => {
        setUser(null);
        sessionStorage.removeItem('ceit_admin_user');
        sessionStorage.removeItem('ceit_access_token');
        sessionStorage.removeItem('ceit_refresh_token');
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
