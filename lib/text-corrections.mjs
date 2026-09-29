/**
 * Gezielte redaktionelle Korrekturen an den importierten ICONY- und WordPress-Texten.
 * Der Snapshot in data/ bleibt unverändert (reproduzierbarer Import); hier stehen nur exakte
 * Ersetzungen. Jede Fundstelle muss genau einmal vorkommen – ändert sich der Import, schlägt
 * der Build fehl, statt still falschen Text auszuliefern (tests/text-corrections.test.mjs).
 *
 * Schlüssel: Importpfad ohne Schrägstrich am Ende. Felder: title, description, h1, contentHtml.
 */

const OWN_COMMUNITY = [
  "<p>Das Internet bietet eine Menge von Lesbencommunitys. Unsere ehrliche und völlig unvoreingenommene Empfehlung:</p>",
  "<h4>SIE-SUCHT-SIE.DE – die Community, auf der du gerade bist</h4>",
  "<p>Hier treffen sich Frauen, die Frauen lieben – aus deiner Stadt, aus Österreich und aus der Schweiz. Profil anlegen, stöbern und mit anderen Frauen <a href=\"/lexikon/kostenloser-lesbenchat\">chatten</a> kannst du kostenlos, neue Profile prüft unser Supportteam, und die Server stehen in Deutschland. Zugegeben: Ganz neutral sind wir bei dieser Empfehlung nicht. Aber du bist ja schon da – schau dich einfach um.</p>",
  "<p>Du möchtest lieber erst lesen als chatten? Im <a href=\"/magazin\">Magazin</a> findest du Coming-out-Geschichten, Szene-Guides für deine Stadt und Testberichte anderer Lesbenportale.</p>",
].join(" ");

export const PAGE_CORRECTIONS = Object.freeze({
  "/lexikon": {
    contentHtml: [
      ["Alles auf einen Blick – Ihr Inhaltsverzeichnis auf", "Alles auf einen Blick – dein Inhaltsverzeichnis auf"],
      ["Unsere Seite bietet Ihnen eine Vielzahl spannender Themen, die speziell auf Frauen ausgerichtet sind, die Frauen suchen. Hier finden Sie eine Übersicht der Inhalte, die Ihnen auf", "Unsere Seite bietet dir eine Vielzahl spannender Themen, die speziell auf Frauen ausgerichtet sind, die Frauen suchen. Hier findest du eine Übersicht der Inhalte, die dir auf"],
      ["Entdecken Sie Plattformen und Angebote", "Entdecke Plattformen und Angebote"],
      ["Werden Sie Teil einer lebendigen", "Werde Teil einer lebendigen"],
      ["Erfahren Sie mehr über die Bedeutung", "Erfahre mehr über die Bedeutung"],
      ["Tauschen Sie sich in Echtzeit mit anderen Frauen aus und knüpfen Sie Kontakte.", "Tausche dich in Echtzeit mit anderen Frauen aus und knüpfe Kontakte."],
      ["Entdecken Sie spezielle Angebote für Frauen aus der Schweiz.", "Entdecke spezielle Angebote für Frauen aus der Schweiz."],
      ["Was Sie wissen sollten, wenn Sie neue Wege der Partnersuche erkunden möchten.", "Was du wissen solltest, wenn du neue Wege der Partnersuche erkunden möchtest."],
      ["Jeder Link führt Sie zu spannenden Informationen und Angeboten, die genau auf Ihre Bedürfnisse abgestimmt sind. Stöbern Sie durch unser Verzeichnis und entdecken Sie, was", "Jeder Link führt dich zu spannenden Informationen und Angeboten, die genau auf deine Bedürfnisse abgestimmt sind. Stöbere durch unser Verzeichnis und entdecke, was"],
      ["</a> für Sie bereithält!", "</a> für dich bereithält!"],
    ],
  },
  "/lexikon/lesbencommunity": {
    contentHtml: [
      ["Wie bei Männern die auf der Suche nach einer Frau sind oder umgekehrt, gibt es auch spezielle Singlebörsen für Lesben.", "Neben den klassischen Singlebörsen gibt es auch spezielle Singlebörsen für Lesben."],
      ["wie du dir garantiert vorstellen kannst", "wie du dir sicher vorstellen kannst"],
      ["Von lesbenschaft.de bis hin zu lesarion.com sind viele weitere Seiten eine absolute Empfehlung.", "Eine davon hast du übrigens schon gefunden – du liest gerade auf ihr."],
      ["Die Damen warten bereits auf eine Nachricht von dir und sie werden dich garantiert nicht enttäuschen.", "Vielleicht wartet ja schon jemand auf eine Nachricht von dir – schreiben musst du sie allerdings selbst."],
      [/<p>Das Internet bietet eine Menge von Lesbencommunitys\. Unter anderem:<\/p>[\s\S]*?oder einfach nur schreiben kann\.<\/p>/, OWN_COMMUNITY],
    ],
  },
  "/lexikon/lesbenseiten": {
    contentHtml: [
      ["Das Internet wird dir diese Wünsche garantiert rasch erfüllen können.", "Im Internet stehen die Chancen gut, dass sich diese Wünsche erfüllen."],
      ["mit der Hilfe von den Singlebörsen im Internet garantiert rasch finden können", "mit der Hilfe von den Singlebörsen im Internet oft recht schnell finden können"],
    ],
  },
  "/lexikon/seitensprung-finden": {
    h1: [["Kurze Affäre oder langfristigen Beziehungen", "Kurze Affäre oder langfristige Beziehung?"]],
    description: [["Du brauchst Mal wieder eine Abwechslung? Dann registriere dich gleich kostenlos.", "Lust auf Abwechslung? Hier erfährst du, wie Frauen diskret eine Affäre finden – und worauf du dabei achten solltest."]],
    contentHtml: [
      ["wirst du online garantiert nicht lange nach einer solchen Lady suchen müssen", "wirst du online vermutlich nicht lange nach einer solchen Lady suchen müssen"],
      ["Du wirst garantiert nicht sehr lange warten müssen bis die erste Nachricht", "Mit etwas Glück musst du nicht lange warten, bis die erste Nachricht"],
    ],
  },
  "/lexikon/singleboersen-und-fremdgehen": {
    h1: [["Singlebörsen und fremdgehen - Sie-sucht-Sie.de - Das gilt zu beachten", "Singlebörsen und Fremdgehen – das gilt es zu beachten"]],
    description: [["Du suchst nach einem Abenteuer und hast noch keine gefunden? dann registriere dich sofort kostenlos.", "Du suchst ein Abenteuer? Hier erfährst du, worauf Frauen bei Singlebörsen und Seitensprung achten sollten – diskret und respektvoll."]],
  },
  "/lexikon/fuer-abenteuer": {
    h1: [["Heiße weibliche Nacht erleben", "Abenteuer als Abwechslung – prickelnde Begegnungen unter Frauen"]],
    description: [["Wenn du eine Abwechslung brauchst, dann bist du hier genau richtig! Registriere dich gleich kostenlos.", "Lust auf Abwechslung? Hier erfährst du, welche Möglichkeiten lesbische und bisexuelle Frauen für ein prickelndes Abenteuer haben."]],
  },
  "/lexikon/die-regenbogenfahne": {
    title: [["Die Erklärung finden Sie hier", "Die Erklärung findest du hier"]],
    contentHtml: [["den Stolz aller sich zur sexuellen Andersartigkeit bekennenden,", "des Stolzes aller queeren Menschen"]],
  },
  "/partnersuche/berlin": { contentHtml: [["Diese Ort in Berlin sind wahre Datingpoints", "Diese Orte in Berlin sind wahre Datingpoints"]] },
  "/partnersuche/dortmund": {
    contentHtml: [
      ["Locations für einen lebischen Flirt", "Locations für einen lesbischen Flirt"],
      ["Location für lesvische und bisexuelle Frauen", "Location für lesbische und bisexuelle Frauen"],
    ],
  },
  "/partnersuche/hannover": { h1: [["Dating-Platforme oder live treffen", "Dating-Plattformen oder live treffen"]] },
  "/partnersuche/muenchen": {
    contentHtml: [["Du wirst garantiert nicht sehr lange alleine sitzen bleiben, denn", "Mit etwas Glück bleibst du nicht lange alleine sitzen, denn"]],
  },
  "/schweiz/winterthur": { contentHtml: [["die besten Locations in Winterthurç", "die besten Locations in Winterthur"]] },
  "/schweiz/st-gallen": { contentHtml: [["Lesbische Singles in Winterhur", "Lesbische Singles in Winterthur"]] },
  "/schweiz/schaffhausen": { description: [[" Lesen Sie weiter.", " Lies weiter."]], contentHtml: [["Lesbische Singles in Winterhur", "Lesbische Singles in Winterthur"]] },
  "/schweiz/zuerich": { description: [[" Lesen Sie weiter.", " Lies weiter."]] },
  "/schweiz/lausanne": { description: [[" Lesen Sie weiter hier.", " Lies weiter."]] },
  "/schweiz/thun": { description: [[" Lesen Sie weiter.", " Lies weiter."]] },
  "/schweiz/luzern": { description: [[" Lesen Sie weiter.", " Lies weiter."]] },
  "/schweiz/uster": { description: [[" Lesen Sie weiter hier.", " Lies weiter."]] },
  "/schweiz/sion": { description: [[" Lesen Sie weiter.", " Lies weiter."]] },
  "/schweiz/zug": { description: [[" Lesen Sie weiter.", " Lies weiter."]] },
  "/schweiz/koeniz": { description: [["Finden Sie die Liebe jetzt. Lesen Sie weiter hier.", "Finde die Liebe jetzt. Lies weiter."]] },
});

