// src/pages/BookingFlow/bookingStorage.js

const STORAGE_KEY = "bookingFlow";

export const getBooking = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

export const saveBooking = (partial) => {
  const current = getBooking();
  const merged = { ...current, ...partial };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  return merged;
};

export const clearBooking = () => {
  localStorage.removeItem(STORAGE_KEY);
};
