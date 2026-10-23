import { questions } from './orientation-selftest.mjs';

const sources = links => `<details class="magazine-sources"><summary>Quellen &amp; Einordnung</summary><div class="magazine-sources__body"><p>Redaktionell überarbeitet am 23. Oktober 2026. Die folgenden Quellen erläutern die Begriffe; Beispiele und Reflexionsfragen sind eigene redaktionelle Hilfen.</p><ul>${links.map(([url, text]) => `<li><a href="${url}" rel="noopener noreferrer" target="_blank">${text}</a></li>`).join('')}</ul></div></details>`;

const feminin = `
<p>Feminin bedeutet im allgemeinen Sprachgebrauch weiblich oder weiblich wirkend, maskulin männlich oder männlich wirkend. In der Grammatik bezeichnen feminin, maskulin und neutrum dagegen das Genus eines Wortes. Ob Du gerade über Kleidung oder über einen Artikel im Deutschen sprichst, macht also einen wichtigen Unterschied.</p>
<h2>Was bedeutet feminin?</h2>
<p>Feminin kann eine Erscheinung, einen Stil oder ein Auftreten beschreiben, das gesellschaftlich als weiblich gelesen wird. Wenn jemand einen Look feminin nennt, meint die Person beispielsweise Schnitt, Schmuck oder Styling. Welche Merkmale so wahrgenommen werden, hängt vom Umfeld ab und ist keine Vorschrift für Frauen.</p>
<p>Du musst weder Kleider noch Make-up mögen, um eine Frau zu sein. Und ein femininer Stil sagt nicht, zu wem Du Dich hingezogen fühlst. Eine lesbische Frau kann feminin auftreten, genauso wie eine heterosexuelle, bisexuelle oder queere Frau.</p>
<h2>Was bedeutet maskulin?</h2>
<p>Maskulin beschreibt häufig Merkmale, die als männlich wahrgenommen werden. Bei Kleidung können damit etwa ein gerader Schnitt oder ein klassischer Anzug gemeint sein. Das sind Beispiele für eine gesellschaftliche Lesart, keine objektive Einteilung von Menschen.</p>
<p>Eine maskuline Frau ist deshalb nicht weniger Frau. Aus ihrem Auftreten lässt sich weder ihre Orientierung noch ihre Rolle in einer Beziehung ableiten. Auch Begriffe wie „der männliche Part“ helfen beim Kennenlernen wenig: Frag lieber nach den Interessen und Wünschen Deines Gegenübers.</p>
<h2>Feminin, maskulin und neutrum in der Grammatik</h2>
<p>Beim grammatischen Geschlecht geht es um Wörter. Im Deutschen unterscheidet man drei Genera:</p>
<ul><li>Maskulin: der Tisch, der Abend.</li><li>Feminin: die Lampe, die Begegnung.</li><li>Neutrum: das Buch, das Gespräch.</li></ul>
<p>Die Artikel helfen Dir, das Genus zu erkennen. Es beschreibt nicht automatisch das Geschlecht einer Person oder eine Eigenschaft des Gegenstands. „Neutrum“ ist hier ein grammatischer Begriff und kein drittes Persönlichkeitsprofil neben feminin und maskulin.</p>
<h2>Stil, Identität und Orientierung unterscheiden</h2>
<ul><li>Geschlechtsausdruck: Wie Du Dich etwa durch Kleidung oder Styling zeigst und wie andere das lesen.</li><li>Geschlechtsidentität: Wie Du Dein eigenes Geschlecht erlebst und beschreibst.</li><li>Sexuelle Orientierung: Zu wem Du Dich hingezogen fühlst.</li></ul>
<p>Diese Ebenen können in Deiner eigenen Geschichte zusammenhängen. Von einer Ebene lässt sich aber nicht zuverlässig auf die andere schließen. Ein femininer Mann ist nicht automatisch schwul; eine maskuline Frau ist nicht automatisch lesbisch.</p>
<h2>Kann ich feminin und maskulin zugleich sein?</h2>
<p>Du kannst Elemente kombinieren, Deinen Stil wechseln oder ganz auf diese Beschreibung verzichten. Ein Anzug mit auffälligen Ohrringen oder ein Kleid mit derben Schuhen muss keine Botschaft über Deine Identität sein. Für eine Mischung weiblich und männlich gelesener Elemente wird auch <a href="/magazin/androgyn">androgyn</a> verwendet.</p>
<p>Nutze solche Wörter am besten als Angebot zur Selbstbeschreibung. Wenn Du eine andere Person beschreibst, orientiere Dich daran, welche Begriffe sie selbst verwendet. Ein Kompliment wie „Dein Outfit gefällt mir“ braucht keine Einordnung ihres Geschlechts.</p>
<h2>Häufige Fragen</h2>
<h3>Ist feminin dasselbe wie feministisch?</h3><p>Nein. Feminin beschreibt hier einen wahrgenommenen Ausdruck; feministisch bezieht sich auf Anliegen der Gleichberechtigung. Beides kann zusammenkommen, bezeichnet aber unterschiedliche Dinge.</p>
<h3>Was bedeutet eine feminine Ausstrahlung?</h3><p>Damit wird eine Wirkung beschrieben, die jemand als weiblich empfindet. Was genau gemeint ist, bleibt subjektiv. Es gibt keine Liste von Eigenschaften, die alle Frauen erfüllen müssten.</p>
<h3>Erkennt man lesbische Frauen an einem maskulinen Stil?</h3><p>Nein. Frisur und Kleidung erlauben keinen verlässlichen Schluss auf die Orientierung. Wenn Du eigene Gefühle sortieren möchtest, findest Du im Artikel <a href="/magazin/bin-ich-lesbisch">„Bin ich lesbisch oder bi?“ mit Selbsttest</a> Fragen zum Nachdenken.</p>
${sources([['https://www.duden.de/rechtschreibung/feminin','Duden: feminin'],['https://www.duden.de/rechtschreibung/maskulin','Duden: maskulin'],['https://www.goethe.de/ins/de/de/prf/grm.html','Goethe-Institut: Artikel, Pronomen und die drei Genera'],['https://queer-lexikon.net/2017/06/15/androgyn/','Queer Lexikon: Androgyn']])}`;

