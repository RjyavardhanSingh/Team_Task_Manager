import express from 'express'
import cors from 'cors'
import errorHandler from './src/middleware/error.handler.middleware.js'
import authRoutes from './src/modules/auth/auth.route.js'
import projectRoutes from './src/modules/project/project.route.js'
import taskRoutes from './src/modules/task/task.route.js'
import dashboardRoutes from './src/modules/dashboard/dashboard.route.js'

const app = express()

const allowedOrigins = process.env.CORS_ORIGINS 
    ? process.env.CORS_ORIGINS.split(',') 
    : ['http://localhost:5173'];

const corsOptions = {
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
    optionsSuccessStatus: 200,
};

app.use(cors(corsOptions))
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
