export type IEventTypes = "get-remote-info-response" | "get-library-response" | "async-frame-data-response"
export interface IBaseEvent {
    __type: IEventTypes
}
export interface IRemoteInfoResponse extends IBaseEvent {
    data: { version: string, model: string }
}
export interface IAsyncFrameDataResponse extends IBaseEvent {
    data: { correct: boolean, skeleton: Array<{ x: number, y: number }>, initial: boolean }
}
export interface ILibraryInfoResponse extends IBaseEvent {
    data: Array<{id: string, poster: string, title: string}>
}