const androgyn = `
<p>Androgyn beschreibt häufig ein Erscheinungsbild, das weiblich und männlich gelesene Elemente verbindet oder sich dazwischen bewegt. Das kann Kleidung, Styling oder Auftreten betreffen. Manche Menschen verwenden androgyn auch als Beschreibung ihrer Geschlechtsidentität.</p>
<h2>Was bedeutet androgyn?</h2>
<p>Der Begriff hat griechische Wurzeln für Mann und Frau. Heute begegnet er Dir etwa in der Mode, in Gesprächen über Geschlechtsausdruck oder als persönliche Selbstbeschreibung. Wenn jemand einen Look androgyn nennt, ist damit zunächst die Wirkung gemeint, nicht automatisch das Geschlecht der Person.</p>
<p>Für Dich kann der Begriff nützlich sein, wenn Du Dich in einer eindeutigen Einteilung in weiblich oder männlich wirkendes Styling nicht wiederfindest. Du musst ihn aber nicht verwenden, nur weil andere Deinen Stil so wahrnehmen.</p>
<h2>Androgyne Frauen: Ausdruck ohne feste Schablone</h2>
<p>Eine androgyne Frau kann sich als Frau verstehen und zugleich mit Ausdrucksformen spielen, die andere unterschiedlichen Geschlechtern zuordnen. Das nimmt ihr nichts von ihrer Identität. Ebenso können Menschen anderer Geschlechter androgyn auftreten.</p>
<p>Ob jemand lesbisch, bi, hetero oder queer ist, lässt sich daraus nicht ablesen. Beim Dating hilft eine offene Frage zu Interessen und Wünschen weiter als eine Vermutung anhand des Aussehens. Mehr dazu liest Du bei <a href="/magazin/maskulin-feminin">feminin und maskulin: Bedeutung und Unterschiede</a>.</p>
<h2>Wie kann ein androgyner Look aussehen?</h2>
<p>Stil lässt sich ausprobieren, ohne den eigenen Körper verändern zu müssen. Drei Ideen als Anregung, nicht als Regel:</p>
<ul><li>Silhouetten kombinieren: etwa ein weit geschnittenes Hemd mit einer schmalen Hose oder eine gerade Jacke über einem Kleid.</li><li>Mit Details spielen: Schmuck, Schuhe, Frisur oder Make-up können einen Look verändern, ohne ihn eindeutig einzuordnen.</li><li>Auf Dein Wohlgefühl achten: Wähle Stücke, in denen Du Dich bewegen und wiedererkennen kannst. Ein Stil muss keine Erwartungen anderer erfüllen.</li></ul>
<p>Es gibt weder eine Pflicht zur Kurzhaarfrisur noch eine bestimmte Figur als Voraussetzung. Auch ein täglich wechselnder Stil ist möglich.</p>
<h2>Androgynes Aussehen und Körperbau</h2>
<p>Wenn Menschen ein Gesicht oder einen Körper androgyn nennen, beschreiben sie ihre Wahrnehmung. Das ist keine medizinische Diagnose und keine Messung. Es gibt keinen allgemein verbindlichen „androgynen Körperbau“, den Du erreichen müsstest.</p>
<p>Körperformen sind vielfältig. Empfehlungen zum Abnehmen, Muskelaufbau oder zur Veränderung von Körpermerkmalen lassen sich aus dem Begriff nicht ableiten. Für Deinen Ausdruck darfst Du mit Kleidung und Styling experimentieren, ohne Deinen Körper als Problem zu behandeln.</p>
<h2>Androgyn, nichtbinär und inter: die Unterschiede</h2>
<ul><li>Androgyn bezieht sich oft auf den Ausdruck; manche nutzen es auch für ihre Identität.</li><li>Nichtbinär ist eine Selbstbeschreibung für eine Geschlechtsidentität außerhalb einer ausschließlich männlichen oder weiblichen Zuordnung.</li><li>Inter bezieht sich auf angeborene Variationen körperlicher Geschlechtsmerkmale.</li></ul>
<p>Die Begriffe sind keine Synonyme. Ein androgyner Stil macht Dich nicht automatisch nichtbinär oder inter. Wenn Du über eine Person sprichst, verwende ihre eigene Bezeichnung statt ihr eine zuzuschreiben.</p>
<h2>Häufige Fragen zu Androgynie</h2>
<h3>Ist androgyn eine sexuelle Orientierung?</h3><p>Nein. Androgyn beschreibt häufig Ausdruck oder eine Selbstbeschreibung des Geschlechts, nicht, zu wem sich jemand hingezogen fühlt. Für eigene Fragen zur Anziehung gibt es unseren <a href="/magazin/bin-ich-lesbisch">Selbsttest „Bin ich lesbisch oder bi?“</a>.</p>
<h3>Kann ich androgyn sein und mich als Frau verstehen?</h3><p>Ja. Du kannst den Begriff für Deinen Stil nutzen, ohne Deine Identität als Frau infrage zu stellen. Entscheidend ist, welche Beschreibung sich für Dich passend anfühlt.</p>
<h3>Wie wird „androgyn“ ausgesprochen?</h3><p>Die Betonung liegt auf der letzten Silbe: andro-GÜN. Formen wie „eine androgyne Frau“ oder „mit einem androgynen Look“ sind gebeugte Formen desselben Adjektivs.</p>
${sources([['https://www.bpb.de/themen/gender-diversitaet/geschlechtliche-vielfalt-trans/500903/androgynitaet-androgyn/','Bundeszentrale für politische Bildung: Androgynität / Androgyn'],['https://queer-lexikon.net/2017/06/15/androgyn/','Queer Lexikon: Androgyn'],['https://queer-lexikon.net/2017/06/08/inter/','Queer Lexikon: Intergeschlechtlich'],['https://queer-lexikon.net/2017/06/08/nichtbinaer/','Queer Lexikon: Nichtbinär'],['https://www.duden.de/rechtschreibung/androgyn','Duden: androgyn']])}`;

