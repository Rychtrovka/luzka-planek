"use client";

import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { bedPlan } from "@/data/bedPlan";
import Image from "next/image";
import html2canvas from "html2canvas";
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

    if (status === "empty") return "bg-white/55 border-[#d9cdbb]";
    if (status === "partial") return "bg-[#fff5dc]/70 border-[var(--rb-gold)]";
    return "bg-[#f4e2dc]/70 border-[var(--rb-red)]";
  }

  function getBedPdfLabel(bed: { label: string; type: string }) {
    if (bed.type === "double-left" || bed.type === "double-right") {
      return `..${bed.label}`;
    }

    if (bed.type === "extra") {
      return `.${bed.label}`;
    }

    return `.${bed.label}`;
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

  async function exportPdf() {
    const element = document.getElementById("pdf-content");

    if (!element) return;

    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: "#fffdf8",
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pageWidth = 210;
    const margin = 10;
    const width = pageWidth - margin * 2;
    const height = (canvas.height * width) / canvas.width;

    pdf.addImage(imgData, "PNG", margin, margin, width, height);
    pdf.save("luzka.pdf");
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

              <p className="text-sm text-[var(--rb-brown)] mt-2 mb-4">
                Označte prosím lůžka, která budete během pobytu používat.
              </p>

              <button
                  onClick={exportPdf}
                  className="bg-[var(--rb-red)] text-white rounded px-4 py-2 font-semibold"
              >
                Export PDF
              </button>
            </div>
          </header>

          <section className="bg-white/55 rounded-xl p-4 shadow-lg border border-[#d9cdbb] mb-6 max-w-3xl">
            <div className="text-lg font-semibold">
              {firstName} {lastName}
            </div>

            <div className="text-neutral-600">
              <strong>Termín pobytu:</strong>{" "}
              {new Date(stayFrom).toLocaleDateString("cs-CZ")} –{" "}
              {new Date(stayTo).toLocaleDateString("cs-CZ")}
            </div>
          </section>

          <section className="bg-white/55 rounded-xl p-4 shadow-lg border border-[#d9cdbb] mb-6 max-w-3xl">
            <div className="font-semibold mb-2">
              Vybráno lůžek: {getSelectedCount()}
            </div>

            <div className="flex gap-4 flex-wrap text-sm">
              <div className="flex items-center gap-2">
                <span className="w-8 h-5 border-2 border-neutral-400 rounded bg-white" />
                <span>běžné lůžko (S)</span>
              </div>

              <div className="flex items-center gap-0">
                <span className="w-6 h-5 border-2 border-neutral-400 rounded-l bg-white" />
                <span className="w-6 h-5 border-2 border-neutral-400 rounded-r bg-white -ml-px" />
                <span className="ml-2">dvojlůžko (L+P)</span>
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
                      "rounded-xl p-4 shadow border-2 transition",
                      getRoomClass(room.beds),
                    ].join(" ")}
                >
                  <h2 className="text-xl font-semibold mb-2">{room.name}</h2>

                  <div className="flex gap-2 mb-4">
                    <button
                        onClick={() => selectRoom(room.beds)}
                        className="text-sm bg-[var(--rb-gold)] text-white rounded px-3 py-1 font-semibold"
                    >
                      Vybrat všechna lůžka
                    </button>

                    <button
                        onClick={() => clearRoom(room.beds)}
                        className="text-sm bg-[var(--rb-red)] text-white rounded px-3 py-1 font-semibold"
                    >
                      Vymazat
                    </button>
                  </div>

                    <div className="flex gap-8 items-start">
                        <div className="flex flex-col gap-2">
                            {room.beds
                                .filter(
                                    (bed) =>
                                        bed.type === "double-left" ||
                                        bed.type === "double-right" ||
                                        bed.type === "extra"
                                )
                                .map((bed) => (
                                    <button
                                        key={bed.id}
                                        onClick={() => toggleBed(bed.id)}
                                        className={[
                                            "w-32 h-14 border-2 font-bold transition",

                                            bed.type === "extra"
                                                ? "rounded-lg border-dashed"
                                                : "",

                                            bed.type === "double-left"
                                                ? "rounded-t-lg rounded-b-none border-solid mb-0"
                                                : "",

                                            bed.type === "double-right"
                                                ? "rounded-b-lg rounded-t-none border-solid -mt-[2px]"
                                                : "",

                                            selectedBeds[bed.id]
                                                ? "bg-[var(--rb-red)] text-white border-[var(--rb-red)]"
                                                : "bg-[var(--rb-paper)] text-[var(--rb-brown)] border-[#b9aa95]",
                                        ].join(" ")}
                                    >
                                        {bed.label}
                                    </button>
                                ))}
                        </div>

                        <div className="flex flex-col gap-5">
                            {room.beds
                                .filter((bed) => bed.type === "standard")
                                .map((bed) => (
                                    <button
                                        key={bed.id}
                                        onClick={() => toggleBed(bed.id)}
                                        className={[
                                            "w-32 h-14 border-2 font-bold transition rounded-lg border-solid",

                                            selectedBeds[bed.id]
                                                ? "bg-[var(--rb-red)] text-white border-[var(--rb-red)]"
                                                : "bg-[var(--rb-paper)] text-[var(--rb-brown)] border-[#b9aa95]",
                                        ].join(" ")}
                                    >
                                        {bed.label}
                                    </button>
                                ))}
                        </div>
                    </div>
                </section>
            ))}
          </div>
        </div>

        <div
            id="pdf-content"
            style={{
              position: "fixed",
              left: "-10000px",
              top: 0,
              width: "794px",
              padding: "40px",
              background: "#fffdf8",
              color: "#46352d",
              fontFamily: "var(--font-caladea), serif",
            }}
        >
          <div
              style={{
                borderBottom: "4px solid #9d3d32",
                paddingBottom: "16px",
                marginBottom: "24px",
              }}
          >
            <div
                style={{
                  fontSize: "16px",
                  letterSpacing: "4px",
                  textTransform: "uppercase",
                  color: "#b8903c",
                }}
            >
              Rychtrova bouda Benecko
            </div>

            <div
                style={{
                  fontSize: "40px",
                  fontStyle: "italic",
                  fontWeight: 700,
                  color: "#9d3d32",
                }}
            >
              Požadavek na využití lůžek
            </div>
          </div>

          <div
              style={{
                border: "1px solid #d9cdbb",
                borderRadius: "12px",
                padding: "16px",
                marginBottom: "18px",
                background: "#f7f2e8",
                fontSize: "18px",
              }}
          >
            <div>
              <strong>Host:</strong> {firstName} {lastName}
            </div>
            <div>
              <strong>Termín pobytu:</strong>{" "}
              {new Date(stayFrom).toLocaleDateString("cs-CZ")} –{" "}
              {new Date(stayTo).toLocaleDateString("cs-CZ")}
            </div>
            <div>
              <strong>Vybráno lůžek:</strong> {getSelectedCount()}
            </div>
          </div>

          <div style={{ fontSize: "14px", marginBottom: "16px" }}>
            <strong>Legenda:</strong>

            <span
                style={{
                  display: "inline-block",
                  width: "20px",
                  height: "14px",
                  background: "#9d3d32",
                  marginLeft: "10px",
                  marginRight: "5px",
                  verticalAlign: "middle",
                }}
            />
            použít

            <span
                style={{
                  display: "inline-block",
                  width: "20px",
                  height: "14px",
                  border: "2px solid #9d3d32",
                  background: "white",
                  marginLeft: "15px",
                  marginRight: "5px",
                  verticalAlign: "middle",
                }}
            />
            nepoužít

            <span style={{ marginLeft: "15px" }}>
            S = běžné, L/P = dvojlůžko, R = rozkládací
          </span>
          </div>

          <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
              }}
          >
            {bedPlan.map((room) => (
                <div
                    key={room.name}
                    style={{
                      border: "1px solid #d9cdbb",
                      borderRadius: "10px",
                      overflow: "hidden",
                      background: "white",
                    }}
                >
                  <div
                      style={{
                        background: "#9d3d32",
                        color: "white",
                        padding: "7px 10px",
                        fontSize: "17px",
                        fontWeight: 700,
                      }}
                  >
                    {room.name}
                  </div>

                  <div
                      style={{
                        padding: "10px",
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "6px",
                      }}
                  >
                    {room.beds.map((bed) => {
                      const selected = selectedBeds[bed.id];

                      return (
                          <div
                              key={bed.id}
                              style={{
                                width: "44px",
                                height: "28px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "12px",
                                fontWeight: 700,
                                border:
                                    bed.type === "extra"
                                        ? "2px dashed #9d3d32"
                                        : "2px solid #9d3d32",
                                background: selected ? "#9d3d32" : "#ffffff",
                                color: selected ? "#ffffff" : "#46352d",
                                borderRadius:
                                    bed.type === "double-left"
                                        ? "8px 0 0 8px"
                                        : bed.type === "double-right"
                                            ? "0 8px 8px 0"
                                            : "8px",
                                marginLeft: bed.type === "double-right" ? "-6px" : "0",
                              }}
                          >
                            {getBedPdfLabel(bed)}
                          </div>
                      );
                    })}
                  </div>
                </div>
            ))}
          </div>

          <div
              style={{
                marginTop: "24px",
                paddingTop: "10px",
                borderTop: "1px solid #d9cdbb",
                fontSize: "12px",
                color: "#705f55",
                display: "flex",
                justifyContent: "space-between",
              }}
          >
            <span>Vytvořeno: {new Date().toLocaleString("cs-CZ")}</span>
            <span>RychterIS · Rychtrova bouda</span>
          </div>
        </div>
      </main>
  );
}