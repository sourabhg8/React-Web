function handleSlidingWindow(
  config: WindowConfig,
  currentMonth: number,
  currentYear: number,
): MeasurementWindowResult {
  const lookback = config.lookbackMonths ?? config.durationMonths - 1;

  const end = addMonths({ month: currentMonth, year: currentYear }, -1);
  const start = addMonths(end, -(lookback - 1));

  const periods = generateMonthRange(start, end);

  return {
    periods,
    monthsLeft: config.durationMonths - lookback,
  };
}
