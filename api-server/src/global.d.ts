export type KanoStatus = {
    name: string,
    type: 'phone' | 'browser',
    isOnline: boolean,
    lastUpdated: number,
    detail: {
        isCharging?: boolean,
        battery?: number,
        isScreenOn?: boolean,
        wifiStatus?: 'connected' | 'disconnected',
        currentPageTabTitle?: string,
        cellularStatus?: '4G' | '5G' | '3G'
    }
}