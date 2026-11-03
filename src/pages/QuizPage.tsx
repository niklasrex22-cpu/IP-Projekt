import { useMemo, useState } from "react";
import { audio } from "../audio/engine";
import { motifFor } from "../audio/motifFor";
import { Badge } from "../components/Badge";
import { SourceNote } from "../components/CantonDetail";
import { Icon } from "../components/Icon";
import { PlayButton } from "../components/PlayButton";
import { SwissMap } from "../components/SwissMap";
import { Visualizer } from "../components/Visualizer";
import { CANTON_BY_ID } from "../data/cantons";
import { QUIZ, type QuizQuestion } from "../data/quiz";
import { assetUrl, useAccent } from "../lib/hooks";
import { href } from "../lib/router";

function shuffle<T>(a: T[]): T[] {
  const r = [...a];
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
}

/** Nur Fragen, deren Medien tatsächlich vorhanden sind */
function usable(q: QuizQuestion) {
  if (q.type === "recording") return !!q.audioUrl;
  return true;
}

export function QuizPage() {
  const [round, setRound] = useState(0);
  const questions = useMemo(() => shuffle(QUIZ.filter(usable)), [round]);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const done = idx >= questions.length;
  const q = questions[idx];
  const reveal = q?.revealCanton ? CANTON_BY_ID[q.revealCanton] : undefined;
  useAccent(picked !== null && reveal ? reveal.color : "#e8553a");
  const hasDemo = questions.some((x) => x.demo);
  const hidden = QUIZ.length - QUIZ.filter(usable).length;

  const answer = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    if (i === q.answer) setScore((s) => s + 1);
  };
  const next = () => {
    audio.stop();
    setPicked(null);
    setIdx((n) => n + 1);
  };
  const restart = () => {
    audio.stop();
    setRound((r) => r + 1);
    setIdx(0);
    setScore(0);
    setPicked(null);
  };

  return (
    <div className="wrap section quiz">
      <div className="section-head">
        <p className="eyebrow">Dialektquiz</p>
        <h1 className="h2">Hörst du, woher es kommt?</h1>
        {hasDemo && (
          <div className="notice">
            <span aria-hidden="true">⚑</span>
            <span>
              <strong>Demoversion:</strong> Es sind noch keine authentischen Sprachaufnahmen vorhanden. Die Fragen sind als Testfragen markiert und
              beruhen auf den Inhalten der Dialektbibliothek bzw. auf den Demo-Klangmotiven (künstlerische Interpretationen).
              {hidden > 0 && ` ${hidden} Aufnahme-Frage(n) werden angezeigt, sobald die Audiodateien vorhanden sind.`}
            </span>
          </div>
        )}
      </div>

      <div className="quiz-progress" aria-label={`Frage ${Math.min(idx + 1, questions.length)} von ${questions.length}, ${score} Punkte`}>
        <div className="bar">
          <span style={{ width: `${(Math.min(idx + (picked !== null ? 1 : 0), questions.length) / questions.length) * 100}%` }} />
        </div>
        <div className="quiz-meta">
          <span>
            Frage {Math.min(idx + 1, questions.length)} / {questions.length}
          </span>
          <span className="score">
            {score} <small>Punkte</small>
          </span>
        </div>
      </div>

      {done ? (
        <div className="card pad quiz-card quiz-end">
          <p className="eyebrow">Geschafft!</p>
          <h2 className="h2">
            {score} von {questions.length}
          </h2>
          <p className="lead">
            {score === questions.length
              ? "Perfekt – du hörst die Schweiz ganz genau."
              : score >= questions.length / 2
                ? "Stark! Die Unterschiede sind manchmal kleiner, als man denkt."
                : "Gar nicht so einfach – entdecke die Kantone auf der Karte und versuche es nochmals."}
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button type="button" className="btn accent" onClick={restart}>
              <Icon name="reset" /> Nochmals spielen
            </button>
            <a className="btn ghost" href={href("karte")}>
              Zur Karte
            </a>
          </div>
        </div>
      ) : (
        <div className="quiz-layout">
          <div className="card pad quiz-card" key={q.id}>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
              {q.demo && <span className="badge platzhalter">Testfrage</span>}
              <span className="chip">{q.type === "recording" ? "Hörfrage – Aufnahme" : q.type === "motif" ? "Klangrätsel – Demo-Motiv" : "Wissensfrage"}</span>
            </div>
            <h2 className="h3" style={{ marginBottom: 18 }}>
              {q.prompt}
            </h2>

            {(q.type === "recording" || q.type === "motif") && (
              <div style={{ display: "grid", gap: 12, marginBottom: 18 }}>
                <PlayButton
                  sourceId={`quiz:${q.id}`}
                  label={q.type === "recording" ? "Aufnahme anhören" : "Motiv anhören"}
                  onPlay={() =>
                    q.type === "recording"
                      ? void audio.playFile(`quiz:${q.id}`, assetUrl(q.audioUrl!), null, "Quiz-Aufnahme")
                      : void audio.playMotif(`quiz:${q.id}`, motifFor(CANTON_BY_ID[q.motifCanton!]), null, "Quiz-Klangrätsel")
                  }
                />
                <Visualizer mode={q.type === "recording" ? "wave" : "rhythm"} color="#1d1a17" height={150} />
              </div>
            )}

            <div className="options" role="group" aria-label="Antwortmöglichkeiten">
              {q.options.map((o, i) => {
                const state = picked === null ? "" : i === q.answer ? "correct" : i === picked ? "wrong" : "dim";
                return (
                  <button key={i} type="button" className={`option ${state}`} onClick={() => answer(i)} disabled={picked !== null} aria-pressed={picked === i}>
                    <span className="letter">{String.fromCharCode(65 + i)}</span>
                    <span>{o}</span>
                    {state === "correct" && <Icon name="check" />}
                    {state === "wrong" && <Icon name="x" />}
                  </button>
                );
              })}
            </div>

            {picked !== null && (
              <div className="explain" role="status">
                <strong>{picked === q.answer ? "Richtig!" : `Leider falsch – richtig ist: ${q.options[q.answer]}.`}</strong>
                <p>{q.explanation}</p>
                <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", fontSize: 12 }} className="muted">
                  <Badge v={q.verification} />
                  <SourceNote id={q.source} />
                </div>
                <button type="button" className="btn" onClick={next} autoFocus>
                  {idx + 1 < questions.length ? "Nächste Frage" : "Auswertung"} <Icon name="arrow" />
                </button>
              </div>
            )}
          </div>
          <div className="quiz-map" aria-hidden={picked === null}>
            <SwissMap mode="geo" interactive={false} autoFocus selectedId={picked !== null ? (reveal?.id ?? null) : null} ariaLabel="Lösungskarte" />
            <p className="muted" style={{ fontSize: 13, textAlign: "center" }}>
              {picked !== null && reveal ? `Lösung: ${reveal.name}` : "Die Karte zeigt nach der Antwort die Lösung."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
