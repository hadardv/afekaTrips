'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HomeButton() {
    const pathname = usePathname();

    if (pathname === '/') return null;

    return (
        <Link href="/">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="fixed top-6 left-6 z-40 bg-white p-3 rounded-full shadow-lg border border-gray-100 text-indigo-600 hover:bg-indigo-50 transition-colors flex items-center justify-center group"
                title="Go Home"
            >
                <Home size={24} />
            </motion.div>
        </Link>
    );
}
