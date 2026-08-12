import Link from "next/link";

const links = [
  {
    href: "/explore",
    label: "Explorar",
  },
  {
    href: "/mods",
    label: "Mods",
  },
  {
    href: "/maps",
    label: "Mapas",
  },
  {
    href: "/skins",
    label: "Skins",
  },
];

export function NavLinks() {
  return (
    <nav
      className="
      hidden
      items-center
      gap-8
      lg:flex
      "
    >
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="
          text-sm
          text-muted
          transition-colors
          hover:text-white
          "
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}