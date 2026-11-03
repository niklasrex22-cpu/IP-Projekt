import type { AudioExample, Canton } from "./types";

/**
 * Dialektbibliothek – alle 26 Kantone.
 *
 * Grundsätze:
 *  • Amtliche Angaben (Hauptort, Amtssprachen) sind als «amtlich» gekennzeichnet.
 *  • Sprachliche Beispiele stammen aus gut dokumentierten Phänomenen und verweisen auf
 *    Fachliteratur. Status «literatur» heisst: vor der Präsentation am Original
 *    (Seitenzahl/Karte) überprüfen und ggf. ergänzen.
 *  • Wo noch nichts recherchiert ist, stehen klar gekennzeichnete Platzhalter.
 *  • Kantonsgrenzen sind keine Dialektgrenzen. Angaben zum Geltungsbereich (scope)
 *    machen das sichtbar.
 *
 * Reihenfolge = BFS-Kantonsnummer (verbindet die Daten mit den Geometrien).
 */

/** Platzhalter für noch fehlende Sprachaufnahmen */
function placeholderRecording(id: string, lang: AudioExample["lang"], title = "Eigene Sprachaufnahme (folgt)"): AudioExample {
  return {
    id: `${id}-aufnahme-1`,
    title,
    lang,
    transcript: undefined,
    audioUrl: undefined,
    verification: "platzhalter",
  };
}

const wappen = (id: string) => `assets/images/cantons/wappen/${id}.svg`;

