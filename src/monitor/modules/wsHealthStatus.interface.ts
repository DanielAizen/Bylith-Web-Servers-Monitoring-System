export interface WebServerHealhStatus{
    port_id?: number
    status?: ServerStatus
    num_checks?: number
}

export enum ServerStatus{
    UnChecked = 0,
    Healthy = 1,
    UnHealthy = 2
}