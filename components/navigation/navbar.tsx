"use client";

import { GitBranch } from "lucide-react";
import Link from "next/link";

import {
  Button,
  Container,
} from "@/components/ui";

import { useScroll } from "@/hooks";

import { Logo } from "./logo";
import { NavLinks } from "./nav-links";

export function Navbar() {
  const scrolled = useScroll();

  return (
    <header
      className={`
      sticky
      top-0
      z-50
      transition-all
      duration-300

      ${
        scrolled
          ? "border-b border-border bg-background/70 backdrop-blur-xl"
          : "bg-transparent"
      }
      `}
    >
      <Container>
        <div
          className="
          flex
          h-20
          items-center
          justify-between
          "
        >
          <Logo />

          <NavLinks />

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              asChild
            >
              <Link
                href="https://GitBranch.com/"
                target="_blank"
              >
                <GitBranch size={18} />
              </Link>
            </Button>

            <Button asChild>
              <Link href="/explore">
                Explorar
              </Link>
            </Button>
          </div>
        </div>
      </Container>
    </header>
  );
}