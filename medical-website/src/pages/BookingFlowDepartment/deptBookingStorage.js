export const saveDeptBooking = (data) => {
  const current = JSON.parse(localStorage.getItem("deptBooking") || "{}");
  const updated = { ...current, ...data };
  localStorage.setItem("deptBooking", JSON.stringify(updated));
};

export const getDeptBooking = () => {
  return JSON.parse(localStorage.getItem("deptBooking") || "{}");
};
