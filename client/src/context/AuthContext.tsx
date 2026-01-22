'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import { User } from '@/interfaces/User';
import { AuthContextType } from '@/interfaces/AuthContextType';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const res = await api.post('/auth/refresh');
                    const newToken = res.data.token;
                    localStorage.setItem('token', newToken);

                    // In a real app, you'd decode the JWT to get the studentName
                    // For now, let's assume login saves it in localStorage for convenience
                    const storedName = localStorage.getItem('studentName');
                    const storedUsername = localStorage.getItem('username');
                    if (storedName && storedUsername) {
                        setUser({ username: storedUsername, studentName: storedName });
                    }
                } catch (err) {
                    localStorage.removeItem('token');
                    setUser(null);
                }
            }
            setLoading(false);
        };

        checkAuth();
    }, []);

    const login = (token: string, studentName: string, username: string) => {
        localStorage.setItem('token', token);
        localStorage.setItem('studentName', studentName);
        localStorage.setItem('username', username);
        setUser({ username, studentName });
        router.push('/');
    };

    const logout = async () => {
        localStorage.removeItem('token');
        localStorage.removeItem('studentName');
        localStorage.removeItem('username');
        setUser(null);
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
