import { Router } from 'express'
import userCtrl from '../controllers/userController'

const router = Router()

router.route('/')
  .get()
  .post(userCtrl.postUser)
  .put(userCtrl.putUser)

router.route('/:id/active')
  .get(userCtrl.activeUser)

export default router
