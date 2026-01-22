'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { LogIn } from 'lucide-react';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await api.post('/auth/login', { username, password });
            login(res.data.token, res.data.studentName, username);
            toast.success(`ברוך הבא, ${res.data.studentName}!`);
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'שגיאה בהתחברות');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 space-y-6">
                <div className="text-center space-y-2">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 text-white rounded-full mb-2">
                        <LogIn size={32} />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">התחברות</h1>
                    <p className="text-gray-500">מסלול טיולים אפקה 2026</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700 block text-right">שם משתמש</label>
                        <input
                            type="text"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-right"
                            placeholder="הכנס שם משתמש"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700 block text-right">סיסמה</label>
                        <input
                            type="password"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-right"
                            placeholder="הכנס סיסמה"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-200"
                    >
                        {isLoading ? 'מתחבר...' : 'התחבר'}
                    </button>
                </form>

                <div className="text-center pt-4 border-t border-gray-100">
                    <p className="text-gray-600">
                        אין לך חשבון?{' '}
                        <Link href="/register" className="text-indigo-600 font-semibold hover:underline">
                            הירשם כאן
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
