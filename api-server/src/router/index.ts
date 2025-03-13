import Router from 'koa-router';
import controller from '../controller';
const router = new Router();

router.get('/status', controller.getStatusList)
router.post('/status', controller.receiveStatus)
router.delete('/status/:name', controller.removeStatus)

export default router;