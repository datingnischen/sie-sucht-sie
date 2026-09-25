export type SocialPlatform = "facebook" | "instagram" | "youtube";

export type SocialChannel = {
  platform: SocialPlatform;
  name: string;
  handle: string;
  kind: string;
  text: string;
  cta: string;
  href: string;
  /** Official brand profile (listed in Organization.sameAs). */
  profile: boolean;
  /** Community group where members talk to each other. */
  group: boolean;
};

// Channels and descriptions come from the imported ICONY page /social-media.
export const socialChannels: SocialChannel[] = [
  { platform: "facebook", name: "Facebook-Seite Sie sucht Sie", handle: "facebook.com/siesuchtsiede", kind: "News & Geschichten", text: "Aktuelle News, Liebesgeschichten und Inspiration aus unserer Community für Frauen, die Frauen lieben.", cta: "Seite liken", href: "https://www.facebook.com/siesuchtsiede/", profile: true, group: false },
  { platform: "instagram", name: "Instagram", handle: "@siesuchtsie", kind: "Fotos & Reels", text: "Fotos, Reels und Storys voller Liebe, Vielfalt und echter Verbindungen – direkt aus unserer Community.", cta: "Profil folgen", href: "https://www.instagram.com/siesuchtsie/", profile: true, group: false },
  { platform: "youtube", name: "YouTube", handle: "@sie-sucht-sie", kind: "Videos", text: "Videos mit Geschichten, Interviews und Tipps rund um Liebe, Dating und das Leben als Frau, die Frauen liebt.", cta: "Kanal abonnieren", href: "https://www.youtube.com/@sie-sucht-sie", profile: true, group: false },
  { platform: "facebook", name: "Rainbow Love Germany", handle: "facebook.com/rainbowlovegermany", kind: "Queere Community", text: "Vielfalt feiern – Geschichten, Events und Themen rund um queere Liebe und Community.", cta: "Seite ansehen", href: "https://www.facebook.com/rainbowlovegermany/", profile: false, group: false },
  { platform: "facebook", name: "Lesben Gemeinschaft", handle: "facebook.com/LesbenGemeinschaft", kind: "Austausch", text: "Austausch, Empowerment und schöne Begegnungen – für alle, die echte Verbindungen suchen.", cta: "Seite ansehen", href: "https://www.facebook.com/LesbenGemeinschaft/", profile: false, group: false },
  { platform: "facebook", name: "Facebook-Gruppe", handle: "Community-Gruppe", kind: "Austausch", text: "Lerne neue Frauen kennen, tausch Dich offen aus und finde neue Freundschaften oder die große Liebe.", cta: "Gruppe beitreten", href: "https://www.facebook.com/groups/187378885136576/", profile: false, group: true },
];

export const socialProfileUrls = socialChannels.filter((channel) => channel.profile).map((channel) => channel.href);
