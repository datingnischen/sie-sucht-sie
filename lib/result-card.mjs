export const resultCards = {
  women: { eyebrow: 'Herzklopfen für Frauen', lines: ['Dein Herz', 'schlägt für sie.'], caption: 'Du gibst Deinen Gefühlen für Frauen Raum.', color: '#f6548b' },
  several: { eyebrow: 'Mehr als eine Richtung', lines: ['Dein Herz kennt', 'keine Schublade.'], caption: 'Deine Gefühle dürfen vielfältig sein.', color: '#a780ff' },
  other: { eyebrow: 'Deinem Gefühl auf der Spur', lines: ['Dein Gefühl.', 'Deine Richtung.'], caption: 'Du findest heraus, was sich für Dich richtig anfühlt.', color: '#ff9a70' },
  little: { eyebrow: 'Nähe nach Deinen Regeln', lines: ['Dein Tempo.', 'Deine Nähe.'], caption: 'Du musst nichts fühlen, nur weil andere es erwarten.', color: '#78d5c3' },
  exploring: { eyebrow: 'Offen für Dich selbst', lines: ['Neugier ist ein', 'schöner Anfang.'], caption: 'Du brauchst heute noch keine fertige Antwort.', color: '#f8a0cb' },
};

/** A local, self-contained poster; no remote assets, uploaded answers or result URLs. */
export async function createResultCardFile(id) {
  const card = resultCards[id];
  if (!card) throw new Error('Unknown result');
  const canvas = document.createElement('canvas');
  canvas.width = 1080; canvas.height = 1350;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas unavailable');
  const gradient = ctx.createLinearGradient(0, 0, 1080, 1350);
  gradient.addColorStop(0, '#28102e'); gradient.addColorStop(.55, '#4b164b'); gradient.addColorStop(1, '#a32369');
  ctx.fillStyle = gradient; ctx.fillRect(0, 0, 1080, 1350);
  const glow = ctx.createRadialGradient(1000, 200, 0, 1000, 200, 850);
  glow.addColorStop(0, card.color); glow.addColorStop(1, 'transparent');
  ctx.globalAlpha = .36; ctx.fillStyle = glow; ctx.fillRect(0, 0, 1080, 1350); ctx.globalAlpha = 1;
  ctx.strokeStyle = '#ffffff30'; ctx.lineWidth = 2;
  for (const radius of [180, 270, 360]) { ctx.beginPath(); ctx.arc(1010, 50, radius, 0, Math.PI * 2); ctx.stroke(); }
  ctx.fillStyle = '#fff'; ctx.font = 'bold 26px Arial'; ctx.fillText('SIE-SUCHT-SIE.DE', 80, 105);
  ctx.fillStyle = '#ffffffbb'; ctx.font = '24px Arial'; ctx.fillText('DEIN GEFÜHLSKOMPASS', 80, 200);
  ctx.save(); ctx.translate(140, 390); ctx.scale(3.5, 3.5); ctx.fillStyle = card.color;
  ctx.beginPath(); ctx.moveTo(0, 12); ctx.bezierCurveTo(-42, -12, -27, -42, 0, -20); ctx.bezierCurveTo(27, -42, 42, -12, 0, 12); ctx.fill(); ctx.restore();
  ctx.fillStyle = card.color; ctx.font = 'bold 25px Arial'; ctx.fillText(card.eyebrow.toLocaleUpperCase('de-DE'), 80, 530);
  ctx.fillStyle = '#fff'; ctx.font = 'bold 92px Georgia';
  card.lines.forEach((line, index) => ctx.fillText(line, 76, 670 + index * 115, 920));
  ctx.fillStyle = '#ffe9f3'; ctx.font = '30px Arial';
  const words = card.caption.split(' '); let line = ''; let y = 910;
  for (const word of words) {
    if (ctx.measureText(`${line} ${word}`).width > 850) { ctx.fillText(line, 80, y); y += 44; line = word; }
    else line = line ? `${line} ${word}` : word;
  }
  ctx.fillText(line, 80, y);
  ctx.fillStyle = '#ffffff50'; ctx.fillRect(80, 1100, 920, 1);
  ctx.fillStyle = '#fff'; ctx.font = 'bold 30px Arial'; ctx.fillText('Und was sagt Dein Gefühl?', 80, 1170);
  ctx.fillStyle = '#ffe9f3'; ctx.font = '25px Arial'; ctx.fillText('Mach den Selbsttest auf sie-sucht-sie.de', 80, 1220);
  ctx.fillStyle = '#ffffffa0'; ctx.font = '19px Arial'; ctx.fillText('Eine Momentaufnahme. Du bestimmst Dein Label.', 80, 1290);
  const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
  if (!blob) throw new Error('Image export unavailable');
  return new File([blob], 'mein-gefuehlskompass.png', { type: 'image/png' });
}
