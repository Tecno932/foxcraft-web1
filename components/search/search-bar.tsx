"use client";

import { Search } from "lucide-react";
import { useState } from "react";

import { Input } from "@/components/ui";

interface SearchBarProps {
  onSearch: (value: string) => void;
}

export function SearchBar({
  onSearch,
}: SearchBarProps) {
  const [value, setValue] =
    useState("");

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const text = event.target.value;

    setValue(text);
    onSearch(text);
  }

  return (
    <div className="relative w-full">
      <Search
        className="
          absolute
          left-4
          top-1/2
          -translate-y-1/2
          text-muted
        "
        size={20}
      />

      <Input
        value={value}
        onChange={handleChange}
        placeholder="Buscar mods, mapas, shaders..."
        className="
          h-12
          w-full
          rounded-xl
          border
          border-border
          bg-surface
          pl-12
          pr-4
          outline-none
          transition
          focus:border-primary
        "
      />
    </div>
  );
}