export type IEventTypes = "get-remote-info-response" | "get-library-response" | "async-frame-data-response"
export interface IBaseEvent {
    __type: IEventTypes
}
export interface IRemoteInfoResponse extends IBaseEvent {
    version: string, model: string
}
export interface IAsyncFrameDataResponse extends IBaseEvent {
    correct: boolean, skeleton: Array<{x: number, y: number}>, initial: boolean 
}