'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
    const router = useRouter();

    useEffect(() => {
        // 1. Automatické přesměrování na /tv hned po startu
        router.replace('/tv');

        // 2. Nastavení intervalu na 3 minuty (180 000 milisekund)
        // Toto vynutí tvrdý refresh celého prohlížeče, což je pro kiosk ideální,
        // protože to vyčistí paměť a stáhne čerstvý kód z Vercelu.
        const refreshInterval = setInterval(() => {
            window.location.reload();
        }, 720000);

        // Vyčištění intervalu při opuštění komponenty
        return () => clearInterval(refreshInterval);
    }, [router]);

    return (
        <main style={{ background: 'black', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ color: '#ff2222', fontSize: '32px' }}>Inicializace systému RychterIS...</div>
        </main>
    );
}
