export const options = [
  { value: 'yes', label: 'Ja, das kenne ich' },
  { value: 'sometimes', label: 'Manchmal / ein bisschen' },
  { value: 'no', label: 'Nein, eher nicht' },
  { value: 'unsure', label: 'Weiß ich noch nicht' },
];

export const questions = [
  { text: 'Hattest Du schon einmal romantische Gefühle für eine Frau?', hint: 'Zum Beispiel Verliebtsein oder den Wunsch, mehr als befreundet zu sein.' },
  { text: 'Fühlst Du Dich körperlich zu Frauen hingezogen?', hint: 'Es geht um Dein eigenes Empfinden. Du musst dafür keine Erfahrungen gesammelt haben.' },
  { text: 'Kannst Du Dir eine Liebesbeziehung mit einer Frau vorstellen?', hint: 'Denke an Deine Wünsche, unabhängig von den Erwartungen anderer.' },
  { text: 'Hattest Du schon einmal romantische Gefühle für Menschen anderer Geschlechter als Frauen?', hint: 'Zum Beispiel für Männer oder nichtbinäre Menschen. Gemeint sind Deine eigenen Gefühle, nicht eine Erwartung von außen.' },
  { text: 'Fühlst Du Dich körperlich zu Menschen anderer Geschlechter als Frauen hingezogen?', hint: 'Romantische und körperliche Anziehung können verschieden sein.' },
  { text: 'Kannst Du Dir eine Liebesbeziehung mit jemandem vorstellen, der keine Frau ist?', hint: 'Du kannst mehrere Geschlechter anziehend finden oder bei dieser Frage noch unsicher sein.' },
  { text: 'Brauchst Du gerade noch Zeit, um Deine Gefühle einzuordnen?', hint: 'Diese Frage verändert die Einordnung Deiner Anziehung nicht. Sie hilft bei den nächsten Schritten.' },
  { text: 'Würde Dir ein vertrauliches Gespräch über Deine Gefühle helfen?', hint: 'Auch diese Antwort bestimmt kein Label. Du entscheidest selbst, ob und mit wem Du sprechen möchtest.' },
];

export const results = {
  women: { id: 'women', title: 'Du beschreibst Anziehung zu Frauen', text: 'In mehreren Antworten beschreibst Du Gefühle oder Wünsche in Bezug auf Frauen, bei anderen Geschlechtern bisher eher wenig. Das darfst Du ernst nehmen. Ob sich lesbisch, queer oder ein anderer Begriff für Dich stimmig anfühlt, entscheidest allein Du.', prompt: 'Was würde Dir guttun, wenn Du Deinen Gefühlen etwas mehr Raum gibst?' },
  several: { id: 'several', title: 'Du beschreibst Anziehung zu mehreren Geschlechtern', text: 'Du hast bei Frauen und bei anderen Geschlechtern Anziehung oder Beziehungswünsche beschrieben. Dafür können sich Begriffe wie bi, pan oder queer passend anfühlen. Du musst Dich nicht gleich stark oder auf dieselbe Weise zu allen Menschen hingezogen fühlen.', prompt: 'Welcher Begriff fühlt sich für Dich hilfreich an – falls Du gerade überhaupt einen brauchst?' },
  other: { id: 'other', title: 'Bei Frauen beschreibst Du bisher wenig Anziehung', text: 'Deine Antworten beschreiben eher Gefühle oder Beziehungswünsche bei anderen Geschlechtern als bei Frauen. Das ist eine Momentaufnahme Deiner Angaben. Der Test legt weder Deine Orientierung fest noch schließt er spätere Erkenntnisse aus.', prompt: 'Was hat Dich neugierig auf diesen Test gemacht?' },
  little: { id: 'little', title: 'Du beschreibst gerade wenig Anziehung', text: 'Bei den Fragen zu romantischen Gefühlen, körperlicher Anziehung und Beziehungswünschen hast Du jeweils eher Nein gewählt. Das ist kein Defizit und erlaubt für sich genommen keine Aussage darüber, ob ein Begriff wie asexuell oder aromantisch zu Dir passt.', prompt: 'Welche Art von Nähe oder Verbundenheit wünschst Du Dir, ohne Erwartungen erfüllen zu müssen?' },
  exploring: { id: 'exploring', title: 'Du lässt Raum für offene Fragen', text: 'Deine Antworten sind noch offen oder ergeben kein klares gemeinsames Muster. Unsicherheit ist nicht dasselbe wie fehlende Anziehung. Du musst weder Erfahrungen vorweisen noch Dich mit einem Label beeilen.', prompt: 'Welche Gefühle möchtest Du in Ruhe besser kennenlernen?' },
};

/** Redaktionelle Reflexionshilfe, kein validiertes Messinstrument. Keine Identität wird zugewiesen. */
export function evaluateAnswers(answers) {
  if (!Array.isArray(answers) || answers.length !== questions.length ||
      !Array.from(answers).every(answer => options.some(option => option.value === answer))) return null;
  const women = answers.slice(0, 3);
  const other = answers.slice(3, 6);
  const positive = values => values.filter(value => value === 'yes' || value === 'sometimes').length;
  const uncertain = values => values.filter(value => value === 'unsure').length;
  let id = 'exploring';
  if (uncertain(women) <= 1 && uncertain(other) <= 1) {
    if (positive(women) >= 2 && positive(other) >= 2) id = 'several';
    else if (positive(women) >= 2 && other.every(value => value === 'no')) id = 'women';
    else if (positive(other) >= 2 && women.every(value => value === 'no')) id = 'other';
    else if ([...women, ...other].every(value => value === 'no')) id = 'little';
  }
  return { ...results[id],
    needsTime: answers[6] !== 'no', wantsConversation: answers[7] === 'yes' || answers[7] === 'sometimes',
  };
}

export function buildShareData(result, includeResult = false) {
  const invitation = '8 Fragen, um die eigenen Gefühle zu sortieren – ohne feste Labels. Möchtest Du den Selbsttest auch ausprobieren?';
  return {
    title: 'Bin ich lesbisch oder bi? Ein Selbsttest zum Nachdenken',
    text: includeResult && result ? `Meine Einordnung im Selbsttest: „${result.title}“. ${invitation}` : invitation,
    url: 'https://www.sie-sucht-sie.de/magazin/bin-ich-lesbisch/#selbsttest',
  };
}
