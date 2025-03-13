import Koa from 'koa'
import router from './router'
import BodyParser from 'koa-bodyparser'

const app = new Koa()
app.use(BodyParser())
app.use(router.routes())

app.listen(3000)
console.log('Server running on http://localhost:3000');