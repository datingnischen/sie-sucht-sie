const PUBLIC_REGISTRATION_HREF = /^https:\/\/www\.sie-sucht-sie\.de\/registration\/?(?:[?#].*)?$/i;

export function decorateInlineRegistrationCtas(html, registrationUrl) {
  if (typeof html !== "string" || !/^https:\/\/www\.sie-sucht-sie\.de\/registration\/\?AID=(?:magazin|location)$/.test(registrationUrl)) return html;

  return html.replace(/<a\b([^>]*?)href=(['"])(.*?)\2([^>]*)>([\s\S]*?)<\/a>/gi, (anchor, before, quote, href, after, content) => {
    if (!PUBLIC_REGISTRATION_HREF.test(href) || /<img\b/i.test(content) || !content.replace(/<[^>]*>/g, "").replace(/&nbsp;/gi, " ").trim()) return anchor;
    const attributes = `${before}href=${quote}${registrationUrl}${quote}${after}`;
    if (/\bclass=(['"])/i.test(attributes)) {
      const withClass = attributes.replace(/\bclass=(['"])(.*?)\1/i, (_match, classQuote, classes) => `class=${classQuote}${classes} inline-content-cta${classQuote}`);
      return `<a${withClass}>${content}</a>`;
    }
    return `<a${attributes} class="inline-content-cta">${content}</a>`;
  });
}
