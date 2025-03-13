import { RouterContext } from "koa-router"
import { KanoStatus } from "../global"
import Config from 'dotenv'
const config = Config.config()

const statusList: KanoStatus[] = [{
    name: 'kano的手机',
    type: 'phone',
    lastUpdated: 1000000,
    isOnline: true,
    detail: {
        isCharging: true,
        battery: 100,
        isScreenOn: true,
        wifiStatus: 'connected',
        currentPageTabTitle: '哔哩哔哩'
    }
}]

const getStatusList = async (ctx: RouterContext) => {
    ctx.body = {
        status: 0,
        message: '状态获取成功~',
        list: statusList
    }
}

const receiveStatus = async (ctx: RouterContext) => {
    let token = config.parsed?.TOKEN
    if (!token) {
        ctx.response.status = 500
        return ctx.body = {
            status: -1,
            error: '.env环境没找到token哦，快去添加token吧~'
        }
    }
    if (!ctx.request.header.token) {
        ctx.response.status = 404
        return ctx.body = {
            status: -2,
            error: '你咋没带token呀，快去header里加上token吧~'
        }
    }
    if (token !== ctx.request.header.token) {
        ctx.response.status = 403
        return ctx.body = {
            status: -3,
            error: 'token不对哦~'
        }
    }
    const status = ctx.request.body as KanoStatus[]
    if (status && status.length) {
        let foundStatus = statusList.find(s => s.name === status[0].name)
        //if found
        if (foundStatus) {
            statusList.splice(statusList.indexOf(foundStatus), 1, status[0])
        } else {
            statusList.push(...status)
        }
    }
    ctx.body = {
        status: 0,
        message: '状态更新成功'
    }
}

export default {
    getStatusList, receiveStatus
}