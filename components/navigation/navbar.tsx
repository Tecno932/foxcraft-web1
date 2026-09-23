"use client";

import { useEffect, useState } from "react";
import {
  ChevronDown,
  Coffee,
  CreditCard,
  Heart,
  Menu,
  Sparkles,
  X,
} from "lucide-react";
import Link from "next/link";

import { Button, Container } from "@/components/ui";
import { useScroll } from "@/hooks";
import { Logo } from "./logo";
import { NavLinks } from "./nav-links";

export function Navbar() {
  const scrolled = useScroll();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [donationsOpen, setDonationsOpen] = useState(false);
  const [desktopDonationOpen, setDesktopDonationOpen] =
    useState(false);

  const closeMobileMenu = () => {
    setMobileOpen(false);
    setDonationsOpen(false);
  };

  const closeDesktopDonation = () => {
    setDesktopDonationOpen(false);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
        setDonationsOpen(false);
        setDesktopDonationOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, []);

  useEffect(() => {
    if (mobileOpen || desktopDonationOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen, desktopDonationOpen]);

  return (
    <>
      {/* ================================================== */}
      {/* NAVBAR */}
      {/* ================================================== */}

      <header
        className={`
          sticky
          top-0
          z-50
          transition-all
          duration-300
          ${
            scrolled
              ? "border-b border-border/60 bg-background/80 shadow-sm backdrop-blur-xl"
              : "bg-transparent"
          }
        `}
      >
        <Container>
          <div className="flex h-[72px] items-center justify-between gap-4">
            {/* LOGO */}

            <Logo />

            {/* ================================================== */}
            {/* DESKTOP NAVIGATION */}
            {/* ================================================== */}

            <div
              className="
                hidden
                items-center
                gap-1
                rounded-2xl
                border2
                p-1
                md:flex
              "
            >
              <NavLinks />
            </div>

            {/* ================================================== */}
            {/* DESKTOP ACTIONS */}
            {/* ================================================== */}

            <div className="hidden items-center gap-2 md:flex">
              {/* DONATE */}

              <button
                type="button"
                onClick={() =>
                  setDesktopDonationOpen(true)
                }
                className="
                  group
                  flex
                  h-10
                  items-center
                  gap-2
                  rounded-xl
                  border
                  border-primary/20
                  bg-primary/10
                  px-3.5
                  text-sm
                  font-medium
                  text-primary
                  transition-all
                  duration-200
                  hover:border-primary/40
                  hover:bg-primary
                  hover:text-white
                  hover:shadow-lg
                  hover:shadow-primary/20
                "
              >
                <Heart
                  size={17}
                  className="
                    transition-transform
                    duration-200
                    group-hover:scale-110
                  "
                />

                <span>Donar</span>

                <ChevronDown
                  size={14}
                  className="
                    opacity-60
                    transition-transform
                    duration-200
                    group-hover:translate-y-0.5
                  "
                />
              </button>

              {/* EXPLORE */}

              <Button
                asChild
                className="
                  h-10
                  rounded-xl
                  px-4
                  shadow-sm
                "
              >
                <Link
                  href="/explore"
                  className="flex items-center gap-2"
                >
                  <Sparkles size={16} />
                  Explorar
                </Link>
              </Button>
            </div>

            {/* ================================================== */}
            {/* MOBILE MENU BUTTON */}
            {/* ================================================== */}

            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                type="button"
                aria-label={
                  mobileOpen
                    ? "Cerrar menú"
                    : "Abrir menú"
                }
                aria-expanded={mobileOpen}
                onClick={() => {
                  setMobileOpen(true);
                  setDonationsOpen(false);
                }}
                className="
                  h-10
                  w-10
                  rounded-xl
                "
              >
                <Menu size={22} />
              </Button>
            </div>
          </div>
        </Container>
      </header>

      {/* ================================================== */}
      {/* DESKTOP DONATION MODAL */}
      {/* ================================================== */}

      {desktopDonationOpen && (
        <div
          className="
            fixed
            inset-0
            z-[100]
            flex
            items-center
            justify-center
            bg-black/60
            px-4
            backdrop-blur-sm
          "
          onMouseDown={closeDesktopDonation}
          role="dialog"
          aria-modal="true"
          aria-label="Donaciones"
        >
          <div
            className="
              w-full
              max-w-lg
              overflow-hidden
              rounded-3xl
              border
              border-border
              bg-background
              shadow-2xl
            "
            onMouseDown={(event) =>
              event.stopPropagation()
            }
          >
            {/* HEADER */}

            <div className="relative p-6 pb-5">
              <div className="absolute right-5 top-5">
                <button
                  type="button"
                  onClick={closeDesktopDonation}
                  aria-label="Cerrar donaciones"
                  className="
                    rounded-xl
                    p-2
                    text-muted
                    transition
                    hover:bg-surface-secondary
                    hover:text-foreground
                  "
                >
                  <X size={19} />
                </button>
              </div>

              <div className="flex items-center gap-3">
                <div
                  className="
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-2xl
                    bg-primary/10
                    text-primary
                  "
                >
                  <Heart size={21} />
                </div>

                <div>
                  <h2 className="font-heading text-xl font-semibold">
                    Apoyá a FoxCraft
                  </h2>

                  <p className="mt-0.5 text-sm text-muted">
                    Ayudanos a seguir construyendo.
                  </p>
                </div>
              </div>
            </div>

            {/* DONATION OPTIONS */}

            <div className="grid gap-2.5 px-6 pb-6">
              {/* PATREON */}

              <Link
                href="https://patreon.com/Foxcrafting?utm_medium=unknown&utm_source=join_link&utm_campaign=creatorshare_creator&utm_content=copyLink"
                target="_blank"
                rel="noopener noreferrer"
                onClick={closeDesktopDonation}
                className="
                  group
                  flex
                  items-center
                  gap-4
                  rounded-2xl
                  border
                  border-border
                  bg-surface
                  p-4
                  transition-all
                  duration-200
                  hover:-translate-y-0.5
                  hover:border-primary/40
                  hover:bg-surface-secondary
                  hover:shadow-md
                "
              >
                <div
                  className="
                    flex
                    h-11
                    w-11
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-primary/10
                    text-primary
                  "
                >
                  <Heart size={19} />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold">
                    Patreon
                  </h3>

                  <p className="mt-0.5 text-sm text-muted">
                    Apoyo mensual al proyecto.
                  </p>
                </div>

                <span
                  className="
                    rounded-lg
                    bg-primary/10
                    px-3
                    py-1.5
                    text-xs
                    font-semibold
                    text-primary
                    transition
                    group-hover:bg-primary
                    group-hover:text-white
                  "
                >
                  Apoyar
                </span>
              </Link>

              {/* KO-FI */}

              <Link
                href="https://ko-fi.com/H8K72247VR"
                target="_blank"
                rel="noopener noreferrer"
                onClick={closeDesktopDonation}
                className="
                  group
                  flex
                  items-center
                  gap-4
                  rounded-2xl
                  border
                  border-border
                  bg-surface
                  p-4
                  transition-all
                  duration-200
                  hover:-translate-y-0.5
                  hover:border-primary/40
                  hover:bg-surface-secondary
                  hover:shadow-md
                "
              >
                <div
                  className="
                    flex
                    h-11
                    w-11
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-primary/10
                    text-primary
                  "
                >
                  <Coffee size={19} />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold">
                    Ko-fi
                  </h3>

                  <p className="mt-0.5 text-sm text-muted">
                    Una donación puntual.
                  </p>
                </div>

                <span
                  className="
                    rounded-lg
                    bg-primary/10
                    px-3
                    py-1.5
                    text-xs
                    font-semibold
                    text-primary
                    transition
                    group-hover:bg-primary
                    group-hover:text-white
                  "
                >
                  Donar
                </span>
              </Link>

              {/* MERCADO PAGO */}

              <Link
                href="https://mpago.la/12y4Uq1"
                target="_blank"
                rel="noopener noreferrer"
                onClick={closeDesktopDonation}
                className="
                  group
                  flex
                  items-center
                  gap-4
                  rounded-2xl
                  border
                  border-border
                  bg-surface
                  p-4
                  transition-all
                  duration-200
                  hover:-translate-y-0.5
                  hover:border-primary/40
                  hover:bg-surface-secondary
                  hover:shadow-md
                "
              >
                <div
                  className="
                    flex
                    h-11
                    w-11
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-primary/10
                    text-primary
                  "
                >
                  <CreditCard size={19} />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold">
                    Mercado Pago
                  </h3>

                  <p className="mt-0.5 text-sm text-muted">
                    Donación rápida y directa.
                  </p>
                </div>

                <span
                  className="
                    rounded-lg
                    bg-primary/10
                    px-3
                    py-1.5
                    text-xs
                    font-semibold
                    text-primary
                    transition
                    group-hover:bg-primary
                    group-hover:text-white
                  "
                >
                  Donar
                </span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ================================================== */}
      {/* MOBILE MENU */}
      {/* ================================================== */}

      {mobileOpen && (
        <div
          className="
            fixed
            inset-0
            z-[100]
            bg-black/50
            backdrop-blur-sm
            md:hidden
          "
          onMouseDown={closeMobileMenu}
        >
          <aside
            className="
              absolute
              right-0
              top-0
              h-screen
              w-[78vw]
              max-w-[400px]
              border-l
              border-border
              bg-background
              shadow-2xl
            "
            onMouseDown={(event) =>
              event.stopPropagation()
            }
            role="dialog"
            aria-modal="true"
            aria-label="Menú móvil"
          >
            {/* PANEL HEADER */}

            <div
              className="
                flex
                h-[72px]
                items-center
                justify-between
                border-b
                border-border/60
                px-5
              "
            >
              <div className="flex items-center gap-2">
                <div
                  className="
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-lg
                    bg-primary/10
                    text-primary
                  "
                >
                  <Sparkles size={16} />
                </div>

                <span className="font-heading font-semibold">
                  FoxCraft
                </span>
              </div>

              <button
                type="button"
                onClick={closeMobileMenu}
                aria-label="Cerrar menú"
                className="
                  rounded-xl
                  p-2
                  text-muted
                  transition
                  hover:bg-surface-secondary
                  hover:text-foreground
                "
              >
                <X size={22} />
              </button>
            </div>

            {/* PANEL CONTENT */}

            <nav className="flex flex-col gap-1 overflow-y-auto p-4">
              <Link
                href="/"
                onClick={closeMobileMenu}
                className="
                  rounded-xl
                  px-4
                  py-3
                  text-sm
                  font-medium
                  transition
                  hover:bg-surface-secondary
                "
              >
                Inicio
              </Link>

              <Link
                href="/explore"
                onClick={closeMobileMenu}
                className="
                  rounded-xl
                  px-4
                  py-3
                  text-sm
                  font-medium
                  transition
                  hover:bg-surface-secondary
                "
              >
                Explorar
              </Link>

              <Link
                href="/explore?category=mods"
                onClick={closeMobileMenu}
                className="
                  rounded-xl
                  px-4
                  py-3
                  text-sm
                  font-medium
                  transition
                  hover:bg-surface-secondary
                "
              >
                Mods
              </Link>

              <Link
                href="/explore?category=maps"
                onClick={closeMobileMenu}
                className="
                  rounded-xl
                  px-4
                  py-3
                  text-sm
                  font-medium
                  transition
                  hover:bg-surface-secondary
                "
              >
                Mapas
              </Link>

              <Link
                href="/explore?category=textures"
                onClick={closeMobileMenu}
                className="
                  rounded-xl
                  px-4
                  py-3
                  text-sm
                  font-medium
                  transition
                  hover:bg-surface-secondary
                "
              >
                Textures
              </Link>

              {/* DONACIONES */}

              <div className="mt-2 rounded-2xl p-1.5">
                <button
                  type="button"
                  onClick={() =>
                    setDonationsOpen(
                      (value) => !value,
                    )
                  }
                  className="
                    flex
                    w-full
                    items-center
                    justify-between
                    rounded-xl
                    px-3
                    py-3
                    text-sm
                    font-medium
                    transition
                    hover:bg-surface-secondary
                  "
                  aria-expanded={donationsOpen}
                >
                  <span className="flex items-center gap-2.5">
                    <span
                      className="
                        flex
                        h-8
                        w-8
                        items-center
                        justify-center
                        rounded-lg
                        bg-primary/10
                        text-primary
                      "
                    >
                      <Heart size={16} />
                    </span>

                    Donaciones
                  </span>

                  <ChevronDown
                    size={17}
                    className={`
                      transition-transform
                      duration-200
                      ${
                        donationsOpen
                          ? "rotate-180"
                          : ""
                      }
                    `}
                  />
                </button>

                {donationsOpen && (
                  <div className="mt-1 space-y-1 px-1 pb-1">
                    <Link
                      href="https://patreon.com/Foxcrafting?utm_medium=unknown&utm_source=join_link&utm_campaign=creatorshare_creator&utm_content=copyLink"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={closeMobileMenu}
                      className="
                        flex
                        items-center
                        gap-3
                        rounded-xl
                        px-3
                        py-2.5
                        text-sm
                        text-muted
                        transition
                        hover:bg-surface-secondary
                        hover:text-foreground
                      "
                    >
                      <Heart size={16} />
                      Patreon
                    </Link>

                    <Link
                      href="https://ko-fi.com/H8K72247VR"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={closeMobileMenu}
                      className="
                        flex
                        items-center
                        gap-3
                        rounded-xl
                        px-3
                        py-2.5
                        text-sm
                        text-muted
                        transition
                        hover:bg-surface-secondary
                        hover:text-foreground
                      "
                    >
                      <Coffee size={16} />
                      Ko-fi
                    </Link>

                    <Link
                      href="https://mpago.la/12y4Uq1"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={closeMobileMenu}
                      className="
                        flex
                        items-center
                        gap-3
                        rounded-xl
                        px-3
                        py-2.5
                        text-sm
                        text-muted
                        transition
                        hover:bg-surface-secondary
                        hover:text-foreground
                      "
                    >
                      <CreditCard size={16} />
                      Mercado Pago
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          </aside>
        </div>
      )}
    </>
  );
}