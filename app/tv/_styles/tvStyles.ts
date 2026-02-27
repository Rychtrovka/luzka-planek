import { CSSProperties } from "react";

export 
  const styles: Record<string, CSSProperties> = {
  
  canvas: {
    width: 1920,
    height: 1080,
    overflow: "hidden",
    position: "relative",
  },
  
  container: {
    width: "100%",
    height: "100%",
    position: "relative" as const,
    overflow: "hidden",
    fontFamily: "inherit",
   // color: "#cc422D",
    color: "#ff2222",

    // ? background only once here:
    backgroundImage: "url('/media/rychtrovka-illustration.png')",
    backgroundSize: "cover",
    backgroundPosition: "center bottom",
    backgroundRepeat: "no-repeat",
  },

  overlay : {
    position: "absolute" as const,
    inset: 0,
    background:
      "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.45) 40%, rgba(0,0,0,0.75) 100%)",
  },

  content: {
    position: "relative" as const,
    height: "100%",
  },

  center: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: 40,
  },

  page: {
    padding: 60,
  },

  header: {
    fontSize: 40,
    marginBottom: 40,
    textShadow: "0 4px 20px rgba(0,0,0,0.8)",
    color: "#FF2222",
    fontWeight: 900,

  },

  title: {
    fontSize:96,
    fontWeight: 900,
   
    fontStyle: "italic",
    letterSpacing: "0.5px",
    textShadow: "0 4px 20px rgba(0,0,0,0.8)",
  },

  subtitle: {
    fontSize: 22,
    opacity: 0.9,
    marginTop: 14,
    color: "white",
    textShadow: "0 4px 20px rgba(0,0,0,0.8)",
  },

  meta: {
    fontSize: 18,
    opacity: 0.9,
    marginTop: 10,
    color: "white",
    textShadow: "0 4px 20px rgba(0,0,0,0.8)",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 30,
  },

  tile: {      // obrazovka menu
    height:   250,
    flex: 1,
    background: "rgba(20, 20, 25, 0.25)",   // poloprůhledné
    backdropFilter: "blur(3px)",           // rozostření pozadí
    WebkitBackdropFilter: "blur(3px)",     // pro jistotu
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 50,
    fontWeight: 900,
    borderRadius: 20,
    transition: "all 0.2s ease",
    userSelect: "none" as React.CSSProperties["userSelect"],
    border: "1px solid rgba(255,255,255,0.15)",
  },

  focused: {
    //transform: "scale(1.08)",
    border: "4px solid red",
    background: "#FAF9F688",
  },

  videoPage: {
    flex: 1,
    padding: 40,
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    gap: 18,
  },

  videoHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    gap: 20,
  },

  videoTitle: {
    fontSize: 40,
    fontWeight: 900,
    textShadow: "0 4px 20px rgba(0,0,0,0.8)",
  },

  videoHint: {
    fontSize: 18,
    opacity: 0.75,
    textAlign: "right",
    whiteSpace: "nowrap",
    textShadow: "0 4px 20px rgba(0,0,0,0.8)",
  },

  videoWrap: {
    position: "relative", // ? required for progress overlay
    flex: 1,
    borderRadius: 20,
    overflow: "hidden",
    background: "#000",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 18px 40px rgba(0,0,0,0.35)",
  },

  video: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },

  progressOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: 18,
    boxSizing: "border-box",
    background: "linear-gradient(to top, rgba(0,0,0,0.75), rgba(0,0,0,0))",
  },

  progressRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  timeText: {
    fontSize: 18,
    opacity: 0.9,
  },

  progressTrack: {
    height: 8,
    borderRadius: 999,
    background: "rgba(255,255,255,0.25)",
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    borderRadius: 999,
    background: "white",
    width: "0%",
  },
  
  welcomeWrap: {
  height: "100%",
  padding: 60,
  boxSizing: "border-box",
  display: "flex",
  flexDirection: "column",
  gap: 28,
},

  welcomeHeader: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },

  welcomeMetaRow: {
    display: "flex",
    alignItems: "baseline",
    justifyContent: "space-between",
    gap: 20,
  },

  welcomeGrid: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gridTemplateRows: "1fr 1fr",
    gridTemplateAreas: `
    "messages group"
    "messages weather"
  `,
    gap: 24,
  },


  wBox: {   // text uvnitř Skupiny
    borderRadius: 22,
    padding: 26,
    background: "rgba(20, 20, 25, 0.55)", // “glass”
    backdropFilter: "blur(3px)",
    WebkitBackdropFilter: "blur(10px)",
    border: "1px solid rgba(255,255,255,0.14)",
    boxShadow: "0 18px 40px rgba(0,0,0,0.35)",
    minHeight: 240,
    display: "flex",
    flexDirection: "column",
    gap: 14,
     color: ("white"),
  },

  wBoxTitle: {
    fontSize: 45,
    fontWeight:900,
      color: "#ff2222",
    opacity: 0.95,
    letterSpacing: "0.3px",
  },

  wBoxBig: {
    fontSize: 28,
    fontWeight: 700,
  },

  wBoxRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: 16,
    marginTop: 4,
  },

  wBoxLabel: {
    fontSize: 16,
    opacity: 0.7,
  },

  wBoxValue: {
    fontSize: 20,
    fontWeight: 700,
     color: ("white"),
  },

  wBoxMessage: {
    fontSize: 26,
    lineHeight: 1.25,
    fontWeight: 500,
    color: ("yellow"),
  },

  wBoxHint: {
    fontSize: 16,
    opacity: 0.65,
    marginTop: "auto",
  },

  wTempRow: {
    display: "flex",
    alignItems: "baseline",
    justifyContent: "space-between",
    gap: 16,
  },

  wTemp: {
    fontSize: 54,
    fontWeight: 700,
    color: ("white")
  },

  wTempSub: {
    fontSize: 26,
    opacity: 0.9,
  },

  wForecast: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 12,
    marginTop: 6,
  },

  wForecastItem: {
    borderRadius: 16,
    padding: 12,
    background: "rgba(0,0,0,0.25)",
    border: "1px solid rgba(255,255,255,0.10)",
  },

  wForecastDay: {
    fontSize: 16,
    opacity: 0.85,
  },

  wForecastNums: {
    fontSize: 30,
    fontWeight: 900,
    marginTop: 6,
    color: ("blue"),
  },

  wForecastLabel: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 4,
  },
  
  wBoxGroup: {
  gridArea: "group",
},

