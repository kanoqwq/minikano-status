import { RouterContext } from "koa-router"
import { KanoStatus } from "../global"

const statusList: KanoStatus[] = []

const getStatusList = async (ctx: RouterContext) => {
    ctx.body = {
        status: 0,
        message: '状态获取成功~',
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
        return ctx.body = {
            status: -1,
            message: `云端没有找到叫做：'${param}'的状态哦~`,
        }
    }

    statusList.splice(statusList.indexOf(foundStatus), 1)
    ctx.body = {
        status: 0,
        message: '状态移除成功~',
        length: statusList.length,
        records: [foundStatus]
    }
}

const receiveStatus = async (ctx: RouterContext) => {
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
    getStatusList, receiveStatus, removeStatus
}