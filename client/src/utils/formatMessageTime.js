export const formatMessageTime = (date) => {
  if (!date) return ""; // agar date missing ho
  const d = new Date(date);
  if (isNaN(d.getTime())) return ""; // agar invalid date ho
  return new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false, // 24-hour format
  }).format(d);
};