export const CANTONS: Canton[] = [
  // ─────────────────────────────── 1 ZÜRICH ──────────────────────────────
  {
    id: "zh",
    bfs: 1,
    name: "Zürich",
    officialNames: { de: "Zürich" },
    abbreviation: "ZH",
    capital: "Zürich",
    languages: ["de"],
    dialectRegions: ["Hochalemannisch"],
    varieties: [
      { lang: "de", label: "Zürichdeutsch (Züritüütsch)", note: "Innerhalb des Kantons gibt es regionale Unterschiede, z. B. zwischen Stadt, Weinland und Oberland." },
    ],
    geography: "Nordschweiz · Mittelland · am Zürichsee",
    description:
      "Der bevölkerungsreichste Kanton der Schweiz. Gesprochen werden hochalemannische Mundarten, die man gemeinsam als Zürichdeutsch bezeichnet – auch hier unterscheiden sich Stadt und Land.",
    linguisticNotes: [
      "Wie in den meisten Deutschschweizer Mundarten wird das «k» am Wortanfang zum Reibelaut «ch» (Chind, Chuchi).",
      "Anders als im Berndeutschen wird das «l» vor Konsonanten nicht zu «u» (Milch bleibt «Milch»).",
    ],
    color: "#b07a1f",
    coatOfArms: wappen("zh"),
    words: [
      {
        dialect: "Grüezi",
        lang: "de",
        standardGerman: "Guten Tag (Gruss in der Höflichkeitsform)",
        meaning: "Verkürzt aus «(Gott) grüez i» – ich grüsse euch/Sie.",
        scope: "In grossen Teilen der Deutschschweiz verbreitet, nicht nur in Zürich.",
        source: "idiotikon",
        verification: "literatur",
      },
      {
        dialect: "Meitli",
        lang: "de",
        standardGerman: "Mädchen",
        meaning: "Verkleinerungsform von «Maid». Im Berndeutschen heisst es dagegen «Meitschi».",
        scope: "Zürich und weitere Teile der Nord- und Ostschweiz.",
        source: "ksds",
        verification: "literatur",
      },
      {
        dialect: "Chuchichäschtli",
        lang: "de",
        standardGerman: "Küchenschränkchen",
        meaning: "Bekanntes «Testwort» für die ch-Laute im Schweizerdeutschen.",
        scope: "Gesamte Deutschschweiz (mit regionalen Lautvarianten).",
        source: "idiotikon",
        verification: "literatur",
      },
      {
        dialect: "Sächsilüüte",
        lang: "de",
        standardGerman: "Sechseläuten",
        meaning: "Frühlingsfest der Zürcher Zünfte, bei dem der «Böögg» (eine Schneemann-Figur) verbrannt wird.",
        scope: "Stadt Zürich.",
        source: "idiotikon",
        verification: "literatur",
      },
    ],
    audioExamples: [placeholderRecording("zh", "de")],
    funFact: {
      text: "Das Sechseläuten («Sächsilüüte») hat seinen Namen vom Läuten der Glocken um sechs Uhr abends, das früher den Feierabend im Sommerhalbjahr ankündigte.",
      verification: "literatur",
      source: "idiotikon",
    },
    sources: ["idiotikon", "ksds", "bfs-sprachen"],
    featured: true,
  },

  // ─────────────────────────────── 2 BERN ────────────────────────────────
  {
    id: "be",
    bfs: 2,
    name: "Bern",
    officialNames: { de: "Bern", fr: "Berne" },
    abbreviation: "BE",
    capital: "Bern",
    languages: ["de", "fr"],
    dialectRegions: ["Hochalemannisch (Mittelland)", "Höchstalemannisch (Berner Oberland)", "Französisch (Berner Jura)"],
    varieties: [
      { lang: "de", label: "Berndeutsch (Bärndütsch)", note: "Mittelland, Emmental, Seeland und Oberland unterscheiden sich teils deutlich." },
      { lang: "fr", label: "Französisch im Berner Jura", note: "Der Berner Jura (Verwaltungsregion) ist französischsprachig; Biel/Bienne ist offiziell zweisprachig." },
    ],
    geography: "Westliches Mittelland · Voralpen & Alpen (Berner Oberland) · Jura",
    description:
      "Der Kanton Bern ist offiziell zweisprachig (Deutsch und Französisch). Die Stadt Bern ist Bundesstadt der Schweiz. Berndeutsch ist eine der bekanntesten Mundarten – doch das Berner Oberland klingt anders als das Emmental oder die Stadt.",
    linguisticNotes: [
      "L-Vokalisierung: Ein «l» vor Konsonanten oder am Wortende wird oft wie «u» gesprochen – z. B. «Miuch» (Milch), «Fäud» (Feld), «viu» (viel).",
      "Die Höflichkeitsform des Grusses lautet «Grüessech».",
      "Kantonsgrenze ≠ Sprachgrenze: Im Berner Jura spricht man Französisch.",
    ],
    color: "#c4532f",
    coatOfArms: wappen("be"),
    words: [
      {
        dialect: "Miuch",
        lang: "de",
        standardGerman: "Milch",
        meaning: "Beispiel für die L-Vokalisierung: Das «l» wird zu «u».",
        scope: "Grosse Teile des Kantons Bern sowie angrenzende Gebiete (z. B. Teile von Solothurn, Freiburg).",
        source: "ksds",
        verification: "literatur",
      },
      {
        dialect: "Grüessech",
        lang: "de",
        standardGerman: "Guten Tag (Gruss in der Höflichkeitsform)",
        meaning: "Aus «Grüess ech» – grüss euch.",
        scope: "Bern und Teile der westlichen Deutschschweiz.",
        source: "idiotikon",
        verification: "literatur",
      },
      {
        dialect: "Meitschi",
        lang: "de",
        standardGerman: "Mädchen",
        meaning: "Bernische Form; in Zürich sagt man «Meitli».",
        scope: "Bern und angrenzende Regionen.",
        source: "ksds",
        verification: "literatur",
      },
      {
        dialect: "Gring",
        lang: "de",
        standardGerman: "Kopf (umgangssprachlich)",
        meaning: "Entspricht «Grind» in anderen Mundarten.",
        scope: "Berndeutsch.",
        source: "idiotikon",
        verification: "literatur",
      },
      {
        dialect: "äuä",
        lang: "de",
        standardGerman: "wohl, vermutlich – oft zweifelnd oder ironisch («wohl kaum»)",
        meaning: "Typischer Ausdruck des Berndeutschen; die Bedeutung hängt stark vom Tonfall ab.",
        scope: "Berndeutsch.",
        source: "idiotikon",
        verification: "literatur",
      },
    ],
    audioExamples: [placeholderRecording("be", "de"), placeholderRecording("be", "fr", "Aufnahme Französisch, Berner Jura (folgt)")],
    funFact: {
      text: "Im Berner Matte-Quartier entstand das «Mattenenglisch», eine Geheimsprache, bei der Wörter nach festen Regeln umgestellt werden – mit Englisch hat sie nichts zu tun.",
      verification: "literatur",
      source: "idiotikon",
    },
    music: { title: "Gleitende Vokale (Demo)" },
    sources: ["ksds", "idiotikon", "kv-be", "bfs-sprachen"],
    featured: true,
  },

  // ─────────────────────────────── 3 LUZERN ──────────────────────────────
  base("lu", 3, "Luzern", "LU", "Luzern", ["de"], "Zentralschweiz · Mittelland & Voralpen · am Vierwaldstättersee", "#d08a3c"),
  base("ur", 4, "Uri", "UR", "Altdorf", ["de"], "Zentralschweiz · Alpen (Gotthard)", "#b9763e"),
  base("sz", 5, "Schwyz", "SZ", "Schwyz", ["de"], "Zentralschweiz · Voralpen", "#a8442c"),
  base("ow", 6, "Obwalden", "OW", "Sarnen", ["de"], "Zentralschweiz · Voralpen & Alpen", "#c79a55"),
  base("nw", 7, "Nidwalden", "NW", "Stans", ["de"], "Zentralschweiz · am Vierwaldstättersee", "#b9653f"),
  base("gl", 8, "Glarus", "GL", "Glarus", ["de"], "Ostschweiz · Alpen", "#9f5338"),
  base("zg", 9, "Zug", "ZG", "Zug", ["de"], "Zentralschweiz · Mittelland · am Zugersee", "#d9a75e"),
  {
    ...base("fr", 10, "Freiburg", "FR", "Freiburg (Fribourg)", ["fr", "de"], "Westschweiz · Mittelland & Voralpen", "#8a6aa6"),
    officialNames: { fr: "Fribourg", de: "Freiburg" },
    varieties: [
      { lang: "fr", label: "Französisch (Mehrheitssprache)" },
      { lang: "de", label: "Deutsch, u. a. Senslerdeutsch (Sensebezirk)", note: "Die Stadt Freiburg liegt an der Sprachgrenze." },
    ],
    description:
      "Zweisprachiger Kanton an der deutsch-französischen Sprachgrenze. Die Inhalte zu Dialekten werden noch recherchiert (Platzhalter).",
    dialectRegions: ["Französisch (Romandie)", "Alemannisch (Sensebezirk, Seebezirk)"],
  },
  base("so", 11, "Solothurn", "SO", "Solothurn", ["de"], "Nordwestschweiz · Jura & Mittelland", "#c8693f"),

  // ─────────────────────────────── 12 BASEL-STADT ────────────────────────
  {
    id: "bs",
    bfs: 12,
    name: "Basel-Stadt",
    officialNames: { de: "Basel-Stadt" },
    abbreviation: "BS",
    capital: "Basel",
    languages: ["de"],
    dialectRegions: ["Niederalemannisch"],
    varieties: [
      { lang: "de", label: "Baseldeutsch (Baseldytsch)", note: "Wird zum Niederalemannischen gezählt – im Gegensatz zu den meisten anderen Deutschschweizer Mundarten." },
    ],
    geography: "Nordwestschweiz · am Rhein · Dreiländereck (CH, DE, FR)",
    description:
      "Der flächenmässig kleinste Kanton besteht aus der Stadt Basel und den Gemeinden Riehen und Bettingen. Das Baseldeutsch unterscheidet sich lautlich deutlich von den umliegenden Mundarten.",
    linguisticNotes: [
      "Das «k» am Wortanfang bleibt erhalten: «Kind» statt «Chind», «Kuchi» statt «Chuchi».",
      "Damit gehört Baseldeutsch zum Niederalemannischen, wie die Mundarten im benachbarten Elsass und in Südbaden.",
    ],
    color: "#b23a2a",
    coatOfArms: wappen("bs"),
    words: [
      {
        dialect: "Kind",
        lang: "de",
        standardGerman: "Kind",
        meaning: "Im Baseldeutschen ohne «ch»-Anlaut – in Zürich oder Bern: «Chind».",
        scope: "Stadt Basel (niederalemannisch).",
        source: "ksds",
        verification: "literatur",
      },
      {
        dialect: "Bebbi",
        lang: "de",
        standardGerman: "Basler/Baslerin (scherzhaft)",
        meaning: "Liebevoller Spitzname für die Einwohner:innen Basels (Herkunft des Wortes in der Literatur nachschlagen).",
        scope: "Basel.",
        source: "idiotikon",
        verification: "literatur",
      },
      {
        dialect: "Morgestraich",
        lang: "de",
        standardGerman: "Morgenstreich",
        meaning: "Beginn der Basler Fasnacht am Montag nach Aschermittwoch um 4 Uhr früh, wenn die Lichter der Stadt gelöscht werden.",
        scope: "Basel.",
        source: "idiotikon",
        verification: "literatur",
      },
      {
        dialect: "Drummle und Pfyffe",
        lang: "de",
        standardGerman: "Trommeln und Pfeifen (Piccolo)",
        meaning: "Die beiden Instrumente der traditionellen Fasnachtscliquen – Anknüpfungspunkt für das Demo-Motiv.",
        scope: "Basel.",
        source: "idiotikon",
        verification: "literatur",
      },
    ],
    audioExamples: [placeholderRecording("bs", "de")],
    funFact: {
      text: "Wer in Basel «Kind» sagt und in Zürich «Chind», verwendet zwei Lautformen, die schon im Sprachatlas der deutschen Schweiz als klare Grenze kartiert sind.",
      verification: "literatur",
      source: "sds",
    },
    sources: ["ksds", "sds", "idiotikon"],
    featured: true,
  },
  base("bl", 13, "Basel-Landschaft", "BL", "Liestal", ["de"], "Nordwestschweiz · Jura", "#d89a52"),
  base("sh", 14, "Schaffhausen", "SH", "Schaffhausen", ["de"], "Nordschweiz · nördlich des Rheins", "#c26f37"),
  base("ar", 15, "Appenzell Ausserrhoden", "AR", "Herisau", ["de"], "Ostschweiz · Voralpen (Alpstein)", "#d7aa70"),
  base("ai", 16, "Appenzell Innerrhoden", "AI", "Appenzell", ["de"], "Ostschweiz · Voralpen (Alpstein)", "#a35a35"),
  base("sg", 17, "St. Gallen", "SG", "St. Gallen", ["de"], "Ostschweiz · Bodensee bis Alpen", "#cd7a3e"),

  // ─────────────────────────────── 18 GRAUBÜNDEN ─────────────────────────
  {
    id: "gr",
    bfs: 18,
    name: "Graubünden",
    officialNames: { de: "Graubünden", rm: "Grischun", it: "Grigioni" },
    abbreviation: "GR",
    capital: "Chur",
    languages: ["de", "rm", "it"],
    dialectRegions: ["Hochalemannisch (Churer Rheintal)", "Höchstalemannisch (Walserdeutsch)", "Rätoromanisch (fünf Idiome)", "Lombardisch-italienische Mundarten (Südtäler)"],
    varieties: [
      { lang: "de", label: "Bündnerdeutsch & Walserdeutsch", note: "Walserdeutsch wird z. B. in Davos, im Safiental oder in Obersaxen gesprochen." },
      { lang: "rm", label: "Rätoromanisch: Sursilvan, Sutsilvan, Surmiran, Puter, Vallader", note: "Seit 1982 gibt es zusätzlich die Standardform «Rumantsch Grischun»." },
      { lang: "it", label: "Italienisch: Misox, Calanca, Bergell, Puschlav" },
    ],
    geography: "Südostschweiz · Alpen · grösster Kanton der Schweiz",
    description:
      "Der einzige dreisprachige Kanton der Schweiz. Rätoromanisch ist hier in fünf Schriftidiomen lebendig. Die Sprachräume verlaufen entlang von Tälern – innerhalb weniger Kilometer kann sich die Sprache vollständig ändern.",
    linguisticNotes: [
      "Rätoromanisch ist seit 1938 Landessprache der Schweiz und Teilamtssprache des Bundes.",
      "Die fünf Idiome unterscheiden sich so stark, dass ein gemeinsamer Standard (Rumantsch Grischun) geschaffen wurde.",
      "Kantonsgrenze ≠ Sprachgrenze: Viele Gemeinden sind mehrsprachig.",
    ],
    color: "#a8476f",
    coatOfArms: wappen("gr"),
    words: [
      {
        dialect: "Allegra!",
        lang: "rm",
        standardGerman: "Grüezi / Hallo",
        meaning: "Rätoromanischer Gruss, wörtlich etwa «Freue dich!».",
        scope: "Besonders im Engadin und Val Müstair gebräuchlich (Puter, Vallader).",
        source: "lia-rumantscha",
        verification: "literatur",
      },
      {
        dialect: "Bun di",
        lang: "rm",
        standardGerman: "Guten Tag",
        meaning: "Form im Rumantsch Grischun und im Vallader; im Sursilvan «Bien di».",
        scope: "Rätoromanische Gebiete (Varianten je nach Idiom).",
        source: "lia-rumantscha",
        verification: "literatur",
      },
      {
        dialect: "Grazia fitg",
        lang: "rm",
        standardGerman: "Vielen Dank",
        meaning: "«Grazia» = Danke, «fitg» = sehr (Rumantsch Grischun).",
        scope: "Rumantsch Grischun; in den Idiomen teils andere Formen.",
        source: "lia-rumantscha",
        verification: "literatur",
      },
      {
        dialect: "(Walserdeutsches Wort folgt)",
        lang: "de",
        standardGerman: "Platzhalter: Walserdeutsches Beispielwort",
        meaning: "Hier soll ein recherchiertes Wort aus einer Walsermundart (z. B. Davos) stehen.",
        scope: "Walsergebiete",
        verification: "platzhalter",
      },
    ],
    audioExamples: [
      placeholderRecording("gr", "rm", "Aufnahme Rätoromanisch (folgt)"),
      { ...placeholderRecording("gr", "de", "Aufnahme Bündnerdeutsch (folgt)"), id: "gr-aufnahme-2" },
      { ...placeholderRecording("gr", "it", "Aufnahme Italienisch, Südtäler (folgt)"), id: "gr-aufnahme-3" },
    ],
    funFact: {
      text: "Auf einer Wanderung von Chur ins Engadin kann man in einem einzigen Tag durch deutsch- und romanischsprachige Gemeinden kommen – und mit dem Bergell auch in ein italienischsprachiges Tal.",
      verification: "literatur",
      source: "bfs-sprachen",
    },
    sources: ["kv-gr", "lia-rumantscha", "drg", "bfs-sprachen", "bv-art4"],
    featured: true,
  },
  base("ag", 19, "Aargau", "AG", "Aarau", ["de"], "Nordschweiz · Mittelland", "#dc9e4c"),
  base("tg", 20, "Thurgau", "TG", "Frauenfeld", ["de"], "Ostschweiz · am Bodensee", "#c58c4d"),

  // ─────────────────────────────── 21 TESSIN ─────────────────────────────
  {
    id: "ti",
    bfs: 21,
    name: "Tessin",
    officialNames: { it: "Ticino" },
    abbreviation: "TI",
    capital: "Bellinzona",
    languages: ["it"],
    dialectRegions: ["Lombardische Mundarten (Ticinese)", "Italiano regionale svizzero"],
    varieties: [
      { lang: "it", label: "Italienisch (Standardsprache mit schweizerischen Eigenheiten)" },
      { lang: "it", label: "Tessiner Mundarten (dialetto ticinese)", note: "Gehören zu den lombardischen Mundarten; sie unterscheiden sich von Tal zu Tal." },
    ],
    geography: "Südschweiz · Alpensüdseite · Lago Maggiore & Luganersee",
    description:
      "Der Kanton Tessin ist italienischsprachig. Neben dem Standarditalienischen mit typisch schweizerischen Wörtern («Helvetismen») werden lombardische Mundarten gesprochen, die je nach Tal unterschiedlich klingen.",
    linguisticNotes: [
      "Das Schweizer Italienisch hat Wörter aus dem Deutschen und Französischen übernommen oder eigene Bedeutungen entwickelt.",
      "Die Tessiner Mundarten sind im «Vocabolario dei dialetti della Svizzera italiana» dokumentiert.",
    ],
    color: "#3f8f6b",
    coatOfArms: wappen("ti"),
    words: [
      {
        dialect: "azione",
        lang: "it",
        standardGerman: "Aktion, Sonderangebot",
        meaning: "Im Italien-Italienischen sagt man «offerta». Bedeutung nach dem Vorbild des deutschen «Aktion».",
        scope: "Italienische Schweiz (Tessin, Südtäler GR).",
        source: "olsi",
        verification: "literatur",
      },
      {
        dialect: "classatore",
        lang: "it",
        standardGerman: "Ordner (Bundordner)",
        meaning: "In Italien eher «raccoglitore».",
        scope: "Italienische Schweiz.",
        source: "olsi",
        verification: "literatur",
      },
      {
        dialect: "Natel",
        lang: "it",
        standardGerman: "Handy, Mobiltelefon",
        meaning: "Ursprünglich ein Markenname der PTT; in Italien sagt man «cellulare».",
        scope: "Ganze Schweiz, in allen Sprachregionen.",
        source: "olsi",
        verification: "literatur",
      },
      {
        dialect: "grotto",
        lang: "it",
        standardGerman: "einfaches Gartenlokal",
        meaning: "Ursprünglich ein kühler Felsenkeller zur Lagerung von Wein und Lebensmitteln; heute einfache Gaststätte im Freien.",
        scope: "Tessin und italienischsprachige Täler Graubündens.",
        source: "vsi",
        verification: "literatur",
      },
      {
        dialect: "(Mundartwort folgt)",
        lang: "it",
        standardGerman: "Platzhalter: Wort im dialetto ticinese",
        meaning: "Hier soll ein im VSI überprüftes Mundartwort mit Talangabe eingetragen werden.",
        verification: "platzhalter",
      },
    ],
    audioExamples: [placeholderRecording("ti", "it")],
    sources: ["vsi", "olsi", "bfs-sprachen"],
    featured: true,
  },
  {
    ...base("vd", 22, "Waadt", "VD", "Lausanne", ["fr"], "Westschweiz · Genfersee bis Jura", "#4a6db0"),
    officialNames: { fr: "Vaud" },
    dialectRegions: ["Französisch (Romandie)"],
    varieties: [{ lang: "fr", label: "Französisch der Romandie (français de Suisse romande)" }],
  },
  {
    ...base("vs", 23, "Wallis", "VS", "Sitten (Sion)", ["fr", "de"], "Südwestschweiz · Alpen · Rhonetal", "#7563a9"),
    officialNames: { fr: "Valais", de: "Wallis" },
    dialectRegions: ["Französisch (Unterwallis)", "Höchstalemannisch (Oberwallis)"],
    varieties: [
      { lang: "fr", label: "Französisch (Unter- und Mittelwallis)" },
      { lang: "de", label: "Walliserdeutsch (Oberwallis)" },
    ],
    description: "Zweisprachiger Kanton: Französisch im Westen, Deutsch im Oberwallis. Die Inhalte zu Dialekten werden noch recherchiert (Platzhalter).",
  },
  {
    ...base("ne", 24, "Neuenburg", "NE", "Neuenburg (Neuchâtel)", ["fr"], "Westschweiz · Jura · Neuenburgersee", "#3e5aa0"),
    officialNames: { fr: "Neuchâtel" },
    dialectRegions: ["Französisch (Romandie)"],
    varieties: [{ lang: "fr", label: "Französisch der Romandie" }],
  },

  // ─────────────────────────────── 25 GENF ───────────────────────────────
  {
    id: "ge",
    bfs: 25,
    name: "Genf",
    officialNames: { fr: "Genève" },
    abbreviation: "GE",
    capital: "Genf (Genève)",
    languages: ["fr"],
    dialectRegions: ["Französisch (Romandie)", "Frankoprovenzalisch (historisch)"],
    varieties: [
      { lang: "fr", label: "Französisch der Romandie (français de Suisse romande)" },
      { lang: "fr", label: "Genfer Patois (frankoprovenzalisch)", note: "Als Alltagssprache praktisch verschwunden; erhalten u. a. im Lied «Cé qu'è lainô»." },
    ],
    geography: "Südwestspitze der Schweiz · am Genfersee · fast vollständig von Frankreich umgeben",
    description:
      "Genf ist französischsprachig. Das Französisch der Romandie hat eigene Wörter, die man in Paris nicht unbedingt versteht. Die alten frankoprovenzalischen Mundarten (Patois) werden in Genf kaum noch gesprochen.",
    linguisticNotes: [
      "Zahlwörter: «septante» (70) und «nonante» (90) statt «soixante-dix» und «quatre-vingt-dix».",
      "Für 80 sagt man in Genf meist «quatre-vingts» – «huitante» ist v. a. in der Waadt, im Wallis und in Freiburg verbreitet. Auch innerhalb der Romandie gibt es also Unterschiede.",
    ],
    color: "#5579bf",
    coatOfArms: wappen("ge"),
    words: [
      {
        dialect: "septante",
        lang: "fr",
        standardGerman: "siebzig",
        meaning: "In Frankreich: «soixante-dix» (sechzig-zehn).",
        scope: "Ganze Romandie (auch in Belgien).",
        source: "dsr",
        verification: "literatur",
      },
      {
        dialect: "nonante",
        lang: "fr",
        standardGerman: "neunzig",
        meaning: "In Frankreich: «quatre-vingt-dix» (vier-zwanzig-zehn).",
        scope: "Ganze Romandie (auch in Belgien).",
        source: "dsr",
        verification: "literatur",
      },
      {
        dialect: "le souper",
        lang: "fr",
        standardGerman: "das Abendessen",
        meaning: "Entsprechend heisst das Mittagessen «le dîner» und das Frühstück «le déjeuner» – in Frankreich ist jede Mahlzeit um eine Stelle «verschoben».",
        scope: "Romandie (auch in Belgien und Québec).",
        source: "dsr",
        verification: "literatur",
      },
      {
        dialect: "la panosse",
        lang: "fr",
        standardGerman: "der Putzlappen",
        meaning: "In Frankreich «la serpillière». Das Wort stammt aus den frankoprovenzalischen Mundarten.",
        scope: "Romandie.",
        source: "dsr",
        verification: "literatur",
      },
    ],
    audioExamples: [placeholderRecording("ge", "fr")],
    funFact: {
      text: "Die Genfer Hymne «Cé qu'è lainô» erinnert an die «Escalade» von 1602 und ist im frankoprovenzalischen Genfer Patois geschrieben – einer Sprache, die heute kaum noch jemand spricht.",
      verification: "literatur",
      source: "dsr",
    },
    sources: ["dsr", "bfs-sprachen"],
    featured: true,
  },
  {
    ...base("ju", 26, "Jura", "JU", "Delsberg (Delémont)", ["fr"], "Nordwestschweiz · Jura", "#6680bd"),
    officialNames: { fr: "Jura" },
    dialectRegions: ["Französisch (Romandie)"],
    varieties: [{ lang: "fr", label: "Französisch der Romandie" }],
    description:
      "Jüngster Kanton der Schweiz (gegründet 1979). Seit dem 1. Januar 2026 gehört auch Moutier zum Kanton Jura. Die Inhalte zu Dialekten werden noch recherchiert (Platzhalter).",
  },
];

