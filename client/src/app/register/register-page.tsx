'use client';

import React, { useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UserPlus } from 'lucide-react';

export default function RegisterPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [studentName, setStudentName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await api.post('/auth/register', { username, password, studentName });
            toast.success('נרשמת בהצלחה! עכשיו אפשר להתחבר');
            router.push('/login');
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'שגיאה בהרשמה');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-100 p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 space-y-6">
                <div className="text-center space-y-2">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-600 text-white rounded-full mb-2">
                        <UserPlus size={32} />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">הרשמה</h1>
                    <p className="text-gray-500">הצטרף למסלול טיולים אפקה 2026</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700 block text-right">שם מלא (סטודנט)</label>
                        <input
                            type="text"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all outline-none text-right text-black"
                            placeholder="הכנס את שמך המלא"
                            value={studentName}
                            onChange={(e) => setStudentName(e.target.value)}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700 block text-right">שם משתמש</label>
                        <input
                            type="text"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all outline-none text-right text-black"
                            placeholder="בחר שם משתמש"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700 block text-right">סיסמה</label>
                        <input
                            type="password"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all outline-none text-right text-black"
                            placeholder="בחר סיסמה חזקה"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-200"
                    >
                        {isLoading ? 'נרשם...' : 'הרשם'}
                    </button>
                </form>

                <div className="text-center pt-4 border-t border-gray-100">
                    <p className="text-gray-600">
                        כבר יש לך חשבון?{' '}
                        <Link href="/login" className="text-purple-600 font-semibold hover:underline">
                            התחבר כאן
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
