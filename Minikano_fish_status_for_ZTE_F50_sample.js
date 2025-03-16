//注意，如果是在f50本机内发起请求，请将请求端口更改为8080

//获取基本数据
const getData = () => {
    const params = new URLSearchParams()
    params.append('_', Date.now())
    const cmd = 'rssi,Z5g_rsrp,wifi_access_sta_num,loginfo,data_volume_alert_percent,data_volume_limit_size,realtime_rx_thrpt,realtime_tx_thrpt,realtime_time,monthly_tx_bytes,monthly_rx_bytes,monthly_time,network_type,network_provider'
    fetch("http://192.168.0.1/goform/goform_get_cmd_process?multi_data=1&isTest=false&cmd=" + cmd + "&" + params, {
        headers: {
            "referer": 'http://192.168.0.1/',
            "host": '192.168.0.1'
        }
    })
        .then(res => res.json())
        .then(res => console.log(res))
}

//获取AP数据（热点名称，密码（base64编码），二维码，ssid什么的）
const getAPinfo = () => {
    const params = new URLSearchParams()
    params.append('_', Date.now())
    fetch("http://192.168.0.1/goform/goform_get_cmd_process?multi_data=1&isTest=false&cmd=queryAccessPointInfo&" + params, {
        headers: {
            "referer": 'http://192.168.0.1/',
            "host": '192.168.0.1'
        }
    })
        .then(res => res.json())
        .then(res => console.log(res))
}

//获取短信列表（base64编码）
const getSmsInfo = () => {
    const params = new URLSearchParams()
    params.append('_', Date.now())
    fetch("http://192.168.0.1/goform/goform_get_cmd_process?multi_data=1&isTest=false&cmd=sms_data_total&page=0&data_per_page=500&mem_store=1&tags=100&order_by=order by id desc&" + params, {
        headers: {
            "referer": 'http://192.168.0.1/',
            "host": '192.168.0.1'
        }
    })
        .then(res => res.json())
        .then(res => console.log(res))
}

getData()
getAPinfo()
getSmsInfo()