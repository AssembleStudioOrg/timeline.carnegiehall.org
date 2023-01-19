import create from 'zustand';

type Filters = {
  instruments?: Set<string>;
  musical_features?: Set<string>;
  themes?: Set<string>;
  yearRange?: string[]; // refer to lib/consts
};
type UseTimeline = {
  showCrossLinks: boolean; // refer to lib/consts
  setShowCrossLinks(value: boolean): void;
  filters: Filters;
  setFilters(filters: Filters): void;
};

export const useTimeline = create<UseTimeline>((set) => {
  return {
    showCrossLinks: true,
    setShowCrossLinks: (value) => set({ showCrossLinks: value }),
    filters: {},
    setFilters: (filters) => set({ filters })
  };
});
