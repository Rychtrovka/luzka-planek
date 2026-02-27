

export type LangCode = "cs" | "en" | "de" | "pl";

export interface Translation {
  adminMessages: string;
  receptionUpdate: string;
  groupLabel: string;
  arrivalLabel: string;
  departureLabel: string;
  weatherTitle: string;
  snowLabel: string;
  today: string;
  tomorrow: string;
  noMessages: string;
  welcomeTitle: string;
  welcomeHint: string;
  menuTitle: string;
  backHint: string;
  langLabel: string;
  videoHint: string;
  tiles: {
    weather: string;
    snow: string;
    info: string;
    story: string;
    guide: string;
    map: string;
    language: string;
    beer: string;
  };
  welcome: {
    groupTitle: string;
    adminTitle: string;
    weatherTitle: string;
    arrival: string;
    departure: string;
    adminHint: string;
    location: string;
  };
  info: {
    title: string;
    // PŘIDÁNO: Definice pro wifi a rychlé odkazy
    wifi?: {
      label: string;
      ssid: string;
      password?: string;
      qrHint?: string;
    };
    quickLinksTitle?: string;
    menuPdfTitle?: string;
    menuPdfSub?: string;
    timetablePdfTitle?: string;
    timetablePdfSub?: string;
    sections: {
      icon?: string;
      heading: string;
      text: string;
    }[];
  };
}

