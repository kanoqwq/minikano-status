import Config from 'dotenv'
import { SHA256, gsmEncode } from './utils'
const config = Config.config()

const baseURL = config.parsed?.HOST_ADDR
const PASSWORD = config.parsed?.F50_PASSWORD

const common_headers = {
    "referer": 'http://' + '192.168.0.11' + '/index.html',
    "host": '192.168.0.1',
    "user-agent": 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36 Edg/134.0.0.0'
}

export const login = async () => {
    const { LD } = await getLD()
    if (!LD) throw new Error('无法获取LD')
    const pwd = SHA256(SHA256(PASSWORD) + LD)
    const res = await fetch("http://" + baseURL + "/goform/goform_set_cmd_process", {
        method: "POST",
        headers: {
            ...common_headers,
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
            "goformId": "LOGIN",
            "isTest": "false",
            "password": pwd
        })
    })
    return (res.headers as any).get('set-cookie').split(';')[0]
}

export const logout = async (cookie: any) => {
    const AD = await processAD(cookie)
    const res = await fetch("http://" + baseURL + "/goform/goform_set_cmd_process", {
        method: "POST",
        headers: {
            ...common_headers,
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
        },
        body: new URLSearchParams({
            "goformId": "LOGOUT",
            "isTest": "false",
            AD: AD
        })
    })
    return await res.text()
}

const getLD = async () => {
    const res = await fetch("http://" + baseURL + "/goform/goform_get_cmd_process?isTest=false&cmd=LD&_=" + Date.now(), {
        method: "GET",
        headers: {
            ...common_headers,
        }
    })
    return await res.json()
}


const getRD = async (cookie: any) => {
    if (!cookie) throw new Error('请提供cookie')
    const res = await fetch("http://" + baseURL + "/goform/goform_get_cmd_process?isTest=false&cmd=RD&_=" + Date.now(), {
        method: "GET",
        headers: {
            ...common_headers,
            "Cookie": cookie
        }
    })
    return await res.json()
}

const processAD = async (cookie: any) => {
    const { wa_inner_version, cr_version } = await getUFIInfo()
    if (!wa_inner_version || !cr_version) throw new Error('无法获取版本信息')
    const parsedInfo = SHA256(wa_inner_version + cr_version)
    const { RD } = await getRD(cookie)
    const AD = SHA256(parsedInfo + RD)
    return AD
}

export const getData = async (data = new URLSearchParams({})) => {
    data.append('isTest', 'false')
    data.append('_', Date.now().toString())
    const res = await fetch("http://" + baseURL + "/goform/goform_get_cmd_process?" + data.toString(), {
        method: "GET",
        headers: {
            ...common_headers,
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
    })
    return await res.json()
}

export const postData = async (cookie: any, data = {}) => {
    const AD = await processAD(cookie)
    const res = await fetch("http://" + baseURL + "/goform/goform_set_cmd_process", {
        method: "POST",
        headers: {
            ...common_headers,
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            "Cookie": cookie
        },
        body: new URLSearchParams({
            ...data,
            isTest: false,
            "AD": AD
        } as any)
    })
    return res
}

export const reboot = async (cookie: any) => {
    const res = await postData(cookie, {
        goformId: 'REBOOT_DEVICE',
    })
    return res
}

// 发送短信
export const sendSms = async ({ content, number }:{content:string,number:string}) => {
    if (!content) throw new Error('请提供短信内容')
    if (!number) throw new Error('请提供手机号')
    const cookie = await login()
    const res = await postData(cookie, {
        goformId: 'SEND_SMS',
        Number: number,
        MessageBody: gsmEncode(content)
    })
    await logout(cookie)
    return await res.json()
}

//删除短信
export const removeSmsById = async (id: any) => {
    if (!id) throw new Error('请提供短信id')
    const cookie = await login()
    const res = await postData(cookie, {
        goformId: 'DELETE_SMS',
        msg_id: id,
        notCallback: true
    })
    await logout(cookie)
    return await res.json()
}

const getUFIInfo = async () => {
    const res = await fetch("http://" + baseURL + "/goform/goform_get_cmd_process?isTest=false&cmd=Language,cr_version,wa_inner_version&multi_data=1&_=" + Date.now(), {
        method: "GET",
        headers: {
            ...common_headers
        }
    })
    return await res.json()
}


const getUFIData = async () => {
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

//获取短信列表（base64编码）
export const getSmsInfoOverFrp = async () => {
    const params = new URLSearchParams()
    params.append('_', Date.now().toString())
    const res = await fetch("http://" + baseURL + "/goform/goform_get_cmd_process?multi_data=1&isTest=false&cmd=sms_data_total&page=0&data_per_page=500&mem_store=1&tags=100&order_by=order by id desc&" + params, {
        headers: {
            "referer": 'http://192.168.0.11/',
            "host": '192.168.0.1'
        }
    })
    return await res.json()
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

    data = await getUFIData();

    timer = setTimeout(() => {
        timing = false;
    }, 2000);

    return data;
}