export const MAGAZINE_CORRECTIONS = Object.freeze({
  // Die Bio stand wortgleich auch auf er-sucht-ihn.de; auf Sie-sucht-Sie keine Verweise auf fremde Plattformen.
  "/magazin/christian-m-haas": {
    contentHtml: [
      [/dazu gehören sowohl (<a href="\/">sie-sucht-sie\.de<\/a>) als auch das Gegenstück <a [^>]*>er-sucht-ihn\.de<\/a>\. Diese Formate haben/, "dazu gehört auch $1. Solche Formate haben"],
      ['<img alt="" height="300" loading="lazy" src="/magazine/media/4127-christian-m-haas-middle.png"', '<img alt="Christian M. Haas" height="300" loading="lazy" src="/magazine/media/4127-christian-m-haas-middle.png"'],
    ],
  },
});

function countMatches(text, find) {
  if (typeof find === "string") return text.split(find).length - 1;
  return (text.match(new RegExp(find.source, `${find.flags.replace("g", "")}g`)) || []).length;
}

/** Wendet die Korrekturen an; wirft, wenn eine Fundstelle nicht genau einmal vorkommt. */
export function applyTextCorrections(entry, table, key = entry.path) {
  const corrections = table[key.replace(/\/+$/, "") || "/"];
  if (!corrections) return entry;
  const next = { ...entry };
  for (const [field, pairs] of Object.entries(corrections)) {
    for (const [find, replace] of pairs) {
      const count = countMatches(next[field] ?? "", find);
      if (count !== 1) throw new Error(`Textkorrektur ${key} ${field}: ${count} Treffer für ${String(find).slice(0, 60)}`);
      next[field] = next[field].replace(find, replace);
    }
  }
  return next;
}
