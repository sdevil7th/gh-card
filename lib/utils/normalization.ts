export function normalizePercentages(
  items: { percentage: number }[],
): number[] {
  // 1. Calculate the refined integer part (floor)
  const integerParts = items.map((item) => Math.floor(item.percentage));

  // 2. Sum the integer parts
  const sum = integerParts.reduce((a, b) => a + b, 0);

  // 3. Calculate necessary remainder to reach 100
  let remainder = 100 - sum;

  // 4. Calculate the fractional parts for comparison
  const fractionalParts = items.map((item, index) => ({
    index,
    fraction: item.percentage - Math.floor(item.percentage),
  }));

  // 5. Sort by fractional part descending
  fractionalParts.sort((a, b) => b.fraction - a.fraction);

  // 6. Distribute the remainder +1 to the top items
  const result = [...integerParts];
  for (let i = 0; i < remainder; i++) {
    result[fractionalParts[i].index]++;
  }

  return result;
}
