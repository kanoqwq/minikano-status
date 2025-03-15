export type KanoStatus = {
    name: string,
    type: 'phone' | 'browser' | string,
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
        cellularStatus?: '4G' | '5G' | '3G',
        F50_config: {
            "network_type": string,
            "network_provider": string,
            "wifi_access_sta_num": string,
            "rssi": number,
            "Z5g_rsrp": number,
            "loginfo": string,
            "realtime_rx_bytes": number,
            "realtime_tx_bytes": number,
            "realtime_time": number,
            "monthly_tx_bytes": number,
            "monthly_rx_bytes": number,
            "monthly_time": number,
            "data_volume_limit_size": string,
            "data_volume_alert_percent": string,
            "realtime_rx_thrpt": number,
            "realtime_tx_thrpt": number
        }
    }
}

export type F50SMSItem = {
    content: string,
    date: string,
    draft_group_id: string,
    id: string,
    number: string,
    tag: string
}

export type F50SMSItemList = Array<F50SMSItem>