export const questionDetails = [
  { topic: 'Herzklopfen', answers: [
    ['Da war schon dieses Kribbeln', 'Ich kenne Verliebtsein oder den Wunsch nach mehr Nähe zu einer Frau.'],
    ['Vielleicht war da mehr', 'Einzelne Begegnungen haben sich anders angefühlt als Freundschaft.'],
    ['Bisher eher Freundschaft', 'Romantische Gefühle für eine Frau kenne ich bislang nicht.'],
    ['Genau das frage ich mich', 'Ich kann meine Gefühle noch nicht klar einordnen.'],
  ] },
  { topic: 'Anziehung & Nähe', answers: [
    ['Ja, die Anziehung ist da', 'Nähe oder ein Kuss mit einer Frau fühlen sich für mich anziehend an.'],
    ['Bei manchen Frauen schon', 'Manchmal spüre ich etwas, auch wenn es nicht immer eindeutig ist.'],
    ['Das fühle ich eher nicht', 'Frauen können mir gefallen, ohne dass ich körperliche Nähe möchte.'],
    ['Das habe ich noch nicht sortiert', 'Ich bin unsicher oder habe darüber noch wenig nachgedacht.'],
  ] },
  { topic: 'Deine Vorstellung von Liebe', answers: [
    ['Das fühlt sich schön an', 'Eine Frau an meiner Seite kann ich mir als Partnerin vorstellen.'],
    ['Ich bin neugierig darauf', 'Eine Beziehung mit einer Frau ist für mich denkbar, aber noch ungewohnt.'],
    ['Für mich eher nicht', 'Eine Liebesbeziehung mit einer Frau entspricht bisher nicht meinen Wünschen.'],
    ['Mein Bild ist noch offen', 'Ich weiß noch nicht, mit wem ich mir eine Beziehung wünsche.'],
  ] },
  { topic: 'Ein Blick auf andere Gefühle', answers: [
    ['Auch da kenne ich Verliebtsein', 'Romantische Gefühle für Menschen anderer Geschlechter habe ich erlebt.'],
    ['Manchmal, bei bestimmten Menschen', 'Es gibt einzelne Gefühle oder Begegnungen, die dazu passen.'],
    ['Da war bisher kein Herzklopfen', 'Romantische Anziehung zu anderen Geschlechtern kenne ich nicht.'],
    ['Ich bin mir nicht sicher', 'Ich möchte erst herausfinden, was eigene Gefühle und was Erwartungen waren.'],
  ] },
  { topic: 'Was Dich anzieht', answers: [
    ['Diese Anziehung kenne ich auch', 'Menschen anderer Geschlechter können mich körperlich anziehen.'],
    ['Es kommt auf die Person an', 'Bei einzelnen Menschen anderer Geschlechter fühle ich Anziehung.'],
    ['Das spricht mich eher nicht an', 'Körperliche Anziehung zu anderen Geschlechtern empfinde ich bislang nicht.'],
    ['Dazu habe ich noch keine Antwort', 'Ich kann dieses Gefühl für mich noch nicht benennen.'],
  ] },
  { topic: 'Wen Du an Deiner Seite siehst', answers: [
    ['Ja, das passt zu meinen Wünschen', 'Eine Beziehung mit jemandem, der keine Frau ist, kann ich mir vorstellen.'],
    ['Ich möchte das offenlassen', 'Mit einer passenden Person wäre eine solche Beziehung für mich denkbar.'],
    ['Das ist eher nicht mein Wunsch', 'Eine Beziehung mit Menschen anderer Geschlechter wünsche ich mir bisher nicht.'],
    ['Ich kann es noch nicht sagen', 'Meine Vorstellung von einer Partnerschaft ist noch nicht klar.'],
  ] },
  { topic: 'Dein Tempo', answers: [
    ['Ich möchte mir Zeit nehmen', 'Ich will meine Gefühle ohne Druck weiter kennenlernen.'],
    ['Ein bisschen Raum tut mir gut', 'Manches ist klar, bei anderem möchte ich noch in mich hineinhorchen.'],
    ['Ich fühle mich schon recht klar', 'Ich brauche gerade vor allem Vertrauen in mein eigenes Gefühl.'],
    ['Auch das darf noch offen sein', 'Ich weiß noch nicht, was ich für mich gerade brauche.'],
  ] },
  { topic: 'Was Dir guttun könnte', answers: [
    ['Darüber reden würde mir guttun', 'Ein Gespräch mit einer vertrauten Person könnte mir helfen.'],
    ['Vielleicht, wenn es sich ergibt', 'Ich bin für Austausch offen, möchte aber nichts überstürzen.'],
    ['Erst einmal nur für mich', 'Ich möchte meine Gedanken gerade lieber privat sortieren.'],
    ['Das entscheide ich später', 'Ich brauche jetzt noch keinen Plan für den nächsten Schritt.'],
  ] },
];

