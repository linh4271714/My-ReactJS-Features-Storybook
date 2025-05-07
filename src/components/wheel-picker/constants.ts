export const getTotalDaysInMonth = (year: number, month: number) => {
  return new Date(year, month, 0).getDate();
};

export const monthItemLabels = [
  {
    label: "January", // January
    value: 1,
  },
  {
    label: "February", // February
    value: 2,
  },
  {
    label: "March", // March
    value: 3,
  },
  {
    label: "April", // April
    value: 4,
  },
  {
    label: "May", // May
    value: 5,
  },
  {
    label: "June", // June
    value: 6,
  },
  {
    label: "July", // July
    value: 7,
  },
  {
    label: "August", // August
    value: 8,
  },
  {
    label: "September", // September
    value: 9,
  },
  {
    label: "October", // October
    value: 10,
  },
  {
    label: "November", // November
    value: 11,
  },
  {
    label: "December", // December
    value: 12,
  },
];

export const monthItems = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

export const yearItems = Array.from(
  { length: 51 },
  (_, i) => new Date().getFullYear() - 50 + i
);
