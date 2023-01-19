import { YEAR_STEP } from '$src/lib/consts';
import type { Genre } from '$types/data';

/**
 * calculate year's range, return maxYear and minYear
 * @param data
 * @returns
 */
export function yearRange(data: Genre[]) {
  let minYear = Infinity;
  let maxYear = -Infinity;
  data.map((d: Genre) => {
    if (minYear > d.year_start) minYear = d.year_start;
    if (maxYear < d.year_finish) maxYear = d.year_finish;
  });

  const currentYear = new Date().getFullYear();
  if (maxYear > currentYear) {
    maxYear = currentYear;
  }

  return { minYear, maxYear };
}

/**
 * compute the canvas height
 * @param { minYear, maxYear }
 * @returns
 */
export function computeCanvasHeight({
  minYear,
  maxYear,
  yearHeight
}: {
  minYear: number;
  maxYear: number;
  yearHeight: number;
}): number {
  return ((maxYear - minYear) / YEAR_STEP + 1) * yearHeight;
}

export function computeCanvasSize(data: Genre[], yearHeight: number) {
  if (!data || !data.length) {
    console.error('No data');
  }

  const { minYear, maxYear } = yearRange(data);
  const canvasHeight = computeCanvasHeight({ minYear, maxYear, yearHeight });
  return { minYear, maxYear, canvasHeight };
}

export function computeStats(data: Genre[]) {
  const themes = new Set();
  const musical_features = new Set();
  const instruments = new Set();
  const traditions = new Set();
  const colors = new Map();

  data.map((d) => {
    d.themes.map((t) => themes.add(t.title));
    d.musical_features.map((t) => musical_features.add(t.title));
    d.instruments.map((t) => instruments.add(t.title));
    traditions.add(d.tradition.title);
    colors.set(d.tradition.title, d.tradition.secondary_color!);
  });

  return { themes, musical_features, instruments, traditions, colors };
}