const selftest = `
<p>„Bin ich lesbisch oder bi?“ Wenn Dich diese Frage beschäftigt, musst Du nicht sofort eine eindeutige Antwort haben. Der interaktive Selbsttest oben hilft Dir, eigene Angaben zu Gefühlen und Wünschen zusammenzufassen. Er weist Dir keine Orientierung zu.</p>
<h2>Bin ich lesbisch? Welche Gefühle können eine Rolle spielen?</h2>
<p>Vielleicht warst Du schon in eine Frau verliebt, wünschst Dir körperliche Nähe zu Frauen oder kannst Dir eine Beziehung mit einer Frau vorstellen. Solche eigenen Empfindungen können ein Anlass sein, genauer hinzuschauen. Du brauchst keine bestimmte Datingerfahrung, damit Deine Gefühle zählen.</p>
<p>Ein einzelner Gedanke, ein Traum oder die Bewunderung einer Frau legt Deine Orientierung nicht fest. Ebenso wenig tun das Kleidung, Hobbys oder Frisur. Achte darauf, was Du selbst empfindest, statt Dich mit Klischees zu vergleichen.</p>
<h2>Lesbisch, bi oder noch offen: Begriffe können helfen</h2>
<p>Lesbisch kann für Frauen passen, die sich zu Frauen hingezogen fühlen. Bisexuell kann Anziehung zu mehr als einem Geschlecht beschreiben. Nicht jede Person erlebt Anziehung gleich oder möchte dafür ein Label verwenden. Welcher Begriff Dir hilft, bestimmst Du selbst.</p>
<p>Romantische Gefühle, körperliche Anziehung und der Wunsch nach einer Beziehung müssen sich nicht immer gleich anfühlen. Genau deshalb fragt der Test diese Bereiche getrennt ab. Eine offene Auswertung bedeutet nicht, dass mit Deinen Antworten etwas falsch ist.</p>
<h2>Die acht Testfragen zum Nachlesen</h2>
<p>Du kannst Dir diese Fragen auch ohne die interaktive Auswertung stellen. „Weiß ich noch nicht“ ist eine mögliche Antwort, kein fehlgeschlagener Test.</p>
<ol>${questions.map(question => `<li>${question.text}</li>`).join('')}</ol>
<h2>Was sagt das Testergebnis aus?</h2>
<p>Es fasst zusammen, welche Anziehung oder Beziehungswünsche Du in den ersten sechs Antworten beschrieben hast. Die beiden letzten Fragen helfen bei den nächsten Schritten. Die Regeln sind redaktionell festgelegt und nicht wissenschaftlich validiert. Der Test misst weder einen „Lesbisch-Anteil“ noch eine Wahrscheinlichkeit.</p>
<p>Du kannst Antworten ändern, später erneut nachdenken oder auf ein Label verzichten. Ein Ergebnis ist eine Momentaufnahme Deiner Angaben. Die passenden Worte für Deine Orientierung kann es Dir nicht vorschreiben.</p>
<h2>Deine Antworten bleiben bei Dir</h2>
<p>Die Auswertung erfolgt im Browser. Es gibt kein Testkonto und keine Übermittlung Deiner Antworten oder Ergebnisse an uns. Sie werden nicht in Cookies, im lokalen Speicher oder in der URL abgelegt. Beim Neuladen oder beim Löschen im Test werden sie verworfen. Die allgemeine Verarbeitung beim Seitenbesuch erläutert die <a href="https://www.sie-sucht-sie.de/datenschutz.html">Datenschutzerklärung</a>.</p>
<p>Beim Teilen kannst Du zunächst die Vorschau lesen. Standardmäßig enthält sie eine Einladung und den allgemeinen Testlink. Nur wenn Du es ausdrücklich auswählst, wird der Ergebnistext ergänzt und auf unterstützten Geräten Deine Ergebniskarte als Bild angehängt. Die Karte kannst Du auch direkt als Bild speichern. Einzelne Antworten werden nicht geteilt. Bedenke, dass Empfängerinnen und Empfänger geteilte Texte und Bilder weitergeben können.</p>
<h2>Wie geht es nach dem Selbsttest weiter?</h2>
<p>Vielleicht hilft Dir ein privates Tagebuch, ein vertrautes Gespräch oder einfach Zeit. Du schuldest niemandem ein Coming-out. Entdecke in Deinem Tempo, welche Begegnungen, Gefühle und Wünsche sich für Dich gut anfühlen.</p>
<p>Weitere Geschichten und praktische Anregungen findest Du in unseren Artikeln zum <a href="/magazin/coming-out">Coming-out</a> und zum <a href="/magazin/spaetes-coming-out-frauen">späten Coming-out bei Frauen</a>. Es gibt keinen Termin, bis zu dem Du Dich festlegen müsstest.</p>
<h2>Häufige Fragen zum Lesbisch-Test</h2>
<h3>Kann ein Online-Test sicher sagen, ob ich lesbisch bin?</h3><p>Nein. Er kann Deine Antworten ordnen und zum Nachdenken anregen. Deine Orientierung ist kein Prüfungsfach mit richtigen oder falschen Antworten.</p>
<h3>Kann ich bi sein, wenn ich noch nie mit einer Frau zusammen war?</h3><p>Beziehungserfahrungen sind keine Voraussetzung, um die eigene Anziehung zu beschreiben. Du musst Dich nicht auf ein Date einlassen, um etwas zu beweisen.</p>
<h3>Muss ich mein Ergebnis teilen?</h3><p>Nein. Du kannst den Test vollständig für Dich nutzen. Der Teilen-Dialog öffnet sich erst auf Deinen Klick, und Du entscheidest, was Du weitergibst.</p>
${sources([['https://www.liebesleben.de/fuer-alle/online-beratung/haeufige-fragen-zu-vielfalt/','LIEBESLEBEN: Hintergrundinformationen zu sexueller Orientierung und Vielfalt']])}`;

