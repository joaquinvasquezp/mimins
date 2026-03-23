import { useState, useMemo, useCallback } from "react";

const PAGE_SIZE = 10;

export type SortDirection = "asc" | "desc";

export interface SortState<K> {
  key: K | null;
  direction: SortDirection;
}

export function useTableSearch<T>(
  items: T[],
  searchFn: (item: T, query: string) => boolean,
  pageSize = PAGE_SIZE
) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<SortState<string>>({ key: null, direction: "asc" });

  const filtered = useMemo(() => {
    if (!search.trim()) return items;
    const q = search.toLowerCase().trim();
    return items.filter((item) => searchFn(item, q));
  }, [items, search, searchFn]);

  const sorted = useMemo(() => {
    if (!sort.key) return filtered;
    return [...filtered].sort((a, b) => {
      const aVal = getNestedValue(a, sort.key!);
      const bVal = getNestedValue(b, sort.key!);
      const cmp = compare(aVal, bVal);
      return sort.direction === "asc" ? cmp : -cmp;
    });
  }, [filtered, sort]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paged = sorted.slice((safePage - 1) * pageSize, safePage * pageSize);

  const handleSearch = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);

  const toggleSort = useCallback((key: string) => {
    setSort((prev) => {
      if (prev.key === key) {
        return prev.direction === "asc"
          ? { key, direction: "desc" }
          : { key: null, direction: "asc" };
      }
      return { key, direction: "asc" };
    });
    setPage(1);
  }, []);

  return {
    search,
    setSearch: handleSearch,
    page: safePage,
    setPage,
    totalPages,
    paged,
    totalFiltered: sorted.length,
    totalItems: items.length,
    sort,
    toggleSort,
  };
}

function getNestedValue(obj: unknown, path: string): unknown {
  return path.split(".").reduce((v: unknown, k) => {
    if (v != null && typeof v === "object") return (v as Record<string, unknown>)[k];
    return undefined;
  }, obj);
}

function compare(a: unknown, b: unknown): number {
  if (a == null && b == null) return 0;
  if (a == null) return -1;
  if (b == null) return 1;
  if (typeof a === "number" && typeof b === "number") return a - b;
  if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime();
  const sa = String(a);
  const sb = String(b);
  // Try date strings
  if (isDateLike(sa) && isDateLike(sb)) return new Date(sa).getTime() - new Date(sb).getTime();
  return sa.localeCompare(sb, "es-CL");
}

function isDateLike(s: string): boolean {
  return /^\d{4}-\d{2}-\d{2}/.test(s);
}
