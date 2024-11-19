import NavLink from "./NavLink";

export default function MobileNav() {
  return (
    <div className="md:hidden bg-white dark:bg-gray-800 py-2">
      <NavLink href="/" mobile>
        Home
      </NavLink>
            <NavLink href="/browse_jobs" mobile>
        Browse
      </NavLink>
    </div>
  );
}
