import create from 'zustand';

type Exploration = {
  title: string;
  type: string;
  href: string;
};

type UseExplorations = {
  explorations: Exploration[];
  add(exploration: Exploration): void;
};

export const useExplorations = create<UseExplorations>((set) => ({
  explorations: [],
  add: (exploration) =>
    set(({ explorations }) => {
      const newExplorations = explorations.filter(
        ({ href }) => href !== exploration.href
      );

      return { explorations: [exploration, ...newExplorations] };
    })
}));
