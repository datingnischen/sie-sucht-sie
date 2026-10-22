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
    // Seobility (Crawl 14.10.2026): H1 und Description zu kurz.
    h1: [["Lexikon", "Lexikon – kurz und knapp erklärt"]],
    description: [["In unseren Lexikon findest du kurze und knappe Erklärungen zu LGBT Begriffen und mehr.", "In unserem Lexikon findest du kurze, verständliche Erklärungen zu LGBT-Begriffen, lesbischer Kultur, Symbolen und zur Partnersuche im Internet."]],
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
    h1: [["Lesbencommunity", "Lesbencommunity – Gemeinschaft unter Frauen"]],
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
    // Seobility: Description zu kurz (86 Zeichen).
    description: [["Was ist die Regenbogenfahne? Welche Bedeutung hat sie? Klicke hier, um es zu erfahren.", "Was ist die Regenbogenfahne, wer hat sie entworfen und wofür stehen ihre sechs Farben? Geschichte und Symbolik der Rainbow Flag kurz erklärt."]],
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
  // --- On-Page-SEO (Semrush On Page SEO Checker, Export 2026-10-10): Zielkeyword in Title/H1/Description, echte Description statt Platzhalter.
  "/lexikon/kostenloser-lesbenchat": {
    title: [["Kostenloser Lesbenchat - Erklärungen finden hier", "Lesben Chat kostenlos: Lesbenchat auf Sie-sucht-Sie.de"]],
    h1: [["Chat mit anderen Lesben - reizvoll und prickelnd", "Lesben-Chat: Kostenlos mit anderen Frauen chatten"]],
    description: [["Du hast Langeweile, dann registriere dich gleich kostenlos und chatte mit Frauen.", "Kostenloser Lesben Chat für Frauen, die Frauen lieben: So funktioniert der Lesbenchat, wie du dich anmeldest und worauf du achten solltest."]],
  },
});

/** Selbsttest-Abschnitt für /magazin/bin-ich-lesbisch (Suchintention „bin ich lesbisch test“), mit internem Link zum Lesbenchat. */
const SELFTEST_BIN_ICH_LESBISCH = '<a href="https://www.youtube.com/watch?v=bwwAEuVTvcY" rel="nofollow noopener noreferrer" target="_blank">Video auf YouTube ansehen</a></p></p> <h2>Bin ich lesbisch oder bi? Ein kleiner Selbsttest</h2> <p>Ein Test im Internet kann dir keine Antwort geben, die du nicht schon in dir trägst. Aber die richtigen Fragen helfen beim Sortieren. Nimm dir einen Moment und antworte ehrlich:</p> <ol> <li>Wenn du an Verliebtsein denkst – taucht vor deinem inneren Auge eher eine Frau auf als ein Mann?</li> <li>Fühlst du dich zu Frauen nicht nur freundschaftlich, sondern auch körperlich hingezogen?</li> <li>Hast du dich bei Beziehungen oder Dates mit Männern oft gefragt, ob „etwas fehlt“?</li> <li>Beschäftigt dich die Frage „Bin ich lesbisch oder bi?“ schon länger als ein paar Wochen?</li> <li>Würdest du dich erleichtert fühlen, wenn du dir selbst erlaubst, Frauen zu lieben?</li> </ol> <p>Je öfter du mit „Ja“ antwortest, desto eher lohnt es sich, deine Gefühle ernst zu nehmen – egal, ob du dich am Ende als lesbisch, bisexuell oder einfach noch unentschieden beschreibst. Niemand muss sich festlegen, und ein Coming-out hat kein Verfallsdatum. Wenn du dich mit anderen Frauen austauschen möchtest, die ähnliche Fragen hatten, findest du sie im <a href="/lexikon/kostenloser-lesbenchat">kostenlosen Lesbenchat</a> auf Sie-sucht-Sie.de.</p>';

/**
 * Sachliche Korrekturen (2026-10-22), gefunden beim Schreiben der Audio-Zusammenfassungen.
 * Belege: WHO (ICD-11, STI-Factsheet), CDC NISVS 2010, Statista Consumer Insights, Verwaltungsgericht Kairo 2015,
 * de.wikipedia.org „Princess Charming (Fernsehsendung)“, RTL gegenüber DWDL (August 2026), Girlflirt-FAQ.
 * Wird in MAGAZINE_CORRECTIONS eingemischt (Paare hinter vorhandenen Korrekturen desselben Feldes).
 */
const FACT_CHECK_MODIFIED = [[/^.*$/, "2026-10-22T12:00:00"]];

const PC1_CANDIDATES = ["Lou (21, Saarbrücken)", "Elsa (22, Berlin)", "Bine (33, Berlin)", "Miri (28, Kiel)", "Gea (28, Berlin)", "Kati (29, Berlin)", "Sarina (27, Stolberg)", "Iry (27, Köln)", "Wiki (27, Hamburg)", "Jana (26, Dorsten)", "Johanna (26, Hildesheim)", "Saskia (25, Berlin)", "Britta (26, Aachen)", "Anja (30, Leipzig)", "Niki (27, Berlin)", "Tabi (25, Dortmund)", "Lia (30, Berlin)", "Sandra (31, Ratingen)", "Sonja (30, Salzburg)", "Ulle (28, Berlin)"];
const PC4_CANDIDATES = ["Christine (28) – Köln", "Maike (30) – Berlin", "Marlen (31) – Berlin", "Sarah (29) – Köln", "Hang (31) – Hannover", "Katharina (28) – Regensburg", "Laura (28) – Bochum", "Marjam (30) – Hamburg", "Lara (27) – Frankfurt am Main", "Tommi (23) – Osnabrück", "Inci (27) – Heidelberg", "Lucia (28) – Leipzig", "Sara (20) – Wien", "Seleya (23) – Köln", "Sina (24) – München", "Tay (25) – Zürich", "Melissa (28) – Neuss", "Julia (23) – Berlin", "Lisa (24) – Bamberg", "Viviana (24) – Wien"];
const htmlList = (items) => `<ul> ${items.map((item) => `<li>${item}</li>`).join(" ")} </ul>`;

