import { VenusPairIcon, SearchIcon } from "@/components/icons";

type Props = {
  city: string;
  zip: string;
  /** ICONY-Ländercode: DE 49, AT 43, CH 41 */
  country: number;
  registrationUrl: string;
  searchUrl: string | null;
};

const PLATFORM_ID = "siesuchtsie";

/**
 * Profilvorschauen von ICONY – nur Frauen, isoliert in einem sandboxed iframe (srcDoc).
 * Kacheln werden ausschließlich per textContent befüllt, Bild-URLs nur über https.
 */
function buildWidgetDocument({ city, zip, country, registrationUrl }: Props) {
  const options = JSON.stringify({ city, zip, country, platformId: PLATFORM_ID, registrationUrl, gender: 2, count: 6 }).replace(/</g, "\\u003c");

  return `<!doctype html>
<html lang="de"><head><meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<meta name="robots" content="noindex,nofollow" />
<meta name="referrer" content="no-referrer" />
<style>
:root{color-scheme:light;--ink:#2b1a2f;--muted:#6c5a6f;--line:#f1dde3;--magenta:#d6337a;--berry:#a3175f}*{box-sizing:border-box}body{margin:0;background:transparent;color:var(--ink);font-family:"Open Sans",Arial,sans-serif}.state{display:grid;min-height:236px;place-items:center;padding:20px;border:1.5px dashed #efc7d3;border-radius:22px;background:#fff8f5;color:var(--berry);font-weight:700;text-align:center}.grid{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:14px;padding:4px 2px 14px}.tile{display:grid;min-width:0;gap:6px;padding:8px 8px 12px;border:1px solid var(--line);border-radius:22px;background:#fff;text-decoration:none;color:inherit;box-shadow:0 12px 26px rgba(59,18,64,.08);transition:transform .18s ease,border-color .18s ease,box-shadow .18s ease}.tile:nth-child(odd){transform:rotate(-1.2deg)}.tile:nth-child(even){transform:rotate(1.2deg)}.tile:hover,.tile:focus-visible{transform:translateY(-3px) rotate(0);border-color:var(--magenta);box-shadow:0 18px 32px rgba(214,51,122,.18);outline:none}.image{overflow:hidden;aspect-ratio:1;border-radius:90px 90px 14px 14px;background:linear-gradient(135deg,#ffe3d4,#f2ecff)}.image img{display:block;width:100%;height:100%;object-fit:cover}.tile strong,.tile span{overflow:hidden;padding:0 4px;text-overflow:ellipsis;white-space:nowrap}.tile strong{font-size:.95rem}.tile span{color:var(--muted);font-size:.8rem}@media(max-width:700px){.grid{grid-template-columns:repeat(3,minmax(0,1fr))}}@media(max-width:430px){.grid{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(prefers-reduced-motion:reduce){.tile{transition:none;transform:none!important}}
</style></head><body>
<div id="root" class="state">Für Profilvorschauen bitte JavaScript aktivieren oder die ausführliche Suche nutzen.</div>
<script>(function(){
var options=${options},completed=false,root=document.getElementById("root");root.textContent="Frauen werden geladen…";
function install(i,c,o,n,y,j,s){i.IconyObject=y;i[y]=i[y]||function(){function b(a){return a?(a^Math.random()*16>>a/4).toString(16):"i"+([1e7]+1e7).replace(/[018]/g,b)+1*new Date}var k=arguments;k.id=b();(i[y].q=i[y].q||[]).push(k);i[y].R?.();return k.id};j=c.createElement(o);s=c.getElementsByTagName(o)[0];j.async=1;j.src=n;s.parentNode.insertBefore(j,s)}
function fallback(){if(completed)return;completed=true;root.className="state";root.textContent="Gerade keine Schnelltreffer. Bitte nutze die ausführliche Suche."}
function safeImage(value){if(typeof value!=="string")return"";if(value.startsWith("//"))return"https:"+value;return value.startsWith("https://")?value:""}
function render(response){var items=response&&Array.isArray(response.data)?response.data.filter(function(item){return item&&item.gender==="female"}):[];if(!items.length)return fallback();completed=true;root.className="grid";root.textContent="";items.slice(0,options.count).forEach(function(item){var a=document.createElement("a"),imageWrap=document.createElement("div"),strong=document.createElement("strong"),span=document.createElement("span"),image=safeImage(item.imageurl);a.className="tile";a.href=options.registrationUrl;a.target="_blank";a.rel="noopener noreferrer";imageWrap.className="image";if(image){var img=document.createElement("img");img.src=image;img.loading="lazy";img.alt="Profilbild von "+String(item.username||"Profil");imageWrap.appendChild(img)}strong.textContent=String(item.username||"Profil aus "+options.city);span.textContent=String(item.userinfo_text||[item.age?item.age+" Jahre":"",item.city||options.city].filter(Boolean).join(", "));a.append(imageWrap,strong,span);root.appendChild(a)})}
install(window,document,"script","https://js.icony.com/api.js","icony");window.icony("create",options.platformId);window.icony("get","activities","json",render,{count:options.count,gender:options.gender,country:options.country,zip:options.zip,affiliate:"location",use_thumbnails:0,blurred:0});setTimeout(fallback,10000)
})();</script></body></html>`;
}

export function IconyWomenWidget(props: Props) {
  const headingId = `sc-women-${props.zip}`;
  return (
    <section className="sc-widget" aria-labelledby={headingId}>
      <div className="sc-widget-head">
        <span className="sc-widget-badge" aria-hidden="true"><VenusPairIcon /></span>
        <div>
          <p className="kicker">Profilvorschau · nur Frauen</p>
          <h2 id={headingId}>Frauen aus {props.city}, <em>die gerade suchen</em></h2>
          <p>Echte Profilvorschauen aus Deiner Region – ein Klick, und Du bist kostenlos dabei.</p>
        </div>
      </div>
      <iframe
        className="sc-widget-frame"
        title={`Profilvorschau: Frauen aus ${props.city}`}
        srcDoc={buildWidgetDocument(props)}
        loading="lazy"
        referrerPolicy="no-referrer"
        sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox"
      />
      <div className="sc-widget-actions">
        {props.searchUrl ? <a className="button button-green" href={props.searchUrl}><SearchIcon />Ausführlicher in {props.city} suchen</a> : null}
        <span>Kostenlos starten · Umkreis selbst festlegen · Frauen, die Frauen lieben</span>
      </div>
    </section>
  );
}
