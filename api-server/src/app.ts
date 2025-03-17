import Koa from 'koa'
import router from './router'
import BodyParser from 'koa-bodyparser'
import Config from 'dotenv'
import cors from '@koa/cors'
import { logger } from './utils/logger'

const config = Config.config()
const app = new Koa()

// 中间件记录请求日志
app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    const logMessage = `${ctx.method} ${ctx.url} - ${ms}ms`;
    logger.info(logMessage);
});

app.use(cors())
app.use(async (ctx, next) => {
    if (ctx.method == "GET" && !ctx.path.includes('/sms')) return next()

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
    return next()
})

app.use(BodyParser())
app.use(router.routes())

app.listen(3000)
console.log('Server running on http://localhost:3000');