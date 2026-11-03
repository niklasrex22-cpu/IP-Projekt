import { LANGUAGE_LABEL, type LanguageCode } from "../data/types";

export function LangChips({ langs }: { langs: LanguageCode[] }) {
  return (
    <span style={{ display: "inline-flex", gap: 6, flexWrap: "wrap" }}>
      {langs.map((l) => (
        <span key={l} className="chip" style={{ color: `var(--lang-${l})` }}>
          <span className="dot" />
          <span style={{ color: "var(--ink-2)" }}>{LANGUAGE_LABEL[l]}</span>
        </span>
      ))}
    </span>
  );
}