const contexts = {
  women: 'Dein Muster hat einen erkennbaren Schwerpunkt: Du hast in mehreren Bereichen Gefühle oder Wünsche in Bezug auf Frauen beschrieben. Das muss sich nicht überall gleich anfühlen. Verliebtsein, körperliche Anziehung und die Vorstellung einer Beziehung können unterschiedlich deutlich sein. Vielleicht fühlt sich ein Begriff wie lesbisch für Dich passend an; vielleicht möchtest Du zunächst einfach Deinen Gefühlen folgen. Du musst dafür weder frühere Beziehungen erklären noch erst bestimmte Erfahrungen sammeln. Nimm besonders die Antworten mit, bei denen sich ein spontanes, eigenes Ja gezeigt hat.',
  several: 'In Deinen Antworten gibt es bei Frauen und bei anderen Geschlechtern Anziehung oder Beziehungswünsche. Diese Gefühle müssen weder gleich stark noch gleich häufig sein. Auch ein Schwerpunkt auf Frauen widerspricht nicht der Möglichkeit, sich zu mehreren Geschlechtern hingezogen zu fühlen. Begriffe wie bi, pan oder queer können beim Beschreiben helfen, sind aber keine Vorgabe dieses Tests. Schau Dir die drei Facetten einzeln an: Vielleicht ist körperliche Anziehung für Dich anders verteilt als die Vorstellung von einer Beziehung. Beides darf nebeneinander stehen.',
  other: 'Du hast mehrere Gefühle oder Wünsche bei anderen Geschlechtern beschrieben und die Fragen zu Frauen bisher eher verneint. Das ist eine Beschreibung Deiner heutigen Angaben, kein Urteil über Deine Neugier. Vielleicht wolltest Du eine Vermutung überprüfen oder besser zwischen Bewunderung, Freundschaft und Anziehung unterscheiden. Du musst aus einem schönen Kontakt mit einer Frau keine bestimmte Schlussfolgerung ziehen. Genauso wenig musst Du spätere neue Gefühle abwehren, nur weil Deine Antworten heute so ausfallen. Dein eigenes Erleben bleibt der Maßstab.',
  little: 'Bei den Fragen zu Anziehung und Beziehung hast Du bisher eher verneinende Antworten gewählt. Daraus lässt sich nicht ableiten, warum das so ist oder welches Label zu Dir passt. Es kann hilfreich sein, Verliebtsein, körperliche Anziehung und den Wunsch nach Verbundenheit getrennt zu betrachten. Vielleicht ist Nähe für Dich vor allem Vertrauen, gemeinsame Zeit oder Zärtlichkeit ohne weitere Erwartungen. Du musst Dich weder mit anderen vergleichen noch Erfahrungen machen, um etwas nachzuweisen. Schau darauf, welche Form von Verbindung Du selbst tatsächlich möchtest.',
  exploring: 'Deine Antworten sind unterschiedlich oder an mehreren Stellen noch offen. Das ist kein schlechtes oder unvollständiges Ergebnis: Es zeigt, welche Fragen für Dich gerade noch Raum brauchen. Vielleicht ist Verliebtsein leichter zu benennen als körperliche Anziehung; vielleicht kannst Du Dir eine Beziehung vorstellen, ohne schon ähnliche Gefühle erlebt zu haben. In Deiner persönlichen Übersicht bleiben diese Unterschiede sichtbar. Du brauchst heute keine einheitliche Geschichte über Dich. Achte eher darauf, welche Begegnungen Dich bewegen und welche Vorstellungen sich nach Deinen eigenen Wünschen anfühlen.',
};

