import Image from "next/image";

export function HeroPreview() {
  return (
    <div
      className="
        relative
        hidden
        items-center
        justify-center
        lg:flex
      "
    >
      {/* Glow */}
      <div
        className="
          absolute
          h-96
          w-96
          rounded-full
          bg-primary/20
          blur-[120px]
        "
      />

      {/* Logo */}
      <div className="relative">
        <Image
          src="/logo/logo-icon.png"
          alt="FoxCraft"
          width={640}
          height={380}
          priority
          className="
            object-contain
            [mask-image:linear-gradient(to_bottom,black_45%,transparent_100%),linear-gradient(to_right,black_45%,transparent_100%)]
            [mask-composite:intersect]
            [-webkit-mask-image:linear-gradient(to_bottom,black_45%,transparent_100%),linear-gradient(to_right,black_45%,transparent_100%)]
            [-webkit-mask-composite:source-in]
          "
        />
      </div>
    </div>
  );
}