const FACT_CORRECTIONS_2026_10_22 = {
  "/magazin/welche-sexualitaeten-gibt-es": {
    modified: FACT_CHECK_MODIFIED,
    contentHtml: [
      // Trans ist eine geschlechtliche Identität, keine sexuelle Orientierung.
      [", transsexuell oder ", " oder "],
      ["die völlig unabhängig vom Geschlecht ist.</p>", "die völlig unabhängig vom Geschlecht ist. Trans zu sein ist dagegen keine sexuelle Orientierung, sondern betrifft die <a href=\"/magazin/geschlechtsidentitaet\">geschlechtliche Identität</a>: Trans Menschen können hetero-, homo-, bi- oder pansexuell sein.</p>"],
      ["<li>Transsexualität</li> ", ""],
      [/<p>Eine weitere Unterform stellt die Pädosexualität dar[\s\S]*?Leben in der Gesellschaft erheblich erschwert\.<\/p>/, "<p>Nicht in diese Reihe gehört die Pädophilie, also das sexuelle Interesse Erwachsener an Kindern. Sie ist keine sexuelle Orientierung wie die oben genannten, sondern zählt medizinisch zu den Störungen der Sexualpräferenz. Sexuelle Handlungen an Kindern sind sexueller Missbrauch und eine schwere Straftat. Wer solche Neigungen bei sich bemerkt, findet etwa beim Präventionsnetzwerk „Kein Täter werden“ kostenlose und vertrauliche Hilfe.</p>"],
      ["Die anderen zuvor genannten Sexualitäten", "Die zuvor genannten sexuellen Orientierungen"],
      // Statista Consumer Insights: Werte gelten für Erwachsene, die 1995 oder später geboren sind, nicht für alle.
      [/<p>Anbei finden Sie die Statistik darüber[\s\S]*?1% als asexuell\.<\/p>/, "<p>Wie sich Menschen in Deutschland selbst einordnen, zeigt eine Auswertung von Statista (Consumer Insights): Von den Erwachsenen, die 1995 oder später geboren sind (Generation Z), bezeichnen sich 3 % als homosexuell, 6 % als bisexuell, 2 % als pansexuell und 1 % als asexuell. In den älteren Generationen sind diese Anteile deutlich kleiner.</p>"],
      ["Und Transsexualität steht noch einmal auf einem anderen Blatt. Früher war es wohl undenkbar zuzugeben, dass man sich im eigenen Körper nicht richtig aufgehoben fühlt – und sich zum anderen Geschlecht zugehörig fühlt.", "Und Transgeschlechtlichkeit steht noch einmal auf einem anderen Blatt, denn dabei geht es nicht darum, wen man liebt, sondern welchem Geschlecht man sich zugehörig fühlt. Früher war es wohl undenkbar zuzugeben, dass man sich im eigenen Körper nicht richtig aufgehoben fühlt."],
    ],
  },
  "/magazin/lesben-sex": {
    modified: FACT_CHECK_MODIFIED,
    contentHtml: [
      ["Rund 80 Prozent aller Damen haben ", "Auch viele heterosexuelle Frauen haben "],
      [/3\.\) Die sexuelle Ausrichtung wird dem Menschen nicht[\s\S]*?geprägt werden\./, "3.) Die sexuelle Orientierung lässt sich weder anerziehen noch durch das Umfeld „umpolen“. Manche Menschen entdecken ihre Gefühle aber erst später oder ordnen sie im Laufe des Lebens neu ein – auch das ist völlig normal. Welche <a href=\"/magazin/welche-sexualitaeten-gibt-es\">Sexualitäten</a> es gibt, liest du in unserem Überblick."],
    ],
  },
  "/magazin/lesben-erkennen": {
    modified: FACT_CHECK_MODIFIED,
    contentHtml: [
      ["Das kann im Einzelnen gar nicht so einfach sein, denn man kann hier lediglich auf einzelne Merkmale achten, die es dem Beobachter ermöglichen zu erkennen, ", "Die ehrliche Antwort vorweg: gar nicht. Ansehen kann man niemandem, "],
      ["Im nachfolgenden Ratgeber erfahren interessierte Leser hierzu einige interessante Merkmale und Zeichen, die es erlauben eine schlüssige Einschätzung vorzunehmen und Lesben besser erkennen zu können.", "Im nachfolgenden Ratgeber schauen wir uns verbreitete Zeichen und Klischees an – und warum sie höchstens Hinweise sind. Sicher weißt du es erst, wenn eine Frau es dir selbst sagt."],
      ["Durch eine gezielte Beobachtung können einzelne Merkmale, ob eine weibliche Homosexualität vorliegt, besser erkannt werden. Doch wie genau ist ein typisches Verhalten einer lesbischen Frau?", "Viele glauben, man könne lesbische Frauen durch gezielte Beobachtung erkennen. Doch ein typisches Verhalten lesbischer Frauen gibt es nicht."],
      [/Die Stimme kann in diesem Zuge[\s\S]*?als ein Kriterium hierfür auffassen\./, "Oft heißt es zum Beispiel, man könne es an der Stimme hören. Das ist ein Klischee: Die Stimmfarbe hängt von Körperbau, Hormonen und Gewohnheiten ab, nicht von der <a href=\"/magazin/welche-sexualitaeten-gibt-es\">Sexualität</a>. Eine tiefe oder hohe Stimme verrät also nichts über die Orientierung."],
      [/Es kann jedoch ein Zeichen hierfür sein, wenn typisch [\s\S]*?verzichtet wird\./, "Ebenso wenig sagen <a href=\"/magazin/maskulin-feminin\">maskulin</a> wirkende Kurzhaarschnitte oder unrasierte Beine etwas über die Orientierung aus – das ist eine Frage des Stils."],
      [/Zudem sollte auf Tätowierungen geachtet werden\.[\s\S]*?weibliche Homosexualität gegeben\./, "Selbst ein Tattoo mit der bunten <a href=\"/magazin/lesbenflagge\">Regenbogenflagge</a> auf dem Oberarm ist kein Beweis – auch heterosexuelle Unterstützerinnen zeigen so ihre Solidarität."],
      ["denn man kann sicher durch vereinzelte Punkte in der Kleidung einen Rückschluss auf die Sexualität eines Menschen ziehen, dieser Umstand kann jedoch nicht zwingend als das Alleinstellungsmerkmal verstanden werden. Frauen, die sich über alle Maßen männlich kleiden in einem typischen Lesben Style haben entweder einen sehr maskulinen Geschmack oder schlicht eine lesbische Neigung.", "denn von der Kleidung kann man nicht auf die Sexualität eines Menschen schließen. Frauen, die sich sehr maskulin kleiden, haben schlicht diesen Geschmack – lesbisch, bi oder hetero können sie trotzdem sein."],
      ["so kann das ein eindeutiges Indiz hierfür sein.", "kann das Interesse bedeuten – eindeutig ist es aber nicht."],
      ["Eine Lesbe zu erkennen bedarf jedoch einiges an Übung, denn nicht jede Lesbe kann man auf den ersten Blick auch als solche erkennen.", "Die sexuelle Orientierung lässt sich aber weder an Aussehen noch an Stimme oder Kleidung ablesen."],
      ["Ein genauerer Blick hinter die Fassade eines Menschen kann hier schnell schlüssige Informationen liefern.", "Wirklich Gewissheit bringt nur ein offenes, respektvolles Gespräch – und die Antwort, die dir eine Frau selbst gibt."],
    ],
  },
  "/magazin/lecktuch": {
    modified: FACT_CHECK_MODIFIED,
    contentHtml: [
      // WHO-Factsheet „Sexually transmitted infections“: mehr als 1 Million heilbare STI-Neuinfektionen pro Tag.
      ["Alleine im letzten Jahr, wurden ca. 78 Millionen Neuerkrankungen registriert, wobei die Dunkelziffer größer ist.", "Nach Schätzungen der Weltgesundheitsorganisation infizieren sich weltweit jeden Tag mehr als eine Million Menschen mit einer heilbaren sexuell übertragbaren Infektion."],
      ["Ein Lecktuch ist ein dünnes, leicht durchsichtiges, Taschentuch großes Latexstück. Latex freie Tücher gibt es bisher leider noch nicht.", "Ein Lecktuch ist ein dünnes, leicht durchsichtiges, taschentuchgroßes Tuch, meist aus Latex. Für Menschen mit Latexallergie gibt es auch latexfreie Tücher, zum Beispiel aus Polyurethan oder anderen Kunststoffen."],
      ["Einziger Nachteil ist, dass es das Tuch bisher nur aus Latex gibt und somit für Menschen mit Latexallergie nicht geeignet ist.", "Wer eine Latexallergie hat, greift zu latexfreien Tüchern."],
    ],
  },
  "/magazin/girlflirt": {
    // Girlflirt.de ist heute eine Plattform mit kostenloser Basis und optionaler Premium-Mitgliedschaft (Girlflirt-FAQ).
    modified: FACT_CHECK_MODIFIED,
    description: [[/^Girlflirt\.de – Überblick .*$/, "Girlflirt im Test: Was das Frauennetzwerk kostenlos bietet, wofür du Premium brauchst, wie Profile geprüft werden und wie viele Frauen dort aktiv sind."]],
    contentHtml: [
      ["<td>kostenfrei</td>", "<td>Basis kostenlos, Premium optional</td>"],
      ["Kontakte ztu knüpfen", "Kontakte zu knüpfen"],
      ["Wichtig ist bei diesem Frauennetzwerk, dass die Anmeldung sowie die Nutzung komplett kostenlos ausfallen. Premium-Optionen sind ebenfalls nicht bekannt. Doch wie finanziert sich dann die Seite?", "Anmeldung, Profil und große Teile der Suche sind kostenlos. Wer anderen Mitgliedern Nachrichten schreiben möchte, braucht laut Anbieter eine optionale Premium-Mitgliedschaft; Nachrichten von Premium-Mitgliedern kannst du aber auch kostenlos lesen und beantworten."],
      ["Girlflirt ist eine werbefinanzierte Flirtseite für Frauen", "Girlflirt ist eine Flirtseite für Frauen"],
      ["und kann jeder Dame schreiben, die für sie interessant klingt.", "und kann – mit Premium-Mitgliedschaft – jeder Dame schreiben, die für sie interessant klingt."],
      ["</strong> umgeht dies, indem sich jede Nutzerin verifizieren muss. So wird gewährleistet, dass es sich fast ausschließlich um echte Personen handeln, die ihre wahren ", "</strong> begegnet dem laut Anbieter, indem ein Support-Team jede Neuanmeldung sowie neue Fotos und Texte auf Auffälligkeiten prüft. Zusätzlich kannst du dein Profil per Ausweis verifizieren lassen und erhältst dann einen Verifiziert-Status. Das erhöht die Chance, dass es sich um echte Personen handelt, die ihre wahre "],
      ["Zwar ist die Datingseite gänzlich kostenlos, doch dementsprechend fällt auch der Umfang aus.", "Zwar ist die Basis-Mitgliedschaft kostenlos, doch dementsprechend fällt auch ihr Umfang aus."],
      ["Bei Girlflirt findet jedoch nur eine automatische Authentifizierung per System statt. Demnach kann mit einigen Tricks auch ein Fake-Profil herbeigemogelt werden.", "Bei Girlflirt prüft laut Anbieter ein Support-Team neue Profile und Inhalte, die Verifizierung per Ausweis ist freiwillig. Ganz ausschließen lassen sich Fake-Profile damit trotzdem nicht."],
      ["<h2>Kosten</h2>", "<h2>Kosten</h2> <p>Die folgenden Premium-Preise stammen aus einer früheren Recherche und können sich geändert haben. Die aktuellen Preise und Laufzeiten siehst du vor der Buchung in deinem Mitgliedschaftsbereich.</p>"],
      ["<td>34,90€ €</td><td>34,90€ €</td>", "<td>34,90 €</td><td>34,90 €</td>"],
      ["Girlflirt wirbt nicht nur mit der kostenlosen Nutzung, sondern ist wirklich kostenlos. Demnach kann die Flirtseite hier eindeutig gelobt werden.", "Girlflirt lässt sich kostenlos ausprobieren: Anmeldung, Profil und Suche kosten nichts, für das Schreiben von Nachrichten brauchst du eine Premium-Mitgliedschaft."],
    ],
  },
  "/magazin/lesbenschaft": {
    modified: FACT_CHECK_MODIFIED,
    contentHtml: [
      ["Mittlerweile hat die Singlebörse in etwa 40000 aktive Mitglieder.", "Zum Zeitpunkt unseres Tests (Stand 2021) hatte die Singlebörse etwa 40.000 aktive Mitglieder."],
      ["dann beträgt der Monatspreis 13,90 Euro.", "dann beträgt der Monatspreis 13,30 Euro (39,90 Euro insgesamt)."],
      ["Diese Preise sind im Vergleich zu anderen Singlebörsen sehr fair, nicht überteuert, sowie transparent und keine Abzocke.", "Diese Preise (Stand 2021, die aktuellen Konditionen nennt der Anbieter vor der Buchung) waren im Vergleich zu anderen Singlebörsen fair und transparent."],
      [/Bei der lesbischen Singlebörse sind überwiegend junge Mitglieder angemeldet\. Doch auch (<a href="\/magazin\/sie-sucht-sie-ueber-50">)Userinnen mit einem Durchschnittsalter von 50 Jahren(<\/a>) sind zu finden\./, "Die meisten Mitglieder sind zwischen 35 und 50 Jahre alt, doch auch jüngere Frauen und $1Userinnen über 50$2 sind zu finden."],
      ["Shweierigkeit", "Schwierigkeit"],
    ],
  },
  "/magazin/bin-ich-lesbisch": {
    modified: FACT_CHECK_MODIFIED,
    contentHtml: [
      ["Fast jede Frau oder jeder Mann hatte schon einmal Gefühle für einen Angehörigen desselben Geschlechts.", "Viele Frauen und Männer hatten schon einmal Gefühle für jemanden desselben Geschlechts."],
      [/Das liegt daran, dass alle Menschen ein bestimmtes Maß an Veranlagung[\s\S]*?In diesem Fall war es nur eine Phase und du profitierst eventuell/, "Viele Mädchen haben in der Pubertät auch Fantasien oder Gefühle für andere Mädchen. Für manche ist das eine Phase des Ausprobierens, andere merken mit der Zeit, dass sie sich dauerhaft zu Frauen hingezogen fühlen. War es nur eine Phase, profitierst du eventuell"],
      ["Die anderen zehn Prozent, die ihre Orientierung nicht als vorübergehende Phase erkennen, merken spontan oder nach einiger Zeit, dass sie sich auf Dauer zu anderen Frauen oder sogar zu Frauen und Männer hingezogen fühlen. Das bedeutet, dass sie lesbisch oder bi sind und können sich als ", "Wer sich auf Dauer zu anderen Frauen oder zu Frauen und Männern hingezogen fühlt, merkt das oft spontan oder nach einiger Zeit. Dann bist du vielleicht lesbisch oder bi und kannst dich auch als "],
    ],
  },
  "/magazin/idahobit": {
    modified: FACT_CHECK_MODIFIED,
    // ICD-11: 2019 von der Weltgesundheitsversammlung beschlossen, in Kraft seit 1. Januar 2022.
    contentHtml: [["Transgeschlechtlichkeit gilt sogar erst seit 2018 nicht mehr als Krankheit.", "Transgeschlechtlichkeit wird sogar erst seit der neuen Klassifikation ICD-11 nicht mehr als psychische Störung geführt: Die WHO hat sie 2019 beschlossen, in Kraft ist sie seit dem 1. Januar 2022."]],
  },
  "/magazin/lesbian-day": {
    modified: FACT_CHECK_MODIFIED,
    contentHtml: [
      [">Lesbian Awareness Day</a> findet jedes Jahr am 26. April statt.", ">Lesbian Visibility Day</a> (Tag der lesbischen Sichtbarkeit) findet jedes Jahr am 26. April statt."],
      // CDC, National Intimate Partner and Sexual Violence Survey: 2010 Findings on Victimization by Sexual Orientation.
      ["Laut der CDC wurden fast die Hälfte aller US-amerikanischen lesbischen Frauen mindestens einmal Opfer häuslicher Gewalt.", "Laut einer Erhebung der US-Gesundheitsbehörde CDC aus dem Jahr 2010 haben rund 44 Prozent der lesbischen Frauen in den USA im Laufe ihres Lebens Vergewaltigung, körperliche Gewalt oder Stalking durch eine Partnerin oder einen Partner erlebt – bei heterosexuellen Frauen waren es 35 Prozent. Nicht in allen Fällen ging die Gewalt dabei von einer Frau aus."],
    ],
  },
  "/magazin/csd": {
    modified: FACT_CHECK_MODIFIED,
    contentHtml: [
      ["Viele waren anlässlich der Beerdigung der Schauspielerin Judy Garland unterwegs.", "Am selben Tag hatte in New York die Trauerfeier für die Schauspielerin Judy Garland stattgefunden, eine Ikone vieler Schwuler – ob das die Stimmung in jener Nacht beeinflusste, ist unter Historikern umstritten."],
      ["Fünf Tage währten die Unruhen.", "Die Unruhen zogen sich über mehrere Tage."],
      ["Eine der Ikonen der Zeit war Sylvia Rivera, die sich an der Gründung von Organisationen wie der Gay Liberation Front beteiligte. Die Dragqueen Marsha P. Johnson ist eine andere.", "Eine der Ikonen der Zeit war die trans Aktivistin Sylvia Rivera, die sich unter anderem in der Gay Liberation Front engagierte. Eine andere ist Marsha P. Johnson, die sich selbst als Drag Queen bezeichnete und heute als Ikone der trans Bewegung gilt. 1970 gründeten die beiden gemeinsam die Gruppe STAR (Street Transvestite Action Revolutionaries)."],
      ["Die Regenbogenfahne wurde zum Zeichen der Bewegung. Inspiriert wurde die Fahne von dem Song „Over the Rainbow“, den Judy Garland in dem Film „Der Zauberer von Oz“ singt.", "Die Regenbogenfahne, die der Künstler Gilbert Baker 1978 für die Pride-Parade in San Francisco entwarf, wurde zum Zeichen der Bewegung. Oft heißt es, der Song „Over the Rainbow“, den Judy Garland im Film „Der Zauberer von Oz“ singt, habe die Fahne inspiriert – belegt ist das nicht."],
    ],
  },
  "/magazin/lesbenleben-in-aegypten": {
    // Verwaltungsgericht Kairo, April 2015: Innenministerium darf homosexuelle Ausländer abschieben und die Einreise verweigern.
    // Strafverfolgung über das „Ausschweifungs“-Gesetz (Nr. 10/1961) und Moralvorschriften, nicht über ein ausdrückliches Verbot.
    modified: FACT_CHECK_MODIFIED,
    description: [[/^Lesbische Frauen haben es in Ägypten .*$/, "Lesbenleben in Ägypten: Warum Homosexualität dort nicht ausdrücklich verboten ist und trotzdem verfolgt wird – und wo lesbische Frauen Hilfe finden."]],
    contentHtml: [
      ["denn in Kairo hat das Verwaltungsgericht ein Urteil verkündet, das die Homosexualität nicht duldet. Dieser Beitrag beleuchtet das Lesbenleben in Ägypten und die damit verbundenen Herausforderungen. Was genau besagt das Urteil? Lesben dürfen abgeschoben werden. Darüber hinaus darf ihnen der Staat eine Wiedereinreise verbieten.", "denn der Staat geht hart gegen queere Menschen vor. 2015 entschied etwa ein Verwaltungsgericht in Kairo, dass das Innenministerium homosexuelle Ausländerinnen und Ausländer abschieben und ihnen die Wiedereinreise verbieten darf. Dieser Beitrag beleuchtet das Lesbenleben in Ägypten und die damit verbundenen Herausforderungen."],
      ["Obwohl Homosexualität in Ägypten nicht offiziell verboten ist, stigmatisieren die Heterosexuellen diejenigen, die gleichgeschlechtliche ", "Homosexualität ist in Ägypten zwar nicht ausdrücklich gesetzlich verboten. Die Behörden verfolgen queere Menschen aber regelmäßig auf Grundlage eines Gesetzes gegen „Ausschweifung“ und wegen angeblicher Verstöße gegen die öffentliche Moral. Zudem stigmatisieren viele Menschen diejenigen, die gleichgeschlechtliche "],
      ["Touristinnen sind von diesen harten Strafen weniger betroffen.", "Touristinnen sind von Strafverfolgung seltener betroffen."],
      ["Bisher gibt es keinen Fall der besagt, dass lesbische Besucherinnen Geld- oder Haftstrafen leisten mussten. Verhaftungen sowie Abschiebungen sind bereits vorgekommen.", "Fälle, in denen lesbische Besucherinnen zu Geld- oder Haftstrafen verurteilt wurden, sind uns nicht bekannt. Verhaftungen und Abschiebungen von Ausländerinnen und Ausländern wegen Homosexualität sind aber bereits vorgekommen."],
      ["Obwohl Transgender und Homosexualität in Ägypten nicht explizit verboten sind, handelt es sich dabei dennoch um heikle Tabu-Themen. Das liegt an der streng konservativen Haltung der Ägypter. Die strengen Landesgesetze verschärfen die Lage für Lesben. Allerdings ist weder die Diskriminierung sowie das Leid, das Lesben widerfährt, nicht zu übersehen.", "Obwohl Homosexualität und Transgeschlechtlichkeit in Ägypten nicht ausdrücklich verboten sind, handelt es sich dabei um heikle Tabuthemen. Das liegt an der streng konservativen Haltung großer Teile der Gesellschaft. Weil Behörden Gesetze gegen „Ausschweifung“ und zum Schutz der öffentlichen Moral gegen queere Menschen einsetzen, ist die Lage für Lesben zusätzlich riskant. Die Diskriminierung und das Leid, das Lesben widerfährt, sind nicht zu übersehen."],
    ],
  },
  // --- Princess Charming (de.wikipedia.org/wiki/Princess_Charming_(Fernsehsendung)): Staffel 1 lief 2021, Irina war die Princess.
  "/magazin/princess-charming-2020-staffel-1": {
    modified: FACT_CHECK_MODIFIED,
    title: [["Princess Charming – 2020 – Staffel 1", "Princess Charming – 2021 – Staffel 1"]],
    contentHtml: [
      ["Princess Charming 2020 Staffel 1 markierte den Start des Formats", "Princess Charming Staffel 1 aus dem Jahr 2021 markierte den Start des Formats"],
      ["Insgesamt nahmen an dieser Show 15 Teilnehmer statt. Und dabei handelte es sich unter anderem um:", "Princess war die damals 30-jährige Kölner Rechtsanwältin Irina Schlauch. Um sie warben 20 Kandidatinnen:"],
      [/<ul> <li><i>Irina – 30 Jahre<\/i><\/li>[\s\S]*?<\/ul>/, htmlList(PC1_CANDIDATES)],
      ["Insgesamt haben hier 15 Frauen versucht zu gewinnen.", "Insgesamt haben hier 20 Frauen um Irina geworben."],
      [/Schon in der ersten Folge gab es einen Konflikt[\s\S]*?zwischen Michelle und Irina anstand\./, "Für Schlagzeilen sorgten vor allem mehrere Ausschlüsse: Sonja und Ulle mussten die Show nach einer Auseinandersetzung verlassen, Britta schied wegen einer Verletzung aus. Richtige Emotionen gab es noch einmal im Finale, in dem Irina ihre Entscheidung treffen musste."],
      ["Doch wer genau hat am Ende gewonnen und wer wurde enttäuschend Zweiter. Dritter und mehr? All das in der kurzen Zusammenfassung:", "Wichtig zur Einordnung: Irina war die Princess, also die Frau, um die alle warben. Gewonnen hat am Ende die Kandidatin, für die sie sich im Finale entschied:"],
      [/<ul> <li><i>Irina – Gewinnerin<\/i><\/li>[\s\S]*?<\/ul>/, htmlList(["Irina Schlauch – die Princess der ersten Staffel", "Lou – im Finale von Irina gewählt und damit Gewinnerin"])],
      [/Wie bereits angesprochen gewann Irina die erste Staffel von Princess Charming\.[\s\S]*?(<a href="https:\/\/www\.rtl\.de\/[^"]*" rel="nofollow noopener noreferrer" target="_blank">)RTL<\/a> ausgestrahlt wurde, besteht die Hoffnung, dass das ein oder andere Paar noch zusammen ist\./, "Im Finale entschied sich Irina für Lou. Ein Paar wurden die beiden danach allerdings nicht, wie sie in der Wiedersehensfolge erzählten. Die Staffel lief ab Mai 2021 beim Streamingdienst TVNOW (heute $1RTL+</a>), im Herbst 2021 auch bei VOX, und wurde mit dem Deutschen Fernsehpreis ausgezeichnet."],
      ["in dem 15 Teilnehmerinnen um die Hauptperson warben", "in dem 20 Kandidatinnen um Princess Irina warben"],
      ["Am Ende setzte sich Irina als Gewinnerin durch.", "Am Ende entschied sich Irina für Lou."],
      ["Irina gewann die Staffel, doch", "Irina entschied sich am Ende für Lou, doch"],
      ["Doch im Jahr 2020 gab es noch kein spezielles Format für ", "Doch bis 2021 gab es im deutschen Fernsehen noch kein spezielles Format für "],
      ["Hier versuchten 15 Teilnehmer ihre Liebe zu finden.", "Hier warben 20 Kandidatinnen um Irina."],
      ["FAQ zu Princess Charming 2020 Staffel 1", "FAQ zu Princess Charming 2021 Staffel 1"],
      ["Im Artikel werden insgesamt 15 Teilnehmerinnen genannt, die in der ersten Staffel angetreten sind.", "In der ersten Staffel traten 20 Kandidatinnen an."],
      ["<li>15 Teilnehmerinnen kämpfen um die Hauptperson.</li>", "<li>20 Kandidatinnen werben um Princess Irina Schlauch.</li>"],
      ["<li>Irina wurde zur Gewinnerin gekürt.</li>", "<li>Im Finale entschied sich Irina für Lou.</li>"],
      ["Princess Charming – 2021 – Staffel 2</a>", "Princess Charming – 2022 – Staffel 2</a>"],
    ],
  },
  "/magazin/princess-charming-2021-staffel-2": {
    modified: FACT_CHECK_MODIFIED,
    title: [["Princess Charming – 2021 – Staffel 2", "Princess Charming – 2022 – Staffel 2"]],
    contentHtml: [
      ["die erst letztes Jahr auf ", "die 2022 bei "],
      [">RTL</a> ausgestrahlt wurde.", ">RTL+</a> ausgestrahlt wurde."],
      ["Princess Charming 2021 besonders gemacht hat", "Princess Charming 2022 besonders gemacht hat"],
      ["</a> aus dem Jahr 2020.", "</a> aus dem Jahr 2021."],
      ["Princess Charming 2021 bot einen", "Princess Charming 2022 bot einen"],
      ["TV-Shows für Lesben waren vor 2020 noch kein Thema.", "TV-Shows für Lesben waren vor 2021 noch kein Thema."],
    ],
  },
  "/magazin/princess-charming-2022-staffel-3": {
    modified: FACT_CHECK_MODIFIED,
    title: [["Princess Charming – 2022 – Staffel 3", "Princess Charming – 2023 – Staffel 3"]],
  },
  "/magazin/princess-charming-2024-staffel-4": {
    modified: FACT_CHECK_MODIFIED,
    contentHtml: [
      ["Staffel 4 wurde in Thailand gedreht und lief Sommer 2024.", "Staffel 4 wurde in Thailand gedreht und lief im Sommer 2024 bei RTL+ und RTLup."],
      [/<ul> <li><strong>Christine \(28\)<\/strong>[\s\S]*?<\/ul>/, htmlList(PC4_CANDIDATES)],
    ],
  },
  "/magazin/princess-charming-2025-staffel-5": {
    modified: FACT_CHECK_MODIFIED,
    contentHtml: [["Staffel 5 wurde in Thailand gedreht und lief Sommer/Herbst 2025.", "Staffel 5 wurde in Thailand gedreht und lief von Juli bis Oktober 2025 bei RTL+."]],
  },
  "/magazin/princess-charming-2026-staffel-6": {
    // RTL bestätigte Ende August 2026 gegenüber DWDL: derzeit keine weitere Staffel geplant, Comeback nicht ausgeschlossen.
    modified: FACT_CHECK_MODIFIED,
    description: [[/^Princess Charming 2026 – Staffel 6: .*$/, "Princess Charming Staffel 6: RTL plant nach fünf Staffeln vorerst keine neue Staffel. Was bekannt ist und was eine neue Princess mitbringen müsste."]],
    contentHtml: [
      ["Für Staffel 6 von Princess Charming gibt es bislang keine offiziell ausgestrahlte Episode. RTL sucht derzeit nach einer neuen Princess und etwa 20 Single-Kandidatinnen. Staffel 6 wird voraussichtlich 2026 ausgestrahlt.", "Eine Staffel 6 von Princess Charming wird es vorerst nicht geben. Zwar wurden 2026 zunächst eine neue Princess und rund 20 Single-Kandidatinnen gesucht, doch Ende August 2026 bestätigte RTL, dass derzeit keine weitere Staffel geplant ist. Ein endgültiges Aus soll das laut Sender aber nicht sein."],
      ["wird Staffel 6 ein Neuanfang sein – eine Chance für RTL, das Format zu erneuern und für eine neue Princess, die Liebe zu finden.", "wäre Staffel 6 ein Neuanfang gewesen – ob und wann er kommt, ist offen."],
      [/Staffel 6 ist noch nicht produziert worden\. RTL befindet sich derzeit in der Casting-Phase\. Das bedeutet:<\/p> <ul>[\s\S]*?<\/ul>/, `Staffel 6 wurde nicht produziert. Stand Oktober 2026 gilt:</p> ${htmlList(["RTL hat bestätigt, dass derzeit keine weitere Staffel geplant ist.", "Eine neue Princess wurde nicht vorgestellt.", "Ein Comeback schließt der Sender nicht aus."])}`],
      ["Das ist noch offen. RTL hat noch nicht bekannt gegeben, wer die nächste Princess wird. Spekulationen könnten sein:", "Solange keine neue Staffel geplant ist, bleibt das offen. Denkbar wäre zum Beispiel:"],
      ["<li>Möglicherweise wieder eine internationale Prinzessin (wie früher)</li> ", ""],
      ["Aber das sind nur Spekulationen. Die offizielle Ankündigung wird RTL machen, wenn es soweit ist.", "Aber das sind nur Gedankenspiele – eine Ankündigung von RTL gibt es nicht."],
      ["Staffel 6 wird voraussichtlich 2026 ausgestrahlt. Das genaue Datum ist noch nicht bekannt.", "Vorerst gar nicht: RTL hat im August 2026 bestätigt, dass derzeit keine weitere Staffel geplant ist."],
      ["Das ist noch nicht bekannt. RTL befindet sich derzeit in der Casting-Phase.", "Eine neue Princess wurde nicht vorgestellt, weil derzeit keine Staffel geplant ist."],
      ["Ja! RTL öffnet regelmäßig die Bewerbungen für Princess Charming. Interessierte Single-Frauen können sich auf der RTL-Website bewerben.", "Derzeit nicht, weil keine neue Staffel geplant ist. Holt RTL das Format zurück, dürfte es wieder ein Casting geben."],
      ["Das bleibt abzuwarten. Nach zwei Staffeln ohne klassische Gewinnerin könnte RTL eine neue Richtung einschlagen.", "Das bleibt offen, solange keine neue Staffel geplant ist."],
      ["Wahrscheinlich ja – das hat sich als Standard etabliert.", "Bisher waren es 18 bis 20 Kandidatinnen je Staffel; für eine mögliche neue Staffel gibt es keine Angaben."],
      ["Princess Charming ist nach fünf (fast sechs) Staffeln ein etabliertes Format.", "Princess Charming hat sich in fünf Staffeln als Format etabliert."],
      ["Staffel 6 wird zeigen, ob das Format sich weiterentwickelt oder auf bewährte Muster zurückgreift.", "Ob es eine Staffel 6 gibt, ist offen."],
    ],
  },
  "/magazin/8-gruende-warum-frauen-die-besseren-liebhaber-sind": {
    modified: FACT_CHECK_MODIFIED,
    description: [[/^Wer liebt eigentlich besser, Frauen oder Männer\? .*$/, "Wer liebt besser, Frauen oder Männer? 8 Gründe, warum Frauen die besseren Liebhaberinnen sind – mit einem Augenzwinkern, denn jeder Mensch ist anders."]],
    contentHtml: [
      ["Definitiv die Frauen!", "Wir finden: die Frauen – mit einem Augenzwinkern, denn natürlich ist jeder Mensch anders."],
      ["Frauen haben einen wesentlich höheren emotionalen Intelligenzquotienten als Männer. Das heißt, sie spüren jede Regung ihres Liebespartners. Und das ist nur von Vorteil für dessen Genuss!", "Vielen Frauen wird nachgesagt, besonders einfühlsam zu sein – auch wenn es natürlich ebenso einfühlsame Männer gibt. Wer sich gut in andere hineinversetzt, spürt jede Regung der Liebespartnerin. Und das ist nur von Vorteil für deren Genuss!"],
    ],
  },
  "/magazin/rosa-geld": {
    // 7,4 % (Dalia 2016) beziehen sich auf Erwachsene; die Rechnung überträgt sie auf Haushalte – nur Größenordnung.
    modified: FACT_CHECK_MODIFIED,
    contentHtml: [
      ["Wenn die für Deutschland ermittelte Prozentzahl aber stimmt, dann würde die gesamte deutsche ", "Eine grobe Überschlagsrechnung: Überträgt man diesen Anteil vereinfachend auf alle Haushalte – was nicht ganz korrekt ist, weil sich die 7,4 % auf Erwachsene beziehen und nicht auf Haushalte –, käme die deutsche "],
      ["und 40,4 Millionen deutschen Haushalten immerhin jährlich 90,3 Milliarden rosa Euro ausgeben, also prozentual noch mehr als die Amerikaner.", "und 40,4 Millionen deutschen Haushalten auf rund 90 Milliarden Euro im Jahr. Das ist keine belastbare Zahl, sondern nur eine Größenordnung."],
    ],
  },
  "/magazin/lesbido": {
    modified: FACT_CHECK_MODIFIED,
    contentHtml: [
      ["Lesbido verfügt nach Angaben des Betreibers über etwa 38.600 aktive Mitglieder.", "Lesbido verfügte nach Angaben des Betreibers (Stand 2018) über etwa 38.600 aktive Mitglieder."],
      ["Das Lesben-Portal ist kostenlos und wird durch Werbung finanziert.", "Das Lesben-Portal war zum Zeitpunkt unseres Tests (Stand 2018) kostenlos und wurde durch Werbung finanziert."],
    ],
  },
  "/magazin/venus7": {
    modified: FACT_CHECK_MODIFIED,
    contentHtml: [
      ["Mehr als 14 000 Mitglieder bereichern die Community", "Mehr als 14.000 Mitglieder (Stand 2019) bereichern die Community"],
      ["Eine Monatsmitgliedschaft beträgt 9,99€.", "Eine Monatsmitgliedschaft kostete zum Zeitpunkt unseres Tests (Stand 2019) 9,99 €."],
      ["<h3>Kosten</h3>", "<h3>Kosten (Stand 2019)</h3>"],
      ["<td>9,99 Euro €</td><td>9,99 Euro €</td>", "<td>9,99 €</td><td>9,99 €</td>"],
    ],
  },
  "/magazin/pinkcupid": {
    modified: FACT_CHECK_MODIFIED,
    contentHtml: [
      ["Mit mehr als 800.000 Nutzern sind die Chancen", "Mit mehr als 800.000 Nutzerinnen (Stand 2023, laut Anbieter) sind die Chancen"],
      ["Die Kosten für die Premium Mitgliedschaft betragen 29,95 Euro monatlich für Gold Mitgliedschaft. Die Platin Mitgliedschaft kostet pro Monat 34,98 Euro.", "Die Kosten für die Premium-Mitgliedschaft lagen zum Zeitpunkt unseres Tests (Stand 2023) bei 29,95 Euro monatlich für die Gold-Mitgliedschaft. Die Platin-Mitgliedschaft kostete pro Monat 34,98 Euro."],
      ["Die Zahlung für die Mitgliedschaft kann ganz unproblematisch per", "Die Zahlung für die Mitgliedschaft konnte zum Zeitpunkt unseres Tests (Stand 2023) per"],
    ],
  },
};

