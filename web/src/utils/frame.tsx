import { IAsyncFrameDataResponse } from "@/types/events-map";

export async function handleAsyncFrameDataResponse (socket: WebSocket, event: MessageEvent, data: IAsyncFrameDataResponse) {
    // Update Zustand for page.
    // Handle rendering using requestAnimationFrame();
};