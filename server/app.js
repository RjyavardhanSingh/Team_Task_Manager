import express from 'express'
import cors from 'cors'
import errorHandler from './src/middleware/error.handler.middleware.js'
import authRoutes from './src/modules/auth/auth.route.js'
import projectRoutes from './src/modules/project/project.route.js'
import taskRoutes from './src/modules/task/task.route.js'
import dashboardRoutes from './src/modules/dashboard/dashboard.route.js'

const app = express()

app.use(cors({
    origin: "https://unique-vitality-production-6d97.up.railway.app/"
}))
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.get('/', (req,res) => {
    res.send('API is healthy....')
})

app.use('/api/auth', authRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/task/', taskRoutes)
app.use('/api/dashboard', dashboardRoutes)

app.use(errorHandler)

export default app