wBoxMessages: {
  gridArea: "messages",
},

wBoxWeather: {
  gridArea: "weather",
},

 debugBox: {
    position: "absolute",
    bottom: 10,
    left: 10,
    color: "white",
    zIndex: 9999,
    fontSize: 16,
    background: "rgba(0,0,0,0.65)",
    padding: "8px 10px",
    borderRadius: 10,
    lineHeight: 1.25,
    whiteSpace: "pre",
    userSelect: "none",
  },
  msgNotebook: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    overflowY: "auto",
    background:
        "repeating-linear-gradient(to bottom, rgba(255,255,255,0.10) 0px, rgba(255,255,255,0.10) 1px, rgba(0,0,0,0.0) 1px, rgba(0,0,0,0.0) 34px)",
    border: "1px solid rgba(255,255,255,0.10)",
  },

  msgLine: {
    display: "flex",
    gap: 10,
    alignItems: "baseline",
    padding: "6px 0",
  },

  msgBullet: {
    opacity: 0.9,
    fontSize: 20,
    lineHeight: 1,
  },

  msgText: {
    fontSize: 24,
    lineHeight: 1.25,
    fontWeight: 500,
  },

  msgEmpty: {
    fontSize: 22,
    opacity: 0.7,
    paddingTop: 6,
  },
}


