export const PRIORITIES = ["Low", "Medium", "High"];
export const STATUS_ORDER: Record<number, number> = { 0: 0, 1: 1, 2: 2 };
export const STATUS_COLOR: Record<number, string> = {
  0: "#ff6b6b",
  1: "#1ebeea",
  2: "#2ecc71",
};
export const STATUS_LABEL: Record<number, string> = {
  0: "Not Started",
  1: "In Progress",
  2: "Completed",
};
export const PRIORITY_COLOR: Record<string, string> = {
  Low: "#aaa",
  Medium: "#1ebeea",
  High: "#ff6b6b",
};