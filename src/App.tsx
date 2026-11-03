import { useEffect } from "react";
import { audio } from "./audio/engine";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { useRoute } from "./lib/router";
import { AboutPage } from "./pages/AboutPage";
import { ComparePage } from "./pages/ComparePage";
import { HomePage } from "./pages/HomePage";
import { MapPage } from "./pages/MapPage";
import { QuizPage } from "./pages/QuizPage";
import { SoundLabPage } from "./pages/SoundLabPage";
import { WappenPage } from "./pages/WappenPage";

const TITLES: Record<string, string> = {
  start: "Schweiz klingt anders",
  karte: "Schweizerkarte",
  klanglabor: "Klanglabor",
  vergleich: "Dialektvergleich",
  quiz: "Dialektquiz",
  projekt: "Über das Projekt",
  wappen: "Wappensammlung",
};

export default function App() {
  const route = useRoute();

  useEffect(() => {
    document.title = route.page === "start" ? TITLES.start : `${TITLES[route.page]} · Schweiz klingt anders`;
    window.scrollTo({ top: 0 });
    if (route.page === "start") document.documentElement.style.setProperty("--accent", "#e8553a");
  }, [route.page]);

  // Beim Seitenwechsel laufende Wiedergabe stoppen (ausser auf derselben Seite)
  useEffect(() => () => audio.stop(), [route.page]);

  let page;
  switch (route.page) {
    case "karte":
      page = <MapPage cantonId={route.params[0]} />;
      break;
    case "klanglabor":
      page = <SoundLabPage cantonId={route.params[0]} />;
      break;
    case "vergleich":
      page = <ComparePage a={route.params[0]} b={route.params[1]} />;
      break;
    case "quiz":
      page = <QuizPage />;
      break;
    case "projekt":
      page = <AboutPage />;
      break;
    case "wappen":
      page = <WappenPage />;
      break;
    default:
      page = <HomePage />;
  }

  return (
    <>
      <Header page={route.page} />
      <main id="main" tabIndex={-1} className="page" key={route.page} style={{ outline: "none" }}>
        {page}
      </main>
      <Footer />
    </>
  );
}
