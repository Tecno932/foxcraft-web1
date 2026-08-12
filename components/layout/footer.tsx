import { Logo } from "@/components/navigation/logo";

export function Footer() {
  return (
    <footer className="border-t border-border py-10">

      <div className="mx-auto flex max-w-screen-2xl flex-col gap-4 px-4 sm:px-6 lg:px-8 md:flex-row md:items-center md:justify-between">

        <Logo />

        <p className="text-sm text-muted">
          © {new Date().getFullYear()} FoxCraft. Todos los derechos reservados.
        </p>

      </div>

    </footer>
  );
}