"use client";

import { Search, X } from "lucide-react";
import { useTranslations } from "next-intl";

interface SearchBarProps {
  searchText: string;
  onSearchChange: (value: string) => void;
  clearSearch: () => void;
  placeholder: string;
}

export function SearchBar({
  searchText,
  onSearchChange,
  clearSearch,
  placeholder,
}: SearchBarProps) {
  const t = useTranslations();

  return (
    <div className="relative">
      <input
        type="text"
        value={searchText}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder={placeholder}
        className="w-full py-2 pl-10 pr-12 text-gray-700 bg-white border rounded-full focus:outline-none focus:border-secondary"
      />
      <div className="absolute inset-y-0 left-0 flex items-center pl-3">
        <Search className="w-5 h-5 text-primary" />
      </div>
      {searchText && (
        <button
          onClick={clearSearch}
          className="absolute inset-y-0 right-0 flex items-center pr-3"
        >
          <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
        </button>
      )}
    </div>
  );
}
