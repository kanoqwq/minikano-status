function SHA256(e) { function t(e, t) { var n = (65535 & e) + (65535 & t); return (e >> 16) + (t >> 16) + (n >> 16) << 16 | 65535 & n } function n(e, t) { return e >>> t | e << 32 - t } function r(e, t) { return e >>> t } function o(e, t, n) { return e & t ^ ~e & n } function i(e, t, n) { return e & t ^ e & n ^ t & n } function a(e) { return n(e, 2) ^ n(e, 13) ^ n(e, 22) } function s(e) { return n(e, 6) ^ n(e, 11) ^ n(e, 25) } function c(e) { return n(e, 7) ^ n(e, 18) ^ r(e, 3) } function u(e) { return n(e, 17) ^ n(e, 19) ^ r(e, 10) } var l = 8, d = 1; return e = function (e) { e = e.replace(/\\r\\n/g, "\\n"); for (var t = "", n = 0; n < e.length; n++) { var r = e.charCodeAt(n); r < 128 ? t += String.fromCharCode(r) : r > 127 && r < 2048 ? (t += String.fromCharCode(r >> 6 | 192), t += String.fromCharCode(63 & r | 128)) : (t += String.fromCharCode(r >> 12 | 224), t += String.fromCharCode(r >> 6 & 63 | 128), t += String.fromCharCode(63 & r | 128)) } return t }(e), function (e) { for (var t = d ? "0123456789ABCDEF" : "0123456789abcdef", n = "", r = 0; r < 4 * e.length; r++)n += t.charAt(e[r >> 2] >> 8 * (3 - r % 4) + 4 & 15) + t.charAt(e[r >> 2] >> 8 * (3 - r % 4) & 15); return n }(function (e, n) { var r, l, d, p, h, f, m, g, _, b, v, $, S = new Array(1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298), y = new Array(1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225), C = new Array(64); e[n >> 5] |= 128 << 24 - n % 32, e[15 + (n + 64 >> 9 << 4)] = n; for (var _ = 0; _ < e.length; _ += 16) { r = y[0], l = y[1], d = y[2], p = y[3], h = y[4], f = y[5], m = y[6], g = y[7]; for (var b = 0; b < 64; b++)C[b] = b < 16 ? e[b + _] : t(t(t(u(C[b - 2]), C[b - 7]), c(C[b - 15])), C[b - 16]), v = t(t(t(t(g, s(h)), o(h, f, m)), S[b]), C[b]), $ = t(a(r), i(r, l, d)), g = m, m = f, f = h, h = t(p, v), p = d, d = l, l = r, r = t(v, $); y[0] = t(r, y[0]), y[1] = t(l, y[1]), y[2] = t(d, y[2]), y[3] = t(p, y[3]), y[4] = t(h, y[4]), y[5] = t(f, y[5]), y[6] = t(m, y[6]), y[7] = t(g, y[7]) } return y }(function (e) { for (var t = Array(), n = (1 << l) - 1, r = 0; r < e.length * l; r += l)t[r >> 5] |= (e.charCodeAt(r / l) & n) << 24 - r % 32; return t }(e), e.length * l)) }
function gsmEncode(text) { function encodeText(text) { let encoded = []; for (let i = 0; i < text.length; i++) { const char = text[i]; const codePoint = char.codePointAt(0); if (codePoint <= 0xFFFF) { encoded.push((codePoint >> 8) & 0xFF); encoded.push(codePoint & 0xFF) } else { const highSurrogate = 0xD800 + ((codePoint - 0x10000) >> 10); const lowSurrogate = 0xDC00 + ((codePoint - 0x10000) & 0x3FF); encoded.push((highSurrogate >> 8) & 0xFF); encoded.push(highSurrogate & 0xFF); encoded.push((lowSurrogate >> 8) & 0xFF); encoded.push(lowSurrogate & 0xFF) } } return encoded } function toHexString(byteArray) { return byteArray.map(byte => byte.toString(16).padStart(2, '0')).join('') } const encodedBytes = encodeText(text); return toHexString(encodedBytes) }

//注意，如果是在f50本机内发起请求，请将请求端口更改为8080
const baseURL = '192.168.0.1'
const PASSWORD = '？'

//登录
const common_headers = {
    "referer": 'http://' + baseURL + '/index.html',
    "host": '192.168.0.1',
    "user-agent": 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36 Edg/134.0.0.0'
}

const login = async () => {
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
    return res.headers.get('set-cookie').split(';')[0]
}

const logout = async (cookie) => {
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


const getRD = async (cookie) => {
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

const getUFIInfo = async () => {
    const res = await fetch("http://" + baseURL + "/goform/goform_get_cmd_process?isTest=false&cmd=Language,cr_version,wa_inner_version&multi_data=1&_=" + Date.now(), {
        method: "GET",
        headers: {
            ...common_headers
        }
    })
    return await res.json()
}

const processAD = async (cookie) => {
    const { wa_inner_version, cr_version } = await getUFIInfo()
    if (!wa_inner_version || !cr_version) throw new Error('无法获取版本信息')
    const parsedInfo = SHA256(wa_inner_version + cr_version)
    const { RD } = await getRD(cookie)
    const AD = SHA256(parsedInfo + RD)
    return AD
}

const postData = async (cookie, data = {}) => {
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
        })
    })
    return res
}
const getData = async (data = new URLSearchParams({})) => {
    data.append('isTest', 'false')
    data.append('_', Date.now())
    const res = await fetch("http://" + baseURL + "/goform/goform_get_cmd_process?" + data.toString(), {
        method: "GET",
        headers: {
            ...common_headers,
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
    })
    return await res.json()
}

const reboot = async (cookie) => {
    const res = await postData(cookie, {
        goformId: 'REBOOT_DEVICE',
    })
    return res
}

// 发送短信
const sendSms = async ({ content, number }) => {
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
const removeSmsById = async (id) => {
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


//短信tag：0-已读，1-未读，2-发送

async function main() {
    // const res = await sendSms({
    //     content: '？？',
    //     number: '？？'
    // })
    const res = await removeSmsById('11')
    console.log(res)
}
main()