/** Grunddatensatz für noch nicht ausgearbeitete Kantone – mit klar gekennzeichneten Platzhaltern. */
function base(
  id: string,
  bfs: number,
  name: string,
  abbreviation: string,
  capital: string,
  languages: Canton["languages"],
  geography: string,
  color: string,
): Canton {
  const de = languages[0] === "de";
  return {
    id,
    bfs,
    name,
    officialNames: { [languages[0]]: name },
    abbreviation,
    capital,
    languages,
    dialectRegions: de ? ["Alemannisch (Schweizerdeutsch) – Feineinteilung recherchieren"] : [],
    varieties: de ? [{ lang: "de", label: "Schweizerdeutsche Mundarten" }] : [],
    geography,
    description: `Kanton ${name}, Hauptort ${capital}. Die Inhalte zu Dialekten und Sprache werden noch recherchiert – die folgenden Felder sind Platzhalter.`,
    color,
    coatOfArms: wappen(id),
    words: [
      {
        dialect: "(Wort folgt)",
        lang: languages[0],
        standardGerman: "Platzhalter",
        meaning: "Hier ein recherchiertes Wort mit Quelle eintragen (z. B. aus dem Schweizerischen Idiotikon).",
        verification: "platzhalter",
      },
    ],
    audioExamples: [placeholderRecording(id, languages[0])],
    sources: ["bfs-sprachen"],
  };
}

export const CANTON_BY_ID: Record<string, Canton> = Object.fromEntries(CANTONS.map((c) => [c.id, c]));
export const CANTON_BY_BFS: Record<number, Canton> = Object.fromEntries(CANTONS.map((c) => [c.bfs, c]));
export const FEATURED_IDS = ["be", "zh", "bs", "gr", "ti", "ge"];
