import Router from 'koa-router';
import controller from '../controller';
const router = new Router();
console.log(router);

router.get('/status', controller.getStatusList)
router.post('/status', controller.receiveStatus)

export default router;