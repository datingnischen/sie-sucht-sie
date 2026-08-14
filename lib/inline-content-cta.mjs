const PUBLIC_REGISTRATION_HREF = /^https:\/\/www\.sie-sucht-sie\.de\/registration\/?(?:[?#].*)?$/i;
const SAFE_REGISTRATION_URL = /^https:\/\/www\.sie-sucht-sie\.de\/registration\/\?AID=(?:magazin|location)$/;
const RAW_TEXT_TAGS = new Set(["script", "style", "textarea", "title", "xmp"]);
const INTERACTIVE_CONTENT = /<(?:a|button|input|select|textarea|form|iframe|video|audio)\b/i;

function tagEnd(html, start) {
  let quote = "";
  for (let index = start + 1; index < html.length; index++) {
    const char = html[index];
    if (quote) {
      if (char === quote) quote = "";
    } else if (char === '"' || char === "'") quote = char;
    else if (char === ">") return index;
  }
  return -1;
}

function nextTag(html, from) {
  let start = html.indexOf("<", from);
  while (start >= 0) {
    if (html.startsWith("<!--", start)) {
      const end = html.indexOf("-->", start + 4);
      if (end < 0) return null;
      start = html.indexOf("<", end + 3);
      continue;
    }
    const end = tagEnd(html, start);
    if (end < 0) return null;
    const source = html.slice(start, end + 1);
    const match = /^<\s*(\/?)\s*([a-z][\w:-]*)\b/i.exec(source);
    if (!match) return { start, end, source, name: "", closing: false };
    const name = match[2].toLowerCase();
    if (!match[1] && RAW_TEXT_TAGS.has(name)) {
      const close = new RegExp(`<\\s*\\/\\s*${name}\\s*>`, "ig");
      close.lastIndex = end + 1;
      const closingMatch = close.exec(html);
      if (!closingMatch) return null;
      start = html.indexOf("<", closingMatch.index + closingMatch[0].length);
      continue;
    }
    return { start, end, source, name, closing: Boolean(match[1]) };
  }
  return null;
}

function closingAnchor(html, from) {
  let cursor = from;
  while (true) {
    const tag = nextTag(html, cursor);
    if (!tag) return null;
    if (tag.name === "a") {
      if (!tag.closing) return null;
      return tag;
    }
    cursor = tag.end + 1;
  }
}

export function decorateInlineRegistrationCtas(html, registrationUrl) {
  if (typeof html !== "string" || !SAFE_REGISTRATION_URL.test(registrationUrl)) return html;
  const replacements = [];
  let cursor = 0;

  while (true) {
    const tag = nextTag(html, cursor);
    if (!tag) break;
    cursor = tag.end + 1;
    if (tag.name !== "a" || tag.closing) continue;

    const opening = /^<a\s+href=(['"])(.*?)\1\s*>$/i.exec(tag.source);
    if (!opening || !PUBLIC_REGISTRATION_HREF.test(opening[2])) continue;
    const closing = closingAnchor(html, tag.end + 1);
    if (!closing) continue;
    const content = html.slice(tag.end + 1, closing.start);
    if (/<img\b/i.test(content) || INTERACTIVE_CONTENT.test(content) || !content.replace(/<[^>]*>/g, "").replace(/&nbsp;/gi, " ").trim()) {
      cursor = closing.end + 1;
      continue;
    }
    replacements.push({ start: tag.start, end: tag.end + 1, value: `<a href="${registrationUrl}" class="inline-content-cta">` });
    cursor = closing.end + 1;
  }

  for (let index = replacements.length - 1; index >= 0; index--) {
    const item = replacements[index];
    html = html.slice(0, item.start) + item.value + html.slice(item.end);
  }
  return html;
}
