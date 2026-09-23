type FaqGroup = {
  id: string;
  title: string;
  items: Array<{ id: string; question: string; answerHtml: string }>;
};

export function FaqSection({ groups, registrationHref }: { groups: FaqGroup[]; registrationHref: string }) {
  const total = groups.reduce((sum, group) => sum + group.items.length, 0);
  return <section className="faq-section" aria-labelledby="faq-heading">
    <header className="faq-intro">
      <p className="kicker">Schnell beantwortet</p>
      <h2 id="faq-heading">Deine Fragen, unsere Antworten</h2>
      <p>{total} Antworten in {groups.length} Themen – wähle ein Thema oder klick Dich direkt durch die Fragen.</p>
    </header>
    <nav className="faq-topics" aria-label="FAQ-Themen">
      {groups.map((group) => <a href={`#${group.id}`} key={group.id}>{group.title}<span>{group.items.length}</span></a>)}
    </nav>
    <div className="faq-groups">
      {groups.map((group, groupIndex) => <div className="faq-group" id={group.id} key={group.id}>
        <h3><span aria-hidden="true">{String(groupIndex + 1).padStart(2, "0")}</span>{group.title}</h3>
        <div className="faq-list">
          {group.items.map((item, itemIndex) => <details className="faq-item" id={item.id} key={item.id} open={groupIndex === 0 && itemIndex === 0}>
            <summary><span>{item.question}</span><i className="faq-icon" aria-hidden="true" /></summary>
            <div className="faq-answer" dangerouslySetInnerHTML={{ __html: item.answerHtml }} />
          </details>)}
        </div>
      </div>)}
    </div>
    <aside className="faq-help">
      <div>
        <h3>Deine Frage ist nicht dabei?</h3>
        <p>In der Hilfe findest Du weitere Antworten und den direkten Draht zu unserem Support.</p>
      </div>
      <div className="faq-help-actions">
        <a className="button button-outline" href="https://www.sie-sucht-sie.de/hilfe">Zur Hilfe</a>
        <a className="button button-green" href={registrationHref}>Kostenlos starten</a>
      </div>
    </aside>
  </section>;
}
