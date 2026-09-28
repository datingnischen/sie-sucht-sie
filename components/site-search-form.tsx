import { withTrailingSlash } from "@/lib/site-contract.mjs";
import { SITE_SEARCH_PATH } from "@/lib/site-search.mjs";
import { SearchIcon } from "@/components/icons";
import "@/components/about/site-search.css";

type Props = { defaultValue?: string; id?: string; label?: string; autoFocus?: boolean };

/** GET-Formular auf die Seitensuche unter "Über uns" (nie auf /suche, das gehört ICONY). */
export function SiteSearchForm({ defaultValue = "", id = "site-search-q", label = "Magazin, Städte und Lexikon durchsuchen", autoFocus = false }: Props) {
  return <form className="site-search-form ss-form" action={withTrailingSlash(SITE_SEARCH_PATH)} method="get" role="search">
    <label className="site-search-label ss-label" htmlFor={id}>{label}</label>
    <div className="site-search-row ss-row">
      <span className="ss-row-icon" aria-hidden="true"><SearchIcon /></span>
      <input id={id} className="site-search-input ss-input" type="search" name="q" defaultValue={defaultValue} placeholder="z. B. Berlin, Coming-out, Regenbogenfahne" maxLength={100} autoComplete="off" autoFocus={autoFocus} />
      <button className="button button-pink ss-submit" type="submit">Suchen</button>
    </div>
  </form>;
}
