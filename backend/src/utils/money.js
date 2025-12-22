// Convert a monetary value to two decimal places
export const toTwo = (v) => Number(Number(v || 0).toFixed(2));
