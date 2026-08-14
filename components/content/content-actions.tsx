import Link from "next/link";
import {
  Download,
  ArrowUpRight,
} from "lucide-react";

import { Button } from "@/components/ui";

interface Props {
  download: string;
}

export function ContentActions({
  download,
}: Props) {
  return (
    <div className="flex flex-wrap gap-3">
      <Button
        asChild
        size="lg"
      >
        <Link
          href={download}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Download size={18} />

          Descargar
        </Link>
      </Button>

      <Button
        asChild
        variant="secondary"
        size="lg"
      >
        <Link href="/explore">
          <ArrowUpRight size={18} />

          Explorar más
        </Link>
      </Button>
    </div>
  );
}