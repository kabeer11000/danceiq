import { create } from "zustand";

export const useMediaFeedState = create<{
    rawStream: MediaStream | null, live: boolean, setLive(live?: boolean): void, setRawStream(stream: MediaStream): void;
}>((set, get) => ({
    live: false, setLive: (l?: boolean) => set({ live: l ?? false }),
    rawStream: null,
    setRawStream: (rawStream: MediaStream) => set((state) => ({ rawStream })),
}))