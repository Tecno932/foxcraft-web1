import Image from "next/image";

export function HeroPreview() {
  return (
    <div
      className="
      relative
      hidden
      lg:flex
      items-center
      justify-center
      "
    >
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

      <div
        className="
        relative
        overflow-hidden
        rounded-3xl
        border
        border-border
        bg-surface
        shadow-2xl
        "
      >
        <Image
          src="/images/mods/scp-dystopia.webp"
          alt="FoxCraft Preview"
          width={640}
          height={380}
          className="object-cover"
        />
      </div>
    </div>
  );
}