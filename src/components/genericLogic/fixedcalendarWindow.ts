function handleCalendarWindow(
  config: WindowConfig,
  currentMonth: number,
  currentYear: number,
): MeasurementWindowResult {
  let startMonth = 1;
  let endMonth = currentMonth - 1;
  let windowEndMonth = 12;

  if (config.measurementWindow === "QTD") {
    startMonth = getQuarterStartMonth(currentMonth);
    windowEndMonth = startMonth + 2;
  }

  if (config.measurementWindow === "MTD") {
    startMonth = currentMonth;
    endMonth = currentMonth - 1;
    windowEndMonth = currentMonth;
  }

  const periods =
    endMonth >= startMonth
      ? generateMonthRange(
          { month: startMonth, year: currentYear },
          { month: endMonth, year: currentYear },
        )
      : [];

  const monthsLeft =
    config.measurementWindow === "MTD"
      ? 1
      : countMonthsInclusive(
          { month: currentMonth, year: currentYear },
          { month: windowEndMonth, year: currentYear },
        );

  return { periods, monthsLeft };
}
