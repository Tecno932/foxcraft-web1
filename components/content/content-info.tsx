import {
  Calendar,
  Download,
  Gamepad2,
  User,
} from "lucide-react";

import type {
  ContentItem,
} from "@/types";

interface Props {
  item: ContentItem;
}

function formatDate(
  date: string,
) {
  const parsed =
    new Date(date);

  if (Number.isNaN(
    parsed.getTime(),
  )) {
    return date;
  }

  return parsed.toLocaleDateString(
    "es-AR",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    },
  );
}

export function ContentInfo({
  item,
}: Props) {
  return (
    <div
      className="
        grid
        gap-4
        sm:grid-cols-2
        lg:grid-cols-4
      "
    >

      {/* Autor */}
      <InfoItem
        icon={<User size={18} />}
        label="Autor"
        value={
          item.author ??
          "FoxCraft"
        }
      />

      {/* Versión */}
      <InfoItem
        icon={<Gamepad2 size={18} />}
        label="Minecraft"
        value={
          item.version.length > 0
            ? item.version.join(", ")
            : "Sin especificar"
        }
      />

      {/* Descargas */}
      <InfoItem
        icon={<Download size={18} />}
        label="Descargas"
        value={
          item.downloads
            .toLocaleString()
        }
      />

      {/* Fecha */}
      <InfoItem
        icon={<Calendar size={18} />}
        label="Agregado"
        value={formatDate(
          item.createdAt,
        )}
      />

    </div>
  );
}

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function InfoItem({
  icon,
  label,
  value,
}: InfoItemProps) {
  return (
    <div
      className="
        rounded-2xl
        border
        border-border
        bg-surface
        p-5
      "
    >
      <div
        className="
          flex
          items-center
          gap-2
          text-muted
        "
      >
        {icon}

        <span className="text-sm">
          {label}
        </span>
      </div>

      <p
        className="
          mt-3
          font-medium
        "
      >
        {value}
      </p>
    </div>
  );
}