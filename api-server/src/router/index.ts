import Router from 'koa-router';
import controller from '../controller';
const router = new Router();

router.get('/status', controller.getStatusList)
router.post('/status', controller.receiveStatus)
router.delete('/status/:name', controller.removeStatus)

router.get('/sms', controller.getSMSList)
router.post('/sms', controller.pushSMSList)


export default router;