const facetDefinitions = [
  { title: 'Dein Herzklopfen', label: 'Romantische Gefühle', indexes: [0, 3], subject: 'romantische Gefühle', hint: 'Bewunderung und Freundschaft können intensiv sein. Entscheidend ist, ob Du Dir selbst ein Verliebtsein oder mehr als Freundschaft wünschst.' },
  { title: 'Was Dich anzieht', label: 'Körperliche Anziehung', indexes: [1, 4], subject: 'körperliche Anziehung', hint: 'Du kannst jemanden schön finden, ohne körperliche Nähe zu wollen. Umgekehrt setzt Anziehung keine bereits gesammelte Erfahrung voraus.' },
  { title: 'Dein Bild von Liebe', label: 'Beziehungswünsche', indexes: [2, 5], subject: 'Beziehungswünsche', hint: 'Eine Vorstellung ist noch kein Plan. Sie kann Dir trotzdem zeigen, welche Art von Partnerschaft Du Dir ohne Erwartungen von außen erlaubst.' },
];

function sentence(answer, group, subject) {
  if (answer === 'yes') return `Bei ${group} hast Du ${subject} klar bejaht.`;
  if (answer === 'sometimes') return `Bei ${group} hast Du ${subject} als gelegentlich oder vorstellbar beschrieben.`;
  if (answer === 'no') return `Bei ${group} hast Du ${subject} bisher eher verneint.`;
  return `Ob Du bei ${group} ${subject} empfindest, hast Du noch offengelassen.`;
}

export function buildAssessment(answers, id) {
  const facets = facetDefinitions.map(facet => {
    const womenAnswer = answers[facet.indexes[0]];
    const otherAnswer = answers[facet.indexes[1]];
    return { title: facet.title, label: facet.label, womenAnswer, otherAnswer,
      text: `${sentence(womenAnswer, 'Frauen', facet.subject)} ${sentence(otherAnswer, 'Menschen anderer Geschlechter', facet.subject)}`,
      hint: facet.hint,
    };
  });
  const pace = answers[6] === 'no'
    ? 'Du beschreibst, dass sich Dein Gefühl für Dich schon recht klar anfühlt. Du darfst dieser Klarheit vertrauen, ohne sie vor anderen beweisen zu müssen. Wenn Du einen Begriff für Dich wählen möchtest, probiere gedanklich aus, ob er sich stimmig anfühlt. Du kannst ihn später auch wieder anders verwenden.'
    : 'Du hast Dir bei der Frage nach Deinem Tempo noch Raum gelassen. Such Dir aus der Auswertung eine einzige Frage aus, die Dich anspricht, statt heute alles lösen zu wollen. Du könntest für Dich notieren: Welche Begegnung hat etwas in mir ausgelöst? Was wünsche ich mir, wenn gerade niemand eine Antwort von mir erwartet?';
  const conversation = answers[7] === 'yes' || answers[7] === 'sometimes'
    ? ' Weil Du Dir ein Gespräch zumindest vorstellen kannst, überlege, bei wem Du Dich wohl und ernst genommen fühlst. Du bestimmst, was Du erzählst. Ein Satz wie „Ich sortiere gerade ein paar Gefühle und möchte einfach, dass Du zuhörst“ kann ein Anfang sein.'
    : ' Du möchtest Deine Gedanken zunächst für Dich behalten oder später über einen Austausch entscheiden. Auch das ist ein vollständiger nächster Schritt. Du schuldest niemandem Dein Ergebnis, Deine Antworten oder ein Coming-out.';
  return { facets, context: contexts[id], nextStep: pace + conversation };
}
