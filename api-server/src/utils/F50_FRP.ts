import Config from 'dotenv'
const config = Config.config()

const baseURL = config.parsed?.HOST_ADDR

const getData = async () => {
    try {
        const params = new URLSearchParams()
        params.append('_', Date.now().toString())
        const cmd = 'rssi,Z5g_rsrp,wifi_access_sta_num,loginfo,data_volume_alert_percent,data_volume_limit_size,realtime_rx_thrpt,realtime_tx_thrpt,realtime_time,monthly_tx_bytes,monthly_rx_bytes,monthly_time,network_type,network_provider'
        const res = await fetch("http://" + baseURL + "/goform/goform_get_cmd_process?multi_data=1&isTest=false&cmd=" + cmd + "&" + params, {
            headers: {
                "referer": 'http://192.168.0.11/',
                "host": '192.168.0.1'
            }
        })

        return await res.json()

    } catch {
        return null
    }
}
let data: any = {}
let timer: any = null
let timing = false // 默认值为false，避免初始时直接触发

export const getF50DataOverFrp = async () => {
    if (timing) {
        return data; // 如果正在计时，直接返回当前数据
    }

    clearTimeout(timer);

    timing = true;

    data = await getData();

    timer = setTimeout(() => {
        timing = false;
    }, 2000);

    return data;
}