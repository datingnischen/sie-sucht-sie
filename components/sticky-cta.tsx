"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { registrationUrl } from "@/lib/site";
import { HeartFilledIcon } from "@/components/icons";

/** Mobile Registrierleiste: erscheint erst nach 520 px Scrollen, damit der Hero frei bleibt. */
export function StickyCta() {
  const pathname = usePathname() || "/";
  const isSelftest = /^\/magazin\/bin-ich-lesbisch\/?$/.test(pathname);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const update = () => setVisible(window.scrollY > 520);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  return (
    <div className={`sticky-cta${visible ? " is-visible" : ""}`} aria-hidden={!visible}>
      <span><HeartFilledIcon /> {isSelftest ? "Dein Gefühlskompass" : "Frauen in Deiner Nähe"}</span>
      <a className="button button-green" href={isSelftest ? "#selbsttest" : registrationUrl(pathname)} tabIndex={visible ? 0 : -1}>{isSelftest ? "Zum Selbsttest" : "Kostenlos starten"}</a>
    </div>
  );
}
