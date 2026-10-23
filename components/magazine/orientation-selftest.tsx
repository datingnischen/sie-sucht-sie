"use client";

import { useEffect, useRef, useState } from "react";
import { buildShareData, evaluateAnswers, options, questions } from "@/lib/orientation-selftest.mjs";
import { createResultCardFile, resultCards } from "@/lib/result-card.mjs";
import "./orientation-selftest.css";

export function OrientationSelftest() {
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [finished, setFinished] = useState(false);
  const [includeResult, setIncludeResult] = useState(false);
  const [status, setStatus] = useState("");
  const [exporting, setExporting] = useState(false);
  const focusTarget = useRef<HTMLHeadingElement>(null);
  const startButton = useRef<HTMLButtonElement>(null);
  const focusAfterReset = useRef(false);
  const result = finished ? evaluateAnswers(answers) : null;
  const card = result ? resultCards[result.id as keyof typeof resultCards] : null;
  const share = buildShareData(result, includeResult);
  const shareText = `${share.text}\n${share.url}`;

  useEffect(() => {
    if (started) focusTarget.current?.focus();
    else if (focusAfterReset.current) {
      startButton.current?.focus();
      focusAfterReset.current = false;
    }
  }, [started, step, finished]);

  async function copyInvitation() {
    try {
      await navigator.clipboard.writeText(shareText);
      setStatus("Text und Testlink kopiert. Du entscheidest, wo Du sie einfügst.");
    } catch {
      setStatus("Automatisches Kopieren ist hier nicht möglich. Markiere und kopiere den Text aus der Vorschau.");
    }
  }

  async function shareInvitation() {
    if (!navigator.share) { await copyInvitation(); return; }
    setExporting(true);
    try {
      if (includeResult && result) {
        const file = await createResultCardFile(result.id);
        if (navigator.canShare?.({ files: [file] })) await navigator.share({ ...share, files: [file] });
        else await navigator.share(share);
      } else await navigator.share(share);
      setStatus("Teilen-Dialog abgeschlossen.");
    }
    catch (error) {
      if (error instanceof Error && error.name === "AbortError") setStatus("Teilen abgebrochen. Es wird nichts automatisch veröffentlicht.");
      else setStatus("Teilen ist hier nicht möglich. Du kannst den Text unten kopieren.");
    }
    finally { setExporting(false); }
  }

  async function downloadCard() {
    if (!result) return;
    setExporting(true);
    try {
      const file = await createResultCardFile(result.id);
      const url = URL.createObjectURL(file);
      const link = document.createElement("a");
      link.href = url; link.download = file.name; link.click();
      setTimeout(() => URL.revokeObjectURL(url), 30000);
      setStatus("Deine Karte wird als Bild gespeichert – bereit für Deine Story oder Deinen Status.");
    } catch { setStatus("Das Bild konnte nicht erstellt werden. Du kannst weiterhin Text und Testlink kopieren."); }
    finally { setExporting(false); }
  }

  function reset() {
    focusAfterReset.current = true;
    setAnswers([]); setStep(0); setFinished(false); setIncludeResult(false); setStatus(""); setStarted(false);
  }

  return <section id="selbsttest" className={`orientation-test${result ? " orientation-test-has-result" : ""}`} aria-label={result ? "Dein Gefühlskompass: Ergebnis" : undefined} aria-labelledby={result ? undefined : "selftest-title"}>
    {!result && <><p className="orientation-test-kicker">Deine Gefühle. Dein Tempo.</p>
    <h2 id="selftest-title">Bin ich lesbisch oder bi? Dein Selbsttest</h2></>}
    {!started && <>
      <p>Acht Fragen, etwa drei Minuten und eine persönliche Einordnung zum Nachdenken. Kein wissenschaftlich validierter Test: Er kann Deine sexuelle Orientierung nicht feststellen.</p>
      <p className="orientation-test-privacy">Ohne Anmeldung. Deine Antworten werden nur für diesen Test im Arbeitsspeicher des Browsers verwendet und nicht an uns gesendet. Beim Neuladen sind sie weg.</p>
    </>}
    {!started ? <>
      <button ref={startButton} className="button button-pink" type="button" onClick={() => setStarted(true)}>Selbsttest starten</button>
      <noscript><p>Für die interaktive Auswertung benötigst Du JavaScript. Die Fragen zum Nachdenken und die Einordnung im Artikel kannst Du auch ohne JavaScript lesen.</p></noscript>
    </> : result && card ? <div className="orientation-test-result">
      <div className={`feeling-card feeling-card-${result.id}`}>
        <div className="feeling-card-rings" aria-hidden="true" />
        <div className="feeling-card-top"><span>Sie-sucht-Sie.de</span><span>Dein Gefühlskompass</span></div>
        <svg className="feeling-card-heart" viewBox="0 0 100 100" aria-hidden="true"><path d="M50 84C39 74 9 55 9 32C9 9 36 4 50 24C64 4 91 9 91 32C91 55 61 74 50 84Z" /></svg>
        <p className="feeling-card-eyebrow">{card.eyebrow}</p>
        <h3 ref={focusTarget} tabIndex={-1} aria-label={result.title}>{card.lines.map(line => <span key={line}>{line}</span>)}</h3>
        <p className="feeling-card-caption">{card.caption}</p>
        <div className="feeling-card-bottom"><span>Und was sagt Dein Gefühl?</span><small>Mach den Selbsttest auf sie-sucht-sie.de</small></div>
        <p className="feeling-card-note">Eine Momentaufnahme. Du bestimmst Dein Label.</p>
      </div>
      <div className="orientation-test-share">
        <h4>Deine Karte. Deine Story.</h4>
        <p>Speichere Deine Karte als Bild oder lade jemanden zum Test ein.</p>
        <button type="button" className="button button-pink feeling-card-download" disabled={exporting} onClick={downloadCard}>{exporting ? "Einen Moment …" : "↓ Meine Karte als Bild speichern"}</button>
        <label className="orientation-test-consent"><input type="checkbox" checked={includeResult} onChange={event => { setIncludeResult(event.target.checked); setStatus(""); }} /> Beim Teilen meine Ergebniskarte und den Ergebnistext hinzufügen</label>
        {includeResult && <p className="orientation-test-privacy">Beim Teilen wird auf unterstützten Geräten die Karte oben als Bild angehängt. Sonst werden Ergebnistext und Testlink geteilt. Einzelne Antworten bleiben privat.</p>}
        <div className="orientation-test-actions"><button type="button" className="button button-outline" disabled={exporting} onClick={shareInvitation}>{includeResult ? "Mein Ergebnis teilen" : "Freundin zum Test einladen"}</button><button type="button" className="orientation-test-text-button" onClick={copyInvitation}>Text &amp; Link kopieren</button></div>
        <details className="orientation-test-share-preview"><summary>Vorschau des Teilentexts</summary><label className="orientation-test-preview-label" htmlFor="selftest-share-preview">Diesen Text gibst Du weiter:</label><textarea id="selftest-share-preview" readOnly value={shareText} rows={5} /></details>
        <p role="status">{status}</p>
      </div>
      <div className="feeling-card-interpretation"><p className="orientation-test-kicker">Ein bisschen mehr über Dein Ergebnis</p><h4>{result.title}</h4><p>{result.text}</p><blockquote>{result.prompt}</blockquote><p>{result.needsTime ? "Gib Dir Zeit. Du musst Dich heute weder festlegen noch jemandem etwas erzählen." : "Du entscheidest selbst, welche Worte sich für Dich richtig anfühlen."}</p></div>
      <details className="orientation-test-method"><summary>Wie entsteht diese Einordnung?</summary><p>Die ersten drei Fragen betreffen Frauen, die nächsten drei andere Geschlechter. „Ja“ und „Manchmal“ zählen jeweils als beschriebene Anziehung oder Beziehungswunsch. Mindestens zwei solche Antworten pro Gruppe führen zur Einordnung „mehrere Geschlechter“. Eine einseitige Einordnung erscheint nur, wenn die andere Gruppe vollständig mit „Nein“ beantwortet ist. Sechs Nein-Antworten ergeben „wenig Anziehung“. Alle übrigen Kombinationen bleiben offen. Die letzten beiden Fragen dienen der Reflexion. Diese redaktionellen Regeln sind keine psychologische Messung.</p></details>
      <div className="orientation-test-actions"><button className="orientation-test-text-button" type="button" onClick={() => { setFinished(false); setIncludeResult(false); setStatus(""); }}>Antworten ansehen und ändern</button><button className="orientation-test-text-button" type="button" onClick={reset}>Antworten löschen &amp; neu starten</button></div>
    </div> : <form onSubmit={event => {
      event.preventDefault();
      if (!answers[step]) return;
      if (step === questions.length - 1) setFinished(true); else setStep(step + 1);
    }}>
      <p className="orientation-test-progress-label">Frage {step + 1} von {questions.length}</p>
      <progress aria-label="Fortschritt im Selbsttest" value={step} max={questions.length} />
      <h3 ref={focusTarget} tabIndex={-1}>{questions[step].text}</h3>
      <p id="selftest-hint">{questions[step].hint}</p>
      <fieldset aria-describedby="selftest-hint"><legend className="orientation-test-legend">Welche Antwort passt gerade zu Dir?</legend>
        {options.map(option => <label className="orientation-test-option" key={option.value}>
          <input type="radio" name={`selftest-${step}`} value={option.value} checked={answers[step] === option.value} onChange={() => setAnswers(previous => { const next = [...previous]; next[step] = option.value; return next; })} required />
          <span>{option.label}</span>
        </label>)}
      </fieldset>
      <div className="orientation-test-actions"><button type="button" className="button button-outline" disabled={step === 0} onClick={() => setStep(step - 1)}>Zurück</button><button className="button button-pink" type="submit" disabled={!answers[step]}>{step === questions.length - 1 ? "Meine Einordnung ansehen" : "Weiter"}</button></div>
      <button className="orientation-test-text-button" type="button" onClick={reset}>Test beenden und Antworten löschen</button>
    </form>}
  </section>;
}
