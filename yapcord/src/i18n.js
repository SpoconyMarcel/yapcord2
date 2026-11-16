import * as store from "./store.js";
export const LANGS = { en: "English", pl: "Polski", es: "Español", de: "Deutsch" };
const D = {
  en: { plugins: "Plugins", settings: "Settings", support: "Support", language: "Language", sort: "Sort by",
        newest: "Newest", oldest: "Oldest", az: "A–Z", search: "Search plugins…", none: "No plugins found.",
        supportText: "Need help, found a bug or want to suggest a plugin? Join the official Yapcord server.",
        join: "Join the Yapcord server", version: "Version", added: "Added", notOfficial: "Yapcord is a community mod, not made by Yapper." },
  pl: { plugins: "Wtyczki", settings: "Ustawienia", support: "Pomoc", language: "Język", sort: "Sortuj",
        newest: "Najnowsze", oldest: "Najstarsze", az: "A–Z", search: "Szukaj wtyczek…", none: "Nie znaleziono wtyczek.",
        supportText: "Potrzebujesz pomocy, znalazłeś błąd lub masz pomysł na wtyczkę? Dołącz do oficjalnego serwera Yapcord.",
        join: "Dołącz do serwera Yapcord", version: "Wersja", added: "Dodano", notOfficial: "Yapcord to modyfikacja społeczności, nie jest tworzona przez Yapper." },
  es: { plugins: "Plugins", settings: "Ajustes", support: "Soporte", language: "Idioma", sort: "Ordenar por",
        newest: "Más nuevos", oldest: "Más antiguos", az: "A–Z", search: "Buscar plugins…", none: "No se encontraron plugins.",
        supportText: "¿Necesitas ayuda, encontraste un error o quieres sugerir un plugin? Únete al servidor oficial de Yapcord.",
        join: "Unirse al servidor de Yapcord", version: "Versión", added: "Añadido", notOfficial: "Yapcord es un mod de la comunidad, no lo crea Yapper." },
  de: { plugins: "Plugins", settings: "Einstellungen", support: "Support", language: "Sprache", sort: "Sortieren nach",
        newest: "Neueste", oldest: "Älteste", az: "A–Z", search: "Plugins suchen…", none: "Keine Plugins gefunden.",
        supportText: "Hilfe nötig, Fehler gefunden oder Plugin-Idee? Tritt dem offiziellen Yapcord-Server bei.",
        join: "Yapcord-Server beitreten", version: "Version", added: "Hinzugefügt", notOfficial: "Yapcord ist eine Community-Mod, nicht von Yapper." },
};
export const t = (k) => (D[store.get().lang] || D.en)[k] ?? D.en[k] ?? k;

Object.assign(D.en, { account: "Your account", yourId: "Your Yapper ID", notDetected: "Not detected yet. Log in and open your profile, then reopen this menu.", copy: "Copy ID", copied: "Copied!", requestBadge: "Request a badge" });
Object.assign(D.pl, { account: "Twoje konto", yourId: "Twoje ID w Yapper", notDetected: "Jeszcze nie wykryto. Zaloguj się i otwórz profil, potem otwórz to menu ponownie.", copy: "Kopiuj ID", copied: "Skopiowano!", requestBadge: "Poproś o odznakę" });
Object.assign(D.es, { account: "Tu cuenta", yourId: "Tu ID de Yapper", notDetected: "Aún no detectado. Inicia sesión y abre tu perfil, luego reabre este menú.", copy: "Copiar ID", copied: "¡Copiado!", requestBadge: "Pedir una insignia" });
Object.assign(D.de, { account: "Dein Konto", yourId: "Deine Yapper-ID", notDetected: "Noch nicht erkannt. Melde dich an, öffne dein Profil und öffne dieses Menü erneut.", copy: "ID kopieren", copied: "Kopiert!", requestBadge: "Badge anfragen" });
