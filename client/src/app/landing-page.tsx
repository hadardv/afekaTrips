'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, ShieldCheck, Zap, ArrowRight } from 'lucide-react';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans">
            {/* Navigation */}
            <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
                            <MapPin size={24} />
                        </div>
                        <span className="text-2xl font-black tracking-tighter text-indigo-600">AFEKA TRIP</span>
                    </div>

                    <div className="flex items-center gap-6">
                        <Link href="/login" className="text-sm font-bold text-gray-500 hover:text-indigo-600 transition-colors">
                            התחברות
                        </Link>
                        <Link href="/register" className="bg-indigo-600 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
                            הצטרפות חינם
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-40 pb-20 px-4">
                <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-sm font-bold mb-8">
                        <ShieldCheck size={16} />
                        <span>פרויקט גמר פיתוח WEB 2026</span>
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-8 leading-[0.9]">
                        הטיול הבא שלך <br />
                        <span className="text-indigo-600">מתחיל כאן.</span>
                    </h1>

                    <p className="max-w-2xl text-xl text-gray-500 mb-12 font-medium leading-relaxed">
                        תכנון מסלולים חכם מבוסס בינה מלאכותית, תחזית מזג אוויר מדויקת וגלריית תמונות מרהיבה - הכל במקום אחד.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link href="/register" className="group bg-indigo-600 text-white px-10 py-5 rounded-2xl text-xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center gap-2">
                            התחל לתכנן עכשיו
                            <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-20 bg-gray-50/50">
                <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="p-8 bg-white rounded-3xl border border-gray-100 shadow-sm">
                        <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                            <Zap size={28} />
                        </div>
                        <h3 className="text-2xl font-bold mb-4">תכנון מבוסס AI</h3>
                        <p className="text-gray-500 font-medium">הזן את היעד, סוג הטיול ומשך הזמן - וה-AI שלנו יבנה לך את המסלול האופטימלי.</p>
                    </div>

                    <div className="p-8 bg-white rounded-3xl border border-gray-100 shadow-sm">
                        <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-6">
                            <ShieldCheck size={28} />
                        </div>
                        <h3 className="text-2xl font-bold mb-4">מפות חיות</h3>
                        <p className="text-gray-500 font-medium">תצוגת מפה אינטראקטיבית עם Leaflet.js המציגה את המסלול המדויק שלך (לא קווים ישרים!).</p>
                    </div>

                    <div className="p-8 bg-white rounded-3xl border border-gray-100 shadow-sm">
                        <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6">
                            <MapPin size={28} />
                        </div>
                        <h3 className="text-2xl font-bold mb-4">ארכיון מסלולים</h3>
                        <p className="text-gray-500 font-medium">שמור את הטיולים שלך, סנן לפי סוג או משך זמן, וצפה בעדכוני מזג אוויר למועד היציאה.</p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 text-center text-gray-400 font-medium text-sm border-t border-gray-100">
                <p>© 2026 אפקה - פיתוח בסביבת WEB</p>
            </footer>
        </div>
    );
}
