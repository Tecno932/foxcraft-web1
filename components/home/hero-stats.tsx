import {
  Download,
  Package,
  Map,
  Sparkles,
} from "lucide-react";

const stats = [
  {
    icon: Package,
    label: "Mods",
    value: "250+",
  },
  {
    icon: Map,
    label: "Mapas",
    value: "80+",
  },
  {
    icon: Sparkles,
    label: "Shaders",
    value: "40+",
  },
  {
    icon: Download,
    label: "Descargas",
    value: "120K+",
  },
];

export function HeroStats() {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.label}
            className="
            rounded-2xl
            border
            border-border
            bg-surface/80
            p-5
            backdrop-blur
            "
          >
            <Icon
              size={22}
              className="mb-3 text-primary"
            />

            <h3 className="text-2xl font-bold">
              {stat.value}
            </h3>

            <p className="text-sm text-muted">
              {stat.label}
            </p>
          </div>
        );
      })}
    </div>
  );
}