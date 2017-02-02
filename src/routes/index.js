import { Router } from 'express'

import userRoutes from './user.routes'
import messageRoutes from './chat.routes'

const router = Router()
router.use('/users', userRoutes)
router.use('/messages', messageRoutes)

export default router
