'use client'; // Nutné pro useEffect
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
    const router = useRouter();

    useEffect(() => {
        // Automaticky přesměruje na /tv hned po načtení
        router.replace('/tv');
    }, [router]);

    return (
        <main style={{ background: 'black', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ color: '#333' }}>Načítám kiosek...</div>
        </main>
    );
}