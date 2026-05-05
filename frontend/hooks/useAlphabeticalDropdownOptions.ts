import { useMemo } from 'react';

interface DropdownOptionShape {
  label?: string;
  name?: string;
  title?: string;
  value?: string;
  id?: string;
}

type DropdownOption = string | DropdownOptionShape;

const collator = new Intl.Collator(undefined, {
  numeric: true,
  sensitivity: 'base',
});

function defaultGetLabel<T extends DropdownOption>(item: T): string {
  if (typeof item === 'string') {
    return item;
  }

  return item.label ?? item.name ?? item.title ?? item.value ?? item.id ?? '';
}

export function sortAlphabeticalDropdownOptions<T extends DropdownOption>(
  items: readonly T[],
  getLabel: (item: T) => string = defaultGetLabel,
): T[] {
  return [...items].sort((left, right) => {
    const leftLabel = getLabel(left).trim();
    const rightLabel = getLabel(right).trim();

    return collator.compare(leftLabel, rightLabel);
  });
}

export function useAlphabeticalDropdownOptions<T extends DropdownOption>(
  items: readonly T[],
  getLabel: (item: T) => string = defaultGetLabel,
): T[] {
  return useMemo(() => sortAlphabeticalDropdownOptions(items, getLabel), [items, getLabel]);
}

export default useAlphabeticalDropdownOptions;
