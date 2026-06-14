function handleJoiningWindow(
  config: WindowConfig,
  currentMonth: number,
  currentYear: number,
  joiningMonth: number,
  joiningYear: number,
): MeasurementWindowResult {
  const start = { month: joiningMonth, year: joiningYear };
  const windowEnd = addMonths(start, config.durationMonths - 1);

  const lastCompleted = addMonths(
    { month: currentMonth, year: currentYear },
    -1,
  );

  const effectiveEnd =
    compareMonthYear(lastCompleted, windowEnd) < 0 ? lastCompleted : windowEnd;

  const periods =
    compareMonthYear(effectiveEnd, start) >= 0
      ? generateMonthRange(start, effectiveEnd)
      : [];

  const monthsLeft =
    compareMonthYear({ month: currentMonth, year: currentYear }, windowEnd) > 0
      ? 0
      : countMonthsInclusive(
          { month: currentMonth, year: currentYear },
          windowEnd,
        );

  return { periods, monthsLeft };
}
