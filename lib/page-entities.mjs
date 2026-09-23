const SITE_URL = "https://www.sie-sucht-sie.de";
const WEBSITE_ID = `${SITE_URL}/#website`;

export function serializePageEntityGraph(graph) {
  return JSON.stringify(graph).replace(/</g, "\\u003c");
}

export function buildPageEntityGraph(page, { faqEntities = [], breadcrumb } = {}) {
  if (!page?.canonical?.startsWith(`${SITE_URL}/`) || !page.h1 || !page.description) {
    throw new TypeError("Page entities require a canonical public URL, name and description");
  }

  const webpageId = `${page.canonical}#webpage`;
  const website = {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: `${SITE_URL}/`,
    name: "Sie-sucht-Sie.de",
    description: "Deutschsprachige Singlebörse für lesbische und bisexuelle Frauen.",
    inLanguage: "de-DE",
  };
  const webpage = {
    "@type": "WebPage",
    "@id": webpageId,
    url: page.canonical,
    name: page.h1,
    description: page.description,
    inLanguage: "de-DE",
    isPartOf: { "@id": WEBSITE_ID },
  };
  const graph = [website, webpage];
  if (breadcrumb?.itemListElement?.length) {
    const breadcrumbId = `${page.canonical}#breadcrumb`;
    webpage.breadcrumb = { "@id": breadcrumbId };
    graph.push({ "@type": "BreadcrumbList", "@id": breadcrumbId, itemListElement: breadcrumb.itemListElement });
  }
  if (faqEntities.length) {
    webpage["@type"] = ["WebPage", "FAQPage"];
    webpage.mainEntity = faqEntities;
  }
  return { "@context": "https://schema.org", "@graph": graph };
}
