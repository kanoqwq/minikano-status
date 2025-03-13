import Koa from 'koa'
import router from './router'
import BodyParser from 'koa-bodyparser'
import Config from 'dotenv'
import cors from '@koa/cors'

const config = Config.config()
const app = new Koa()

app.use(cors())
app.use(BodyParser())
app.use(async (ctx, next) => {
    if (ctx.method == "GET") return next()

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
    next()
})
app.use(router.routes())

app.listen(3000)
console.log('Server running on http://localhost:3000');