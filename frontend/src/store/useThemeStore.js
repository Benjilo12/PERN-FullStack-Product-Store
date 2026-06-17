import { create } from "zustand";

export const useThemeStore = create((set) => ({
  //* Restore the last selected theme so the UI stays consistent after refresh.
  theme: localStorage.getItem("preferred-theme") || "forest",
  //* Keep the store and persisted preference in sync whenever the theme changes.
  setTheme: (theme) => {
    localStorage.setItem("preferred-theme", theme);
    set({ theme });
  },
}));
