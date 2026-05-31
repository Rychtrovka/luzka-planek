"use client";

import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { bedPlan } from "@/data/bedPlan";
import Image from "next/image";
import { jsPDF } from "jspdf";

export default function Home() {
  const [selectedBeds, setSelectedBeds] = useState<Record<string, boolean>>({});
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [stayFrom, setStayFrom] = useState("");
  const [stayTo, setStayTo] = useState("");

  useEffect(() => {
    const ref = doc(db, "forms", "current");

    return onSnapshot(ref, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();

        setSelectedBeds(data.selectedBeds ?? {});
        setFirstName(data.firstName ?? "");
        setLastName(data.lastName ?? "");
        setStayFrom(data.stayFrom ?? "");
        setStayTo(data.stayTo ?? "");
      }
    });
  }, []);

  async function toggleBed(id: string) {
    const next = {
      ...selectedBeds,
      [id]: !selectedBeds[id],
    };

    setSelectedBeds(next);

    await setDoc(
        doc(db, "forms", "current"),
        { selectedBeds: next },
        { merge: true }
    );
  }
  function getSelectedCount() {
    return Object.values(selectedBeds).filter(Boolean).length;
  }

  function getRoomStatus(roomBeds: { id: string }[]) {
    const selected = roomBeds.filter((bed) => selectedBeds[bed.id]).length;
    const total = roomBeds.length;

    if (selected === 0) return "empty";
    if (selected === total) return "full";
    return "partial";
  }

  function getRoomClass(roomBeds: { id: string }[]) {
    const status = getRoomStatus(roomBeds);

    if (status === "empty")
      return "bg-[var(--rb-paper)] border-[#d9cdbb]";

    if (status === "partial")
      return "bg-[#fff5dc] border-[var(--rb-gold)]";

    return "bg-[#f4e2dc] border-[var(--rb-red)]";
  }

  async function selectRoom(roomBeds: { id: string }[]) {
    const next = { ...selectedBeds };

    roomBeds.forEach((bed) => {
      next[bed.id] = true;
    });

    setSelectedBeds(next);

    await setDoc(
        doc(db, "forms", "current"),
        { selectedBeds: next },
        { merge: true }
    );
  }

  function exportPdf() {
    const doc = new jsPDF();

    let y = 20;

    doc.setFontSize(20);
    doc.text("RYCHTROVA BOUDA BENECKO", 20, y);

    y += 15;

    doc.setFontSize(14);
    doc.text("Pozadavek na vyuziti luzek", 20, y);

    y += 15;

    doc.text(`${firstName} ${lastName}`, 20, y);

    y += 10;

    doc.text(`Termin: ${stayFrom} - ${stayTo}`, 20, y);

    y += 15;

    bedPlan.forEach((room) => {
      const selected = room.beds.filter(
          (bed) => selectedBeds[bed.id]
      );

      if (selected.length === 0) return;

      doc.setFontSize(13);
      doc.text(room.name, 20, y);

      y += 8;

      doc.setFontSize(11);

      selected.forEach((bed) => {
        doc.text(`• ${bed.label}`, 30, y);
        y += 6;
      });

      y += 4;

      if (y > 260) {
        doc.addPage();
        y = 20;
      }
    });

    y += 10;

    doc.setFontSize(10);

    doc.text(
        `Vytvoreno: ${new Date().toLocaleString("cs-CZ")}`,
        20,
        y
    );

    doc.save("pozadavek-na-luzka.pdf");
  }

  async function clearRoom(roomBeds: { id: string }[]) {
    const next = { ...selectedBeds };

    roomBeds.forEach((bed) => {
      next[bed.id] = false;
    });

    setSelectedBeds(next);

    await setDoc(
        doc(db, "forms", "current"),
        { selectedBeds: next },
        { merge: true }
    );
  }

  return (
      <main

          className="min-h-screen p-8"
          style={{
            backgroundImage: "url('/rychtrovka-bg.png')",
            backgroundSize: "1200px auto",
            backgroundPosition: "left top",
            backgroundRepeat: "no-repeat",
          }}
      >

        <div
            className="fixed inset-0 z-0"
            style={{
              background: "rgba(247,242,232,0.82)",
              pointerEvents: "none",
            }}
        />

        <div className="relative z-10">
        <header className="max-w-6xl mx-auto mb-8 flex items-center gap-5">
          <Image
              src="/logo-rb.png"
              alt="Rychtrova bouda"
              width={96}
              height={96}
              className="rounded-xl"
          />

          <div>
            <div className="text-sm uppercase tracking-[0.25em] text-[var(--rb-gold)] mb-2">
              Rychtrova bouda Benecko
            </div>

            <h1 className="text-5xl italic font-bold text-[var(--rb-red)]">
              Výběr lůžek
            </h1>

            <p className="text-sm text-[var(--rb-brown)] mt-2">
              Označte prosím lůžka, která budete během pobytu používat.
            </p>
            <button
                onClick={exportPdf}
                className="
    bg-[var(--rb-red)]
    text-white
    rounded
    px-4
    py-2
    font-semibold
  "
            >
              Export PDF
            </button>
          </div>
        </header>



          <section className="
  bg-[rgba(255,253,248,0.55)]

  rounded-xl
  p-4
  shadow-lg
  border
  border-[#d9cdbb]
  mb-6
  max-w-3xl
">
          <div className="text-lg font-semibold">
            {firstName} {lastName}
          </div>

          <div className="text-neutral-600">
            Termín pobytu: {stayFrom} – {stayTo}
          </div>
        </section>

          <section className="
  bg-[rgba(255,253,248,0.55)]

  rounded-xl
  p-4
  shadow-lg
  border
  border-[#d9cdbb]
  mb-6
  max-w-3xl
">
          <div className="font-semibold mb-2">
            Vybráno lůžek: {getSelectedCount()}
          </div>

          <div className="flex gap-4 flex-wrap text-sm">
            <div className="flex items-center gap-2">
              <span className="w-8 h-5 border-2 border-neutral-400 rounded bg-white" />
              <span>běžné lůžko (S) </span>
            </div>

            <div className="flex items-center gap-0">
              <span className="w-6 h-5 border-2 border-neutral-400 rounded-l bg-white" />
              <span className="w-6 h-5 border-2 border-neutral-400 rounded-r bg-white -ml-px" />
              <span className="ml-2">dvojlůžko (D1+2)</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-8 h-5 border-2 border-dashed border-neutral-400 rounded bg-white" />
              <span>rozkládací lůžko (R+r)</span>
            </div>
          </div>
        </section>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {bedPlan.map((room) => (
              <section
                  key={room.name}
                  className={[
                    "rounded-xl p-4 shadow border-2 transition bg-white/55",
                    getRoomClass(room.beds),
                  ].join(" ")}
              >
                <h2 className="text-xl font-semibold mb-2">{room.name}</h2>

                <div className="flex gap-2 mb-4">
                  <button
                      onClick={() => selectRoom(room.beds)}
                      className="text-sm
bg-[var(--rb-gold)]
text-white
rounded
px-3
py-1
font-semibold
"
                  >
                    Vybrat všechna lůžka
                  </button>

                  <button
                      onClick={() => clearRoom(room.beds)}
                      className="
text-sm
bg-[var(--rb-red)]
text-white
rounded
px-3
py-1
font-semibold
"
                  >
                    Vymazat
                  </button>
                </div>
                <div className="flex gap-3 flex-wrap items-center">
                  {room.beds.map((bed) => (
                      <button
                          key={bed.id}
                          onClick={() => toggleBed(bed.id)}
                          className={[
                            "w-20 h-14 border-2 font-bold transition",

                            bed.type === "standard"
                                ? "rounded-lg border-solid"
                                : "",

                            bed.type === "extra"
                                ? "rounded-lg border-dashed"
                                : "",

                            bed.type === "double-left"
                                ? "rounded-l-lg rounded-r-none border-solid mr-0"
                                : "",

                            bed.type === "double-right"
                                ? "rounded-r-lg rounded-l-none border-solid -ml-3"
                                : "",

                            selectedBeds[bed.id]
                                ? "bg-[var(--rb-red)] text-white border-[var(--rb-red)]"
                                : "bg-[var(--rb-paper)] text-[var(--rb-brown)] border-[#b9aa95]"
                          ].join(" ")}
                      >
                        {bed.label}
                      </button>
                  ))}
                </div>
              </section>
          ))}
        </div>
        </div>
      </main>
  );
}