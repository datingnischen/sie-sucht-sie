import { BookIcon, ChatIcon, CoffeeIcon, GlassIcon, HeartIcon, PhoneIcon, PinIcon, SparkIcon, TvIcon, VenusPairIcon } from "@/components/icons";

const ICONS = {
  allgemein: SparkIcon,
  "deine-geschichte": ChatIcon,
  lesbenportale: PhoneIcon,
  lifestyle: CoffeeIcon,
  literatur: BookIcon,
  nachtleben: GlassIcon,
  ratgeber: HeartIcon,
  "tv-shows": TvIcon,
  guide: PinIcon,
} as const;

/** Icon je Magazin-Kategorie; unbekannte Themen bekommen das Venus-Paar (⚢). */
export function MagazineCategoryIcon({ slug, className }: { slug?: string | null; className?: string }) {
  const Icon = (slug && ICONS[slug as keyof typeof ICONS]) || VenusPairIcon;
  return <Icon className={className} />;
}
