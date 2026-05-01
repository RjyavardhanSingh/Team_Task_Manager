import express from 'express'
import { projectCreation, getproject } from './project.controller.js'
import protect from '../../middleware/auth.middleware.js'
import authorizedRoles from '../../middleware/rbac.middleware.js'
import { validate } from '../../middleware/validate.middleware.js'
import { createProjectSchema } from '../../validations/project.validation.js'

const router = express.Router()

router.use(protect)

router.get('/', getproject)
router.post(
    '/',
    authorizedRoles('Admin'),
    validate(createProjectSchema),
    projectCreation
)

export default router