/** Hängt die Paare aus extra je Pfad und Feld hinter die vorhandenen Korrekturen. */
function mergeCorrections(base, extra) {
  const merged = { ...base };
  for (const [path, fields] of Object.entries(extra)) {
    const target = { ...(merged[path] ?? {}) };
    for (const [field, pairs] of Object.entries(fields)) target[field] = [...(target[field] ?? []), ...pairs];
    merged[path] = target;
  }
  return merged;
}

export const MAGAZINE_CORRECTIONS = Object.freeze(mergeCorrections({
  // Seobility „doppelte Überschrift“: Footer-Spalte heißt ebenfalls „Über uns“.
  "/magazin/redaktion": { contentHtml: [['<h2 id="ueber-uns">Über uns</h2>', '<h2 id="ueber-uns">Über unsere Redaktion</h2>']] },
  // Die Bio stand wortgleich auch auf er-sucht-ihn.de; auf Sie-sucht-Sie keine Verweise auf fremde Plattformen.
  "/magazin/christian-m-haas": {
    description: [[/^Christian M\. Haas – Experte im Hintergrund .*$/, "Christian M. Haas ist Singlebörsen-Experte und beschäftigt sich seit 2008 mit Online-Dating und dem Aufbau zielgruppenspezifischer Plattformen."]],
    contentHtml: [
      [/dazu gehören sowohl (<a href="\/">sie-sucht-sie\.de<\/a>) als auch das Gegenstück <a [^>]*>er-sucht-ihn\.de<\/a>\. Diese Formate haben/, "dazu gehört auch $1. Solche Formate haben"],
      ['<img alt="" height="300" loading="lazy" src="/magazine/media/4127-christian-m-haas-middle.png"', '<img alt="Christian M. Haas" height="300" loading="lazy" src="/magazine/media/4127-christian-m-haas-middle.png"'],
    ],
  },
  // --- On-Page-SEO (Semrush On Page SEO Checker, Export 2026-10-10).
  // Die WordPress-Descriptions waren abgeschnittene Textanfänge („…“); Google hat sie deshalb ersetzt.
  // Title ist zugleich H1 (max. 60 Zeichen), Description 110–155 Zeichen mit dem Zielkeyword.
  "/magazin/bin-ich-lesbisch": {
    title: [["Bin ich lesbisch? Ja, nein, vielleicht!?", "Bin ich lesbisch oder bi? Anzeichen, Test und Antworten"]],
    description: [[/^Du fragst dich, ob du lesbisch bist\? .*$/, "Bin ich lesbisch oder bi? Welche Anzeichen wirklich zählen, warum Gefühle für Mädchen kein Beweis sind und wie dir ein Selbsttest beim Sortieren hilft."]],
    contentHtml: [
      ['Du kannst einen <a href="/magazin/lesbisch">Lesbisch</a> Test machen.', 'Weiter unten findest du einen kleinen Lesbisch-Test mit Fragen zum Nachdenken.'],
      ['<a href="https://www.youtube.com/watch?v=bwwAEuVTvcY" rel="nofollow noopener noreferrer" target="_blank">Video auf YouTube ansehen</a></p></p>', SELFTEST_BIN_ICH_LESBISCH],
    ],
  },
  "/magazin/lesarion": {
    description: [[/^Lesarion – Überblick Was ist Lesarion\? .*$/, "Lesarion im Test: Was die Dating-Community für lesbische, bisexuelle und trans Frauen bietet, was sie kostet und wie gut der Fake-Schutz funktioniert."]],
  },
  "/magazin/lesben-sex": {
    title: [["Lesben Sex – so funktioniert es!", "Wie haben Lesben Sex? Stellungen, Vorurteile und Tipps"]],
    description: [[/^Lesbischer Sex sieht in den Köpfen .*$/, "Wie haben Lesben Sex? Wir räumen mit Vorurteilen auf und erklären, welche Stellungen und Praktiken beim Sex unter Frauen wirklich eine Rolle spielen."]],
  },
  "/magazin/lecktuch": {
    description: [[/^Was ist ein Lecktuch\? Safer Sex ist wichtig .*$/, "Was ist ein Lecktuch (Dental Dam)? So schützt das dünne Tuch beim Oralverkehr vor sexuell übertragbaren Infektionen – Anwendung, Vorteile und Tipps."]],
  },
  "/magazin/lesbische-serien": {
    description: [[/^Die fünf interessantesten und top Serien .*$/, "Die fünf besten lesbischen Serien: von Sense8 bis zu weiteren Produktionen mit lesbischen und queeren Charakteren – unsere Top 5 für deinen Serienabend."]],
  },
  "/magazin/sie-sucht-sie-ueber-50": {
    title: [["Sie sucht Sie über 50 – Wie lesbische Frauen ihr Glück im Alter finden", "Sie sucht Sie über 50 – Singlebörse ab 50 für Lesben"]],
    description: [[/^Das Dilemma der Partnersuche .*$/, "Partnersuche über 50 als lesbische Frau: Wie du in einer Singlebörse ab 50 und offline neue Kontakte knüpfst – Tipps für Late Bloomers und reife Frauen."]],
  },
  "/magazin/genderfluid": {
    description: [[/^Im breiten Spektrum der Geschlechtsidentitäten .*$/, "Genderfluid bedeutet, dass sich die Geschlechtsidentität verändert – mal männlich, mal weiblich, mal nicht-binär. Was das heißt und wie du darüber redest."]],
  },
  "/magazin/lesbische-szenebars-in-leipzig": {
    description: [[/^Leipzig – eine offene Stadt .*$/, "Lesbische Szenebars in Leipzig: Café Apart, Frau Krause, Richy Gaybar und weitere Treffpunkte, Partys und Events für lesbische und queere Frauen."]],
  },
  "/magazin/androgyn": {
    title: [["Was bedeuted androgyn?", "Was bedeutet androgyn? Bedeutung, Merkmale und Körperbau"]],
    description: [[/^Der begriffliche Ursprung .*$/, "Was bedeutet androgyn? Herkunft des Begriffs, typische Merkmale und Körperbau androgyner Frauen – und warum Androgynie nicht Intersexualität ist."]],
    contentHtml: [["bedeuted", "bedeutet"], ["Schaupielerin", "Schauspielerin"], ["Las Mann", "als Mann"]],
  },
  "/magazin/pansexualitaet": {
    title: [["Was ist Pansexualität?", "Pansexuell: Was bedeutet Pansexualität? Definition & Flagge"]],
    description: [[/^Wissenswertes über Pansexualität .*$/, "Was heißt pansexuell? Definition, Unterschied zu bisexuell, die pansexuelle Flagge und eine Antwort auf die Frage „Bin ich pansexuell?“ – einfach erklärt."]],
    contentHtml: [["<h2>Flagge</h2>", "<h2>Die pansexuelle Flagge</h2>"], ["LGTB", "LGBT"]],
  },
  "/magazin/lesbido": {
    description: [[/^Lesbido – Überblick .*$/, "Lesbido im Test: Was das kostenlose, werbefinanzierte Lesbenportal bietet, wie Registrierung, Profil und Partnervorschläge funktionieren und was fehlt."]],
  },
  "/magazin/lgbt": {
    title: [["LGBT – Gesellschaftliches und Bedeutung", "LGBT Bedeutung: Was heißt lesbisch, schwul, bi und trans?"]],
    description: [[/^LGBT und die gesellschaftliche Bedeutung .*$/, "LGBT Bedeutung einfach erklärt: Die Abkürzung steht für Lesbian, Gay, Bisexual und Transgender – Entstehung, Geschichte und was LGBTQ+ heute umfasst."]],
  },
  "/magazin/intersexuell": {
    title: [["Was ist Intersexualität?", "Was ist Intersexualität? Bedeutung, Ursachen und Merkmale"]],
    description: [[/^Was ist intersexuell\? Wir klären auf\. .*$/, "Intersexuell bedeutet, dass körperliche Geschlechtsmerkmale nicht eindeutig männlich oder weiblich sind. Ursachen, Formen und was das für Betroffene heißt."]],
    // Fachliche Fehler der WordPress-Vorlage (2026-10-18): Nebennierenrinde statt „Nierenrinde“, kein „Hermaphroditismus-Virus“,
    // Transidentität nicht als psychische Störung (ICD-11: Geschlechtsinkongruenz), „Zwitter“ als abwertend gekennzeichnet.
    contentHtml: [
      [/Dieses Phänomen bezeichnen Wissenschaftler als [^<]*?Ursachen, Symptome und Unterschiede\./, "Man spricht dann von Intersexualität oder Intergeschlechtlichkeit. Hier erfährst du, welche Formen es gibt und wie sich Intersexualität von Transidentität unterscheidet."],
      [/<p>Aus den verschiedensten Gründen kann es während einer Schwangerschaft[\s\S]*?Doch wie kann so etwas passieren\?<\/p>/, "<p>Die geschlechtliche Entwicklung eines Kindes beginnt schon im Mutterleib. Bei manchen Kindern verläuft sie anders als bei der Mehrheit – Fachleute sprechen von Varianten der Geschlechtsentwicklung. Manchmal hat ein Neugeborenes körperliche Merkmale, die nicht eindeutig weiblich oder männlich sind. In anderen Fällen wird ein Kind zunächst als Mädchen oder Junge eingetragen, und erst in der Pubertät oder später zeigt sich, dass auch Merkmale des anderen Geschlechts vorhanden sind. Doch wie kann so etwas passieren?</p>"],
      [/Bei den Chromosomen bestimmen die X und Y-Chromosomen das Geschlecht\.[^<]*?auf einen Jungen schließen\./, "Meist haben Mädchen zwei X-Chromosomen und Jungen ein X- und ein Y-Chromosom."],
      [/<p>Bei intersexuellen Menschen sind meist nur entweder[\s\S]*?als Zwitter bezeichnet werden\.<\/p>/, "<p>Bei intersexuellen Menschen passen diese Ebenen nicht eindeutig zusammen: Chromosomen, Hormone, innere und äußere Geschlechtsorgane können unterschiedlich stark weiblich oder männlich ausgeprägt sein. Sehr selten sind sowohl Eierstock- als auch Hodengewebe vorhanden. Früher sprach man von „Zwittern“ oder „Hermaphroditen“ – viele intergeschlechtliche Menschen empfinden diese Begriffe heute als abwertend.</p>"],
      ["Betroffene werden nicht selten den Transgendern oder transsexuellen zugeordnet.", "Intergeschlechtliche Menschen werden nicht selten mit trans Menschen verwechselt."],
      [/<p>Dies sind Menschen, die bei der Geburt einem Geschlecht zugeordnet werden[\s\S]*?auch intersexuell\.<\/p>/, "<p>Trans Menschen haben eine <a href=\"/magazin/geschlechtsidentitaet\">Geschlechtsidentität</a>, die nicht zu dem Geschlecht passt, das ihnen bei der Geburt zugeordnet wurde. Ihr Körper ist dabei in der Regel nicht intergeschlechtlich – es geht um das innere Wissen, welchem Geschlecht man angehört. Wie eine Person ihre Transition gestaltet, ist sehr unterschiedlich: Manche ändern Namen und Auftreten, andere entscheiden sich zusätzlich für Hormone oder Operationen, wieder andere nicht. Trans und intergeschlechtlich zu sein, schließt sich aber nicht aus.</p>"],
      [/<p>Zu den Transgendern gehören gewissermaßen auch Transvestiten\.[\s\S]*?Perücke auf\.<\/p>/, "<p>Davon zu unterscheiden ist Crossdressing: Menschen tragen Kleidung, Make-up oder Frisuren, die gesellschaftlich einem anderen Geschlecht zugeschrieben werden, ohne dass sich ihre Geschlechtsidentität ändert. Der ältere Begriff „Transvestit“ gilt heute als veraltet.</p>"],
      [/<h3>Transsexuelle:<\/h3>(\s*)<p>Diese wurden bei der Geburt[\s\S]*?Transsexualismus\.<\/p>/, "<h3>Transsexuell:</h3>$1<p>Der Begriff „transsexuell“ ist älter und wird heute meist durch „trans“ oder „transident“ ersetzt. Früher galt Transsexualität medizinisch als psychische Störung („Transsexualismus“). Das hat sich geändert: In der aktuellen internationalen Klassifikation der Weltgesundheitsorganisation (ICD-11) heißt es „Geschlechtsinkongruenz“ und gehört nicht mehr zu den psychischen Erkrankungen. Wer eine körperliche Angleichung wünscht, kann sie medizinisch begleiten lassen – ein Muss ist sie nicht.</p>"],
      ["<p>Folgende Diagnosen stellen Ärzte bei der Untersuchung von betroffenen:</p>", "<p>Es gibt viele verschiedene Formen. Zu den bekannteren gehören:</p>"],
      ["Ursache ist eine gestörte Nierenrinden-Funktion.", "Ursache ist eine angeborene Störung der Hormonbildung in der Nebennierenrinde."],
      ["Bei nicht Behandlung erfolgt eine Vermännlichung der äußeren Geschlechtsorgane.", "Schon vor der Geburt kann das zu einer Vermännlichung der äußeren Geschlechtsorgane führen."],
      [/(<strong>2\. Das Androgen-Resistenz-Syndrom:<\/strong>)[\s\S]*?Eileiter sind nicht ausgebildet\.<\/p>/, "$1 Die Person hat einen männlichen Chromosomensatz (XY) und Hoden, die meist im Bauchraum oder in der Leiste liegen. Die Körperzellen reagieren aber nicht oder nur teilweise auf männliche Hormone. Bei der kompletten Form entwickelt sich äußerlich ein weiblicher Körper, Gebärmutter und Eileiter fehlen jedoch, und Scham- und Achselbehaarung sind oft nur schwach oder gar nicht ausgeprägt.</p>"],
      ["Diese entwickeln sich im Falle von Gonaden-Dysgenesien verkehrt oder gar nicht. Die Folgen können sein: Kleinwuchs der Geschlechtsorgane oder Unfruchtbarkeit.", "Bei einer Gonaden-Dysgenesie entwickeln sie sich nur unvollständig oder gar nicht. Ohne Hormonbehandlung bleibt dann oft die Pubertät aus, häufig ist auch die Fruchtbarkeit eingeschränkt."],
      [/<p><strong>4\. Der Hermaphroditismus-Virus:<\/strong>[\s\S]*?in den meisten Fällen männlich\.<\/p>/, "<p><strong>4. Ovotestikuläre Variante (früher „echter Hermaphroditismus“):</strong> Sehr selten ist sowohl Eierstock- als auch Hodengewebe vorhanden. Die äußeren Geschlechtsorgane können dann sehr unterschiedlich aussehen, zum Beispiel zwischen Klitoris und Penis liegend. Die Ursachen sind verschieden und nicht immer bekannt. Am häufigsten liegt ein weiblicher Chromosomensatz vor.</p>"],
    ],
  },
  "/magazin/queer": {
    // Maschinell übersetzte Vorlage (2026-10-18): abwertender Abschnitt „Queer-Feminismus“ sachlich ersetzt,
    // Ich-Erzählung und Sie-Anrede an die Du-Form der Seite angepasst, Kraftausdruck entfernt.
    contentHtml: [
      ["was, wie Sie feststellen werden, eine ganze Menge", "was eine ganze Menge"],
      ["Wahrscheinlich haben Sie schon einmal gehört", "Wahrscheinlich hast du schon einmal gehört"],
      ["Schwerpunkt in Ihrem Leben ist.", "Schwerpunkt im eigenen Leben ist."],
      [/was es zu einer Art [^<]*?abwertend verwenden würden\./, "was dem Begriff eine selbstbewusste, trotzige Note gegenüber all jenen gab, die ihn abwertend benutzten."],
      [/<p>Wenn Sie mir eine persönliche Ablenkung gestatten:[\s\S]*?danach fragen müssen\.<\/p>/, "<p>Viele, die „queer“ noch als Beleidigung kennengelernt haben, nutzen den Begriff heute bewusst selbst: Er drückt Solidarität mit dem gesamten Regenbogenspektrum aus und lässt offen, wie man sich genau definiert. Wer mehr wissen möchte, kann nachfragen.</p>"],
      ["<p>Also gut, spielen wir dieses Spiel.</p>", "<p>Ein genauerer Blick auf die Abkürzung:</p>"],
      [" Es versteht sich von selbst, dass das schlechter ist.", ""],
      [/<p>Also ist es richtig, das [\s\S]*?über den Rest\.<\/p>/, "<p>Viele verwenden deshalb lieber einfach „queer“: Der Begriff ist kurz, eingängig und stellt keine Identität über die anderen.</p>"],
      [/<p>Sie müssen nicht persönlich ein bestimmtes Akronym sagen[\s\S]*?inklusiv zu sein\.<\/p>/, "<p>Welche Abkürzung du verwendest, bleibt dir überlassen: Viele sagen LGBT und schreiben LGBT+ oder LGBTQ+. Die Kürzel werden länger, damit sich möglichst alle Menschen der Community mitgemeint fühlen.</p>"],
      [/(<h2>Queer-Feminismus<\/h2>)[\s\S]*?Feministen anzieht\.<\/p>/, "$1 <p>Seit den Anfängen der modernen Frauenbewegung in den 1960er- und 1970er-Jahren engagieren sich lesbische Frauen auch feministisch – viele verstanden ihr Lesbischsein zugleich als Widerstand gegen patriarchale Strukturen.</p> <p>Der Queerfeminismus verbindet beide Anliegen: Er setzt sich für die Gleichberechtigung aller Geschlechter ein und hinterfragt starre Rollenbilder ebenso wie die Vorstellung, es gebe nur zwei Geschlechter. Dazu gehört, dass Menschen sich kleiden und ausdrücken dürfen, wie es zu ihnen passt.</p> <p>Innerhalb der feministischen Bewegung wurde darüber auch gestritten, etwa in den Debatten der 1980er-Jahre über Sexualität. Gemeinsam ist den meisten Strömungen das Ziel, Benachteiligung wegen des Geschlechts oder der sexuellen Orientierung abzubauen.</p>"],
      [/Anbei finden Sie eine andere Statistik darüber, wie sich Menschen in Deutschland in Bezug auf ihre LGBTQA\+ Identität identifizieren\./, "Eine weitere Erhebung zeigt, wie sich Menschen in Deutschland in Bezug auf ihre LGBTQA+-Identität einordnen."],
    ],
  },
  "/magazin/maskulin-feminin": {
    title: [["Maskulin, Feminin, Neutrum – Das hat es mit diesen Begriffen auf sich!", "Maskulin, feminin, neutrum: Was die Begriffe bedeuten"]],
    description: [[/^Maskulin, feminin, neutrum\. Dies sind drei Wörter.*$/, "Maskulin, feminin, neutrum: Was die Begriffe in der queeren Community bedeuten, was sie mit Feminismus zu tun haben und wie du respektvoll damit umgehst."]],
  },
  "/magazin/lesbenflagge": {
    title: [["Die Lesbenflagge – Wissenswertes zur Regenbogenfahne", "Lesbenflagge: Bedeutung, Farben und die Regenbogenfahne"]],
    description: [[/^Wissenswertes Eine Fahne als Symbol .*$/, "Die Lesbenflagge erklärt: Was die Regenbogenfahne für Lesben bedeutet, warum es Varianten mit sechs oder acht Streifen gibt und woher das Symbol stammt."]],
  },
}, FACT_CORRECTIONS_2026_10_22));

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
