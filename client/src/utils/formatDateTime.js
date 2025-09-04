
export const formatDateTime = (date) => {
  return new Intl.DateTimeFormat("en-IN", {
    year: "numeric",
    month: "short",   // "Jan", "Feb", etc.
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false     // 24-hour format
  }).format(new Date(date));
};



