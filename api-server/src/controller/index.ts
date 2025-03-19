import { RouterContext } from "koa-router"
import { KanoStatus } from "../global"
import { getF50DataOverFrp, getSmsInfoOverFrp, removeSmsById, sendSms } from "../utils/F50_FRP"

const statusList: KanoStatus[] = []

const returnError = (ctx: RouterContext, message: string) => {
    ctx.body = {
        status: -1,
        message: message
    }
}

//遍历并设置超过1小时没有更新的status为离线
const checkStatusList = () => {
    const newStatusList = statusList.map(item => {
        const lastUpdated = Number(item.lastUpdated)
        const now = Date.now()
        if (lastUpdated && !isNaN(lastUpdated)) {
            const isExpire = Math.floor((now - lastUpdated) / (60 * 60 * 1000)) >= 1 ? true : false
            if (isExpire) {
                return {
                    name: item.name,
                    lastUpdated: item.lastUpdated,
                    type: item.type,
                    detail: {},
                    isOnline: false
                }
            }
            return item
        } else {
            return item
        }
    })
    statusList.length = 0
    statusList.push(...newStatusList)
}

const getStatusList = async (ctx: RouterContext) => {
    checkStatusList()
    //单独拿F50的状态（如果有）
    const res = await getF50DataOverFrp()
    if (res && !res.Error) {
        const res_data = {
            name: 'MiniKano 的 中兴F50 随身WIFI 🛜',
            isOnline: true,
            type: 'mifi',
            lastUpdated: Date.now(),
            detail: {
                F50_data: res
            }
        }
        if (!statusList.length)
            statusList.unshift(res_data)
        else {
            const foundStatus = statusList.find(s => s.name?.includes('中兴F50'))
            if (foundStatus)
                statusList[statusList.indexOf(foundStatus)] = res_data
            else
                statusList.unshift(res_data)
        }
    }
    ctx.body = {
        status: 0,
        message: '状态获取成功哦~',
        length: statusList.length,
        records: statusList
    }
}

const removeStatus = async (ctx: RouterContext) => {
    const param = ctx.params.name
    if (!param) {
        ctx.response.status = 404
        return
    }

    const foundStatus = statusList.find(s => s.name === param)
    if (!foundStatus) {
        ctx.response.status = 404
        return returnError(ctx, `云端没有找到叫做：'${param}'的状态哦~`)
    }

    statusList.splice(statusList.indexOf(foundStatus), 1)
    ctx.body = {
        status: 0,
        message: '状态移除成功哦~',
        length: statusList.length,
        records: [foundStatus]
    }
}

const receiveStatus = async (ctx: RouterContext) => {
    let status = ctx.request.body as KanoStatus[]
    status = status.map(item => ({ ...item, isOnline: true }))
    if (status && status.length) {
        let curTime = Date.now()
        let foundStatus = statusList.find(s => s.name === status[0].name)
        //if found
        if (foundStatus) {
            statusList.splice(statusList.indexOf(foundStatus), 1, { ...status[0], lastUpdated: curTime })
        } else {
            statusList.push({ ...status[0], lastUpdated: curTime })
        }
    }
    ctx.body = {
        status: 0,
        message: '状态更新成功哦~',
    }
}

//中兴F50专用(获取短信列表 通过本地的内网穿透服务)
const getSMSListOverFrp = async (ctx: RouterContext) => {
    const res = await getSmsInfoOverFrp()
    return ctx.body = {
        status: 0,
        message: '短信获取成功哦~',
        length: res.messages.length || 0,
        records: res.messages || []
    }
}

/**
 * 中兴F50专用(发送短信）
 * @param ctx {content: string, number: string}
 */
const sendSMSOverFrp = async (ctx: RouterContext) => {
    let { content, number } = ctx.request.body as { content: string, number: string }
    if (content && number) {
        try {
            const res = await sendSms({
                content,
                number
            })
            return ctx.body = {
                status: 0,
                messge: '短信发送成功哦~',
                data: res
            }
        } catch (e: any) {
            return returnError(ctx, `发送短信失败: ${e.message}`)
        }
    } else {
        return returnError(ctx, `请携带正确的短信内容和手机号哦~`)
    }
}

/**
 * 中兴F50专用(移除短信）
 * @param ctx ctx.params.id: number
 * @returns 
 */
const removeSMSById = async (ctx: RouterContext) => {
    const id = Number(ctx.params.id)
    if (id) {
        //删除短信逻辑
        try {
            const res = await removeSmsById(id)
            return ctx.body = {
                status: 0,
                data: res
            }
        } catch (e: any) {
            return returnError(ctx, `删除短信失败: ${e.message}`)
        }
    } else {
        return returnError(ctx, `请携带正确的短信ID哦~`)
    }
}


export default {
    getStatusList, receiveStatus, removeStatus, getSMSListOverFrp, sendSMSOverFrp, removeSMSById
}