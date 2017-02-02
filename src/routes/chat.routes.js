import { Router } from 'express'

import chatCtrl from '../controllers/chatController'

const router = Router()

router.route('/')
  .get(chatCtrl.getChat)
  .post(chatCtrl.postChat)

router.route('/video')
  .post(chatCtrl.postVideoChat)

export default router