export const identityGuides = {
  '/magazin/maskulin-feminin': { title: 'Feminin und maskulin: Bedeutung, Beispiele und Unterschiede', seoTitle: 'Feminin & maskulin: Bedeutung und Beispiele erklärt', description: 'Was bedeutet feminin, was maskulin? Verständliche Definitionen, Beispiele und der Unterschied zwischen Stil, Orientierung und grammatischem Geschlecht.', contentHtml: feminin },
  '/magazin/androgyn': { title: 'Was bedeutet androgyn? Aussehen, Stil und Identität erklärt', seoTitle: 'Androgyn: Bedeutung, androgyne Frauen und Styling', description: 'Androgyn einfach erklärt: Bedeutung, androgyne Frauen, Aussehen und Styling. Was der Begriff mit Identität zu tun hat und was er nicht über Orientierung sagt.', contentHtml: androgyn },
  '/magazin/bin-ich-lesbisch': { title: 'Bin ich lesbisch oder bi? Selbsttest mit Fragen und Auswertung', seoTitle: 'Bin ich lesbisch? Selbsttest mit 8 Fragen und Ergebnis', description: 'Bin ich lesbisch oder bi? Beantworte 8 Fragen, erhalte eine Einordnung und lade andere zum Selbsttest ein. Ohne Anmeldung, mit privaten Antworten im Browser.', contentHtml: selftest },
};
