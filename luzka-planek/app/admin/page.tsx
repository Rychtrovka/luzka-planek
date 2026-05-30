"use client";

import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";

export default function AdminPage() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [stayFrom, setStayFrom] = useState("");
    const [stayTo, setStayTo] = useState("");

    useEffect(() => {
        const ref = doc(db, "forms", "current");

        return onSnapshot(ref, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.data();

                setFirstName(data.firstName ?? "");
                setLastName(data.lastName ?? "");
                setStayFrom(data.stayFrom ?? "");
                setStayTo(data.stayTo ?? "");
            }
        });
    }, []);

    async function saveHeader() {
        await setDoc(
            doc(db, "forms", "current"),
            {
                firstName,
                lastName,
                stayFrom,
                stayTo,
            },
            { merge: true }
        );

        alert("Záhlaví uloženo.");
    }

    async function clearBeds() {
        const confirmed = confirm("Opravdu vymazat všechna zakliknutá lůžka?");

        if (!confirmed) return;

        await setDoc(
            doc(db, "forms", "current"),
            {
                selectedBeds: {},
            },
            { merge: true }
        );

        alert("Lůžka byla vymazána.");
    }

    return (
        <main className="min-h-screen p-8 bg-neutral-100">
            <h1 className="text-3xl font-bold mb-6">Správa formuláře</h1>

            <section className="bg-white rounded-xl p-6 shadow max-w-xl mb-6">
                <h2 className="text-xl font-semibold mb-4">Záhlaví pobytu</h2>

                <div className="grid gap-4">
                    <label className="grid gap-1">
                        <span className="font-medium">Jméno</span>
                        <input
                            className="border rounded-lg p-2"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                    </label>

                    <label className="grid gap-1">
                        <span className="font-medium">Příjmení</span>
                        <input
                            className="border rounded-lg p-2"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </label>

                    <label className="grid gap-1">
                        <span className="font-medium">Od</span>
                        <input
                            type="date"
                            className="border rounded-lg p-2"
                            value={stayFrom}
                            onChange={(e) => setStayFrom(e.target.value)}
                        />
                    </label>

                    <label className="grid gap-1">
                        <span className="font-medium">Do</span>
                        <input
                            type="date"
                            className="border rounded-lg p-2"
                            value={stayTo}
                            onChange={(e) => setStayTo(e.target.value)}
                        />
                    </label>

                    <button
                        onClick={saveHeader}
                        className="bg-green-700 text-white rounded-lg p-3 font-bold"
                    >
                        Uložit záhlaví
                    </button>
                </div>
            </section>

            <section className="bg-white rounded-xl p-6 shadow max-w-xl">
                <h2 className="text-xl font-semibold mb-4">Zakliknutá lůžka</h2>

                <button
                    onClick={clearBeds}
                    className="bg-red-700 text-white rounded-lg p-3 font-bold"
                >
                    Vymazat všechna lůžka
                </button>
            </section>
        </main>
    );
}