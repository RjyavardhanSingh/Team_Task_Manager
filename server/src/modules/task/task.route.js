import express from 'express'
import { createNewTask, getProjectTasks, updateStatus } from './task.controller.js'
import { validate } from '../../middleware/validate.middleware.js'
import protect from '../../middleware/auth.middleware.js'
import authorizedRoles from '../../middleware/rbac.middleware.js'
import { createTaskSchema, updateTaskStatusSchema } from '../../validations/task.validation.js'

const router = express.Router()

router.use(protect)

router.get('/:projectId', getProjectTasks)
router.post('/', validate(createTaskSchema), createNewTask)
router.patch('/:taskId/status', validate(updateTaskStatusSchema), updateStatus)

export default router
