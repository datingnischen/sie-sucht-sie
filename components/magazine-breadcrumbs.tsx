import Link from "next/link";

export function MagazineBreadcrumbs({ current }: { current?: string }) {
  const items = [{ name: "Start", path: "/" }, { name: "Magazin", path: "/magazin" }];
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <ol>
        {items.map((item, index) => (
          <li key={item.path}>
            {current || index < items.length - 1 ? <Link href={item.path}>{item.name}</Link> : <span aria-current="page">{item.name}</span>}
          </li>
        ))}
        {current && <li><span aria-current="page">{current}</span></li>}
      </ol>
    </nav>
  );
}
