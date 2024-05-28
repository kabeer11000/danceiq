import { create } from "zustand";

export const useSocketConnectionState = create<{
    connected: boolean, address: string, rawSocket: WebSocket | null, model: {
        name: string
    } | null, client: {
        version: string
    } | null, setAddress: (address: string) => void, setClient: (version: string) => void, setModel: (name: string) => void, setConnected: (connected: boolean) => void, setRawSocket: (rawSocket: WebSocket) => void,
}>((set, get) => ({
    connected: false, address: "", rawSocket: null, model: null, client: null,
    setClient: (version: string) => set({ client: { version } }),
    setModel: (name: string) => set({ model: { name } }),
    setConnected: (connected: boolean) => set({ connected }),
    setAddress: (address: string) => set({ address }),
    setRawSocket: (rawSocket: WebSocket) => set({ rawSocket })
}));