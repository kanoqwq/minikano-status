export type KanoStatus = {
    name: string,
    type: 'phone' | 'browser',
    isOnline: boolean,
    lastUpdated: number,
    detail: {
        isCharging?: boolean,
        chargingText?: string,
        battery?: number,
        batteryCurrent?: number,
        batteryTemperature?: number,
        isScreenOn?: boolean,
        wifiStatus?: 'connected' | 'disconnected',
        currentPageTabTitle?: string,
        cellularStatus?: '4G' | '5G' | '3G'
    }
}