"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchIcon, ChevronLeft, ChevronRight, ArrowUp, ArrowDown, ArrowUpDown, SearchX } from "lucide-react";
import { TableHead } from "@/components/ui/table";
import type { SortState } from "@/lib/use-table-search";

interface TableSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function TableSearch({ value, onChange, placeholder = "Buscar..." }: TableSearchProps) {
  return (
    <div className="relative w-full max-w-xs">
      <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-8"
      />
    </div>
  );
}

interface SortableHeadProps {
  label: string;
  sortKey: string;
  sort: SortState<string>;
  onToggle: (key: string) => void;
  className?: string;
}

export function SortableHead({ label, sortKey, sort, onToggle, className }: SortableHeadProps) {
  const active = sort.key === sortKey;
  return (
    <TableHead className={className}>
      <button
        type="button"
        onClick={() => onToggle(sortKey)}
        className="flex items-center gap-1 hover:text-foreground transition-colors -my-1"
      >
        {label}
        {active ? (
          sort.direction === "asc" ? <ArrowUp className="size-3.5" /> : <ArrowDown className="size-3.5" />
        ) : (
          <ArrowUpDown className="size-3 text-muted-foreground/50" />
        )}
      </button>
    </TableHead>
  );
}

interface TablePaginationProps {
  page: number;
  totalPages: number;
  totalFiltered: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

export function TableEmpty({ search }: { search: string }) {
  if (!search) return null;
  return (
    <div className="flex flex-col items-center gap-2 py-8 text-muted-foreground">
      <SearchX className="size-8" />
      <p className="text-sm">No se encontraron resultados para &quot;{search}&quot;</p>
    </div>
  );
}

export function TablePagination({
  page,
  totalPages,
  totalFiltered,
  totalItems,
  onPageChange,
}: TablePaginationProps) {
  if (totalPages <= 1 && totalFiltered === totalItems) return null;

  return (
    <div className="flex items-center justify-between text-sm text-muted-foreground">
      <span>
        {totalFiltered === totalItems
          ? `${totalItems} registros`
          : `${totalFiltered} de ${totalItems} registros`}
      </span>
      {totalPages > 1 && (
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon-sm"
            aria-label="Página anterior"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
          >
            <ChevronLeft />
          </Button>
          <span className="px-2">
            {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="icon-sm"
            aria-label="Página siguiente"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
          >
            <ChevronRight />
          </Button>
        </div>
      )}
    </div>
  );
}