export const i18n: Record<LangCode, Translation> = {
  cs: {
    adminMessages: "Zprávy od správce",
    noMessages: "Zatím žádné zprávy.",
    receptionUpdate: "Aktualizace z recepce",
    groupLabel: "Skupina",
    arrivalLabel: "Příjezd",
    departureLabel: "Odjezd",
    weatherTitle: "Počasí venku",
    snowLabel: "Sníh",
    today: "Dnes",
    tomorrow: "Zítra",
    welcomeTitle: "Vítejte na Rychtrově boudě",
    welcomeHint: "Stiskněte OK na bílém ovladači",
    menuTitle: "Menu",
    backHint: "Zpět = Escape / Backspace",
    langLabel: "Jazyk",
    videoHint: "OK = Play/Pause • ←/→ = ±10s • Back = Zpět",
    tiles: {
      weather: "Počasí",
      snow: "Stav sněhu",
      info: "Užitečné info",
      story: "Příběh Rychtrovy boudy",
      guide: "Průvodce Rychtrovkou",
      map: "Živá mapa skiareálu",
      language: "Jazyk",
      beer: "Pivoměr",
    },
    welcome: {
      groupTitle: "Skupina",
      adminTitle: "Zprávy od správce",
      weatherTitle: "Počasí venku",
      arrival: "Příjezd",
      departure: "Odjezd",
      adminHint: "Aktualizace z recepce",
      location: "Rychtrova bouda"
    },
    info: {
      title: "Užitečné informace",
      wifi: {
        label: "Wi-Fi",
        ssid: "Rychtrovka-Guest",
        password: "rychtrovka123",
        qrHint: "Naskenuj QR kód pro připojení",
      },
      quickLinksTitle: "Rychlé odkazy",
      menuPdfTitle: "Jídelní lístek (PDF)",
      menuPdfSub: "Otevřít aktuální nabídku",
      timetablePdfTitle: "Jízdní řády (PDF)",
      timetablePdfSub: "Autobus / vlak",
      sections: [
        {
          icon: "🛎️",
          heading: "Check-in / Check-out",
          text: "Check-in od 15:00. Check-out do 10:00.",
        },
        {
          icon: "🍽️",
          heading: "Restaurace",
          text: "Snídaně 7:30–9:30\nVečeře 18:00–19:30",
        },
        {
          icon: "🧖",
          heading: "Sauna",
          text: "Otevřeno 16:00–20:00. Rezervace na recepci.",
        },
        {
          icon: "🚑",
          heading: "Nouzové kontakty",
          text: "Recepce: +420 XXX XXX XXX\nHorská služba: 1210",
        },
      ],
    },
  },



  en: {
    adminMessages: "Messages from Admin",
    noMessages: "No messages yet.",
    receptionUpdate: "Updated from reception",
    groupLabel: "Group",
    arrivalLabel: "Arrival",
    departureLabel: "Departure",
    weatherTitle: "Outdoor Weather",
    snowLabel: "Snow",
    today: "Today",
    tomorrow: "Tomorrow",

    welcomeTitle: "Welcome to Rychtrova bouda",
    welcomeHint: "Press OK on white RC",
    menuTitle: "Menu",
    backHint: "Back = Escape / Backspace",
    langLabel: "Language",
    videoHint: "OK = Play/Pause • ←/→ = ±10s • Back = Back",
    tiles: {
      weather: "Weather",
      snow: "Snow report",
      info: "Useful info",
      story: "Our story",
      guide: "Video guide",
      map: "Live ski map",
      beer: "Beer Meter",
      language: "Language",

    },
    welcome: {
        groupTitle: "Group",
        adminTitle: "Admin Messages",
        weatherTitle: "Outside Weather",
        arrival: "Arrival",
        departure: "Departure",
        adminHint: "Updates from reception",
        location: "Rychtrova bouda"
      },

    info: {
      title: "Useful Information",
      sections: [
        {
          heading: "Check-in / Check-out",
          text: "Check-in from 3:00 PM. Check-out until 10:00 AM.",
        },
        {
          heading: "Wi-Fi",
          text: "Network: Rychtrovka-Guest\nPassword: rychtrovka123",
        },
        {
          heading: "Restaurant",
          text: "Breakfast 7:30–9:30 AM\nDinner 6:00–7:30 PM",
        },
        {
          heading: "Sauna",
          text: "Open 4:00–8:00 PM. Reservation required at reception.",
        },
        {
          heading: "Emergency contacts",
          text: "Reception: +420 XXX XXX XXX\nMountain rescue: 1210",
        },
      ],
    },

  },
  de: {
    adminMessages: "Admin-Nachrichten",
    noMessages: "Noch keine Nachrichten.",
    receptionUpdate: "Update von der Rezeption",
    groupLabel: "Gruppe",
    arrivalLabel: "Anreise",
    departureLabel: "Abreise",
    weatherTitle: "Wetter draußen",
    snowLabel: "Schnee",
    today: "Heute",
    tomorrow: "Morgen",

    welcomeTitle: "Willkommen in der Rychtrova Bouda",
    welcomeHint: "OK drücken (weiße Remote)",
    menuTitle: "Menü",
    backHint: "Zurück = Escape / Backspace",
    langLabel: "Sprache",
    videoHint: "OK = Play/Pause • ←/→ = ±10s • Back = Zurück",
    tiles: {
      weather: "Wetter",
      snow: "Schneelage",
      info: "Nützliche Infos",
      story: "Unsere Geschichte",
      guide: "Video-Guide",
      map: "Live-Karte",
      language: "Sprache",
      beer: "Biermesser",
    },
    welcome: {
      groupTitle: "Gruppe",
      adminTitle: "Nachrichten vom Admin",
      weatherTitle: "Wetter draußen",
      arrival: "Anreise",
      departure: "Abreise",
      adminHint: "Aktualisierungen von der Rezeption",
      location: "Rychtrova bouda"
    },

    info: {
      title: "Useful Information",
      sections: [
        {
          heading: "Check-in / Check-out",
          text: "Check-in from 3:00 PM. Check-out until 10:00 AM.",
        },
        {
          heading: "Wi-Fi",
          text: "Network: Rychtrovka-Guest\nPassword: rychtrovka123",
        },
        {
          heading: "Restaurant",
          text: "Breakfast 7:30–9:30 AM\nDinner 6:00–7:30 PM",
        },
        {
          heading: "Sauna",
          text: "Open 4:00–8:00 PM. Reservation required at reception.",
        },
        {
          heading: "Emergency contacts",
          text: "Reception: +420 XXX XXX XXX\nMountain rescue: 1210",
        },
      ],
    },

  },
  pl: {
    adminMessages: "Wiadomości od admina",
    noMessages: "Brak nowych wiadomości.",
    receptionUpdate: "Aktualizacja z recepcji",
    groupLabel: "Grupa",
    arrivalLabel: "Przyjazd",
    departureLabel: "Wyjazd",
    weatherTitle: "Pogoda na zewnątrz",
    snowLabel: "Śnieg",
    today: "Dzisiaj",
    tomorrow: "Jutro",
    welcomeTitle: "Witamy w Rychtrova bouda",
    welcomeHint: "Naciśnij OK (białe RC)",
    menuTitle: "Menu",
    backHint: "Wstecz = Escape / Backspace",
    langLabel: "Język",
    videoHint: "OK = Play/Pause • ←/→ = ±10s • Back = Wstecz",
    tiles: {
      weather: "Pogoda",
      snow: "Warunki śniegowe",
      info: "Przydatne info",
      story: "Historia",
      guide: "Przewodnik wideo",
      map: "Mapa na żywo",
      language: "Język",
      beer: "Piwomierz",
    },
    welcome: {
      groupTitle: "Grupa",
      adminTitle: "Wiadomości od admina",
      weatherTitle: "Pogoda na zewnątrz",
      arrival: "Przyjazd",
      departure: "Wyjazd",
      adminHint: "Aktualizacje z recepcji",
      location: "Rychtrova bouda"
    },

    info: {
      title: "Informacje",
      sections: [
        {
          heading: "Zameldowanie / Wymeldowanie",
          text: "Zameldowanie od 15:00. Wymeldowanie do 10:00.",
        },
        {
          heading: "Wi-Fi",
          text: "Sieć: Rychtrovka-Guest\nHasło: rychtrovka123",
        },
        {
          heading: "Restauracja",
          text: "Śniadanie 7:30–9:30\nKolacja 18:00–19:30",
        },
        {
          heading: "Sauna",
          text: "Otwarte 16:00–20:00. Rezerwacja w recepcji.",
        },
        {
          heading: "Numery alarmowe",
          text: "Recepcja: +420 XXX XXX XXX\nGOPR: 1210",
        },
      ],
    },

  },
};

export const LANG_ORDER: LangCode[] = ["cs", "en", "de", "pl"];

export function nextLang(current: LangCode): LangCode {
  const idx = LANG_ORDER.indexOf(current);
  return LANG_ORDER[(idx + 1) % LANG_ORDER.length];
}
