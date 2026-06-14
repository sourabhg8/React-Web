// windowConfig.ts

export type PerformanceWindow = "YTD" | "QTD" | "MTD" | "F4M" | "F6M" | "L12M";

export type PerformanceWindowType = "FixedWindow" | "SlidingWindow";

export interface WindowConfig {
  measurementWindow: PerformanceWindow;
  pattern: PerformanceWindowType;
  durationMonths: number;
  usePreviousCompletedPeriod?: boolean;
  lookbackMonths?: number;
  startFromJoiningDate?: boolean;
}

export const WINDOW_CONFIG: WindowConfig[] = [
  {
    measurementWindow: "YTD",
    pattern: "FixedWindow",
    durationMonths: 12,
    usePreviousCompletedPeriod: true,
  },
  {
    measurementWindow: "QTD",
    pattern: "FixedWindow",
    durationMonths: 3,
    usePreviousCompletedPeriod: true,
  },
  {
    measurementWindow: "MTD",
    pattern: "FixedWindow",
    durationMonths: 1,
    usePreviousCompletedPeriod: true,
  },
  {
    measurementWindow: "F4M",
    pattern: "FixedWindow",
    durationMonths: 4,
    startFromJoiningDate: true,
    usePreviousCompletedPeriod: true,
  },
  {
    measurementWindow: "F6M",
    pattern: "FixedWindow",
    durationMonths: 6,
    startFromJoiningDate: true,
    usePreviousCompletedPeriod: true,
  },
  {
    measurementWindow: "L12M",
    pattern: "SlidingWindow",
    durationMonths: 12,
    lookbackMonths: 11,
  },
];
