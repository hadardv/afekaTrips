'use client';
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { Map, History, LogOut, ChevronLeft } from 'lucide-react';
import LandingPage from './landing-page';


export default function HomePage() {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return <LandingPage />;
  }

  return (
    <div className="min-h-screen bg-white">
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            אפקה טיולים 2026
          </h1>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="text-gray-600 hidden sm:block">שלום, <span className="font-semibold text-gray-900">{user.studentName}</span></span>
                <button
                  onClick={logout}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  title="התנתק"
                >
                  <LogOut size={20} />
                </button>
              </>
            ) : (
              <Link href="/login" className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-all">
                התחברות
              </Link>
            )}
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-16 px-4">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-5xl sm:text-7xl font-extrabold text-gray-900 tracking-tight leading-[1.1]">
              תכנן את הטיול<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 animate-gradient">המושלם שלך</span>
            </h2>
            <p className="max-w-2xl mx-auto text-xl text-gray-500 leading-relaxed font-light">
              השתמש בבינה מלאכותית כדי ליצור מסלולים מותאמים אישית, לראות את מזג האוויר המעודכן ולשמור את כל החוויות שלך במקום אחד.
            </p>
          </div>

          {/* Planner Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            <Link
              href="/planner"
              className="group relative overflow-hidden rounded-3xl bg-indigo-600 p-8 text-white transition-all hover:scale-[1.02] hover:shadow-2xl hover:shadow-indigo-200"
            >
              <div className="relative z-10 flex flex-col items-start h-full text-right">
                <div className="p-3 bg-white/20 rounded-2xl mb-6 group-hover:bg-white/30 transition-colors">
                  <Map size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-2">מתכנן מסלולים</h3>
                <p className="text-indigo-100 mb-8 opacity-80">צור מסלול חדש בעזרת AI ותצוגת מפה חיה</p>
                <div className="mt-auto flex items-center gap-2 font-semibold">
                  <span>בוא נתחיל</span>
                  <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                </div>
              </div>
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform"></div>
            </Link>

            {/* History */}
            <Link
              href="/history"
              className="group relative overflow-hidden rounded-3xl bg-gray-50 border border-gray-100 p-8 text-gray-900 transition-all hover:scale-[1.02] hover:bg-white hover:shadow-xl hover:shadow-gray-200"
            >
              <div className="relative z-10 flex flex-col items-start h-full text-right">
                <div className="p-3 bg-indigo-100 text-indigo-600 rounded-2xl mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <History size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-2">היסטוריית טיולים</h3>
                <p className="text-gray-500 mb-8">צפה בכל המסלולים ששמרת ועדכוני מזג אוויר</p>
                <div className="mt-auto flex items-center gap-2 font-semibold text-indigo-600">
                  <span>לכל הטיולים</span>
                  <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-indigo-50 rounded-full blur-3xl group-hover:scale-110 transition-transform"></div>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-50">
        <div className="max-w-5xl mx-auto px-4 text-center text-gray-400 text-sm">
          <p>© 2026 אפקה - פיתוח בסביבת WEB</p>
        </div>
      </footer>
    </div>
  );
}
