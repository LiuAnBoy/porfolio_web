/**
 * Navigation menu items configuration.
 */
export const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/profile", label: "Profile" },
] as const;

export type NavItem = (typeof NAV_ITEMS)[number];
