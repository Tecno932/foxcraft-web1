import Link from "next/link";
import Image from "next/image";
import { ASSETS } from "@/constants";

export function Logo() {
  return (
    <Link
      href="/"
      className="
      flex
      items-center
      gap-3
      transition-opacity
      hover:opacity-80
      "
    >
      <div
        className="
        flex
        h-10
        w-10
        items-center
        justify-center
        rounded-xl
        bg-primary
        text-white
        shadow-lg
        shadow-primary/25
        "
      >
        <Image
          src={ASSETS.logo.full}
          alt="FoxCraft"
          width={180}
          height={40}
          priority
        />
      </div>

      <div>
        <h2 className="text-lg font-bold">
          FoxCraft
        </h2>

        <p className="text-xs text-muted">
          Minecraft Platform
        </p>
      </div>
    </Link>
  );
}