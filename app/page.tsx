export default function Home() {
    return (
        <main style={{
            height: "100vh",
            width: "100vw",
            background: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
        }}>
            <div style={{ textAlign: "center", color: "black" }}>
                <h1>Rychtrovka Kiosk</h1>
                <a href="/tv" style={{
                    padding: "10px 20px",
                    background: "#0070f3",
                    color: "white",
                    borderRadius: "5px",
                    textDecoration: "none"
                }}>
                    Otevřít TV
                </a>
            </div>
        </main>
    )
}
