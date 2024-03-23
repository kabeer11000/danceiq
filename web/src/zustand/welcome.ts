import { create } from "zustand";

export const useWelcomeDialog = create<{
    open: boolean, setOpen(open?: boolean): void;
}>((set, get) => ({
    open: false,
    setOpen: (open?: boolean) => set((state) => ({open: open ?? !state.open})),
}))