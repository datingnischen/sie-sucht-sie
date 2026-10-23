"use client";

import { useEffect, useRef, useState } from "react";
import { buildShareData, evaluateAnswers, options, questions } from "@/lib/orientation-selftest.mjs";
import "./orientation-selftest.css";

export function OrientationSelftest() {
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [finished, setFinished] = useState(false);
  const [includeResult, setIncludeResult] = useState(false);
  const [status, setStatus] = useState("");
  const focusTarget = useRef<HTMLHeadingElement>(null);
  const startButton = useRef<HTMLButtonElement>(null);
  const focusAfterReset = useRef(false);
  const result = finished ? evaluateAnswers(answers) : null;
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
    try { await navigator.share(share); setStatus("Teilen-Dialog abgeschlossen."); }
    catch (error) {
      if (error instanceof Error && error.name === "AbortError") setStatus("Teilen abgebrochen. Es wird nichts automatisch veröffentlicht.");
      else setStatus("Teilen ist hier nicht möglich. Du kannst den Text unten kopieren.");
    }
  }

  function reset() {
    focusAfterReset.current = true;
    setAnswers([]); setStep(0); setFinished(false); setIncludeResult(false); setStatus(""); setStarted(false);
  }

  return <section id="selbsttest" className="orientation-test" aria-labelledby="selftest-title">
    <p className="orientation-test-kicker">Deine Gefühle. Dein Tempo.</p>
    <h2 id="selftest-title">Bin ich lesbisch oder bi? Dein Selbsttest</h2>
    {(!started || finished) && <>
      <p>Acht Fragen, etwa drei Minuten und eine persönliche Einordnung zum Nachdenken. Kein wissenschaftlich validierter Test: Er kann Deine sexuelle Orientierung nicht feststellen.</p>
      <p className="orientation-test-privacy">Ohne Anmeldung. Deine Antworten werden nur für diesen Test im Arbeitsspeicher des Browsers verwendet und nicht an uns gesendet. Beim Neuladen sind sie weg.</p>
    </>}
    {!started ? <>
      <button ref={startButton} className="button button-pink" type="button" onClick={() => setStarted(true)}>Selbsttest starten</button>
      <noscript><p>Für die interaktive Auswertung benötigst Du JavaScript. Die Fragen zum Nachdenken und die Einordnung im Artikel kannst Du auch ohne JavaScript lesen.</p></noscript>
    </> : result ? <div className="orientation-test-result">
      <p className="orientation-test-kicker">Deine Momentaufnahme</p>
      <h3 ref={focusTarget} tabIndex={-1}>{result.title}</h3>
      <p>{result.text}</p>
      <blockquote>{result.prompt}</blockquote>
      <h4>Was Du jetzt für Dich tun kannst</h4>
      <ul>
        {result.needsTime && <li>Gib Dir Zeit. Du musst Dich heute weder festlegen noch jemandem etwas erzählen.</li>}
        <li>Notiere, welche Antworten Dir leichtgefallen sind und bei welchen Du noch nachdenken möchtest.</li>
        {result.wantsConversation ? <li>Wenn Du sprechen möchtest: Die <a href="https://www.liebesleben.de/fuer-alle/online-beratung/">vertrauliche Onlineberatung von LIEBESLEBEN</a> ist eine mögliche Anlaufstelle.</li> : <li>Du entscheidest selbst, ob und mit wem Du Deine Gedanken teilst.</li>}
      </ul>
      <details className="orientation-test-method"><summary>Wie entsteht diese Einordnung?</summary><p>Die ersten drei Fragen betreffen Frauen, die nächsten drei andere Geschlechter. „Ja“ und „Manchmal“ zählen jeweils als beschriebene Anziehung oder Beziehungswunsch. Mindestens zwei solche Antworten pro Gruppe führen zur Einordnung „mehrere Geschlechter“. Eine einseitige Einordnung erscheint nur, wenn die andere Gruppe vollständig mit „Nein“ beantwortet ist. Sechs Nein-Antworten ergeben „wenig Anziehung“. Alle übrigen Kombinationen bleiben offen. Die letzten beiden Fragen passen nur die nächsten Schritte an. Diese redaktionellen Regeln sind keine psychologische Messung.</p></details>
      <div className="orientation-test-share">
        <h4>Andere zum Nachdenken einladen</h4>
        <p>Standardmäßig teilst Du nur eine Einladung zum Test. Der Link enthält weder Deine Antworten noch Dein Ergebnis.</p>
        <label className="orientation-test-consent"><input type="checkbox" checked={includeResult} onChange={event => { setIncludeResult(event.target.checked); setStatus(""); }} /> Meinen Ergebnistext ausdrücklich hinzufügen</label>
        <label className="orientation-test-preview-label" htmlFor="selftest-share-preview">Das wird geteilt oder kopiert:</label>
        <textarea id="selftest-share-preview" readOnly value={shareText} rows={5} />
        <div className="orientation-test-actions"><button type="button" className="button button-pink" onClick={shareInvitation}>Einladung teilen</button><button type="button" className="button button-outline" onClick={copyInvitation}>Text &amp; Link kopieren</button></div>
        <p role="status">{status}</p>
      </div>
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
