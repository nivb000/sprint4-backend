const cookieParser = require('cookie-parser')
const express = require('express')
const cors = require('cors')
const path = require('path')
const toyRoutes = require('./api/toy/toy.routes')
const orderRoutes = require('./api/toy/order.routes')
const userRoutes = require('./api/user/user.routes')
const authRoutes = require('./api/auth/auth.routes')
const reviewRoutes = require('./api/review/review.routes')
const { setupSocketAPI } = require('./api/socket.service')
const port = process.env.PORT || 3030
const app = express()
const http = require('http').createServer(app)


app.use(cookieParser())
app.use(express.static('public'))
app.use(express.json())
app.listen(port, () => console.log('Server ready at port 3030!'))
const corsOptions = {
    origin: ['http://127.0.0.1:3000', 'http://localhost:3000'],
    credentials: true
}

app.use(cors(corsOptions))
app.use('/api/toy/', toyRoutes)
app.use('/api/order/', orderRoutes)
app.use('/api/user/', userRoutes)
app.use('/api/auth/', authRoutes)
app.use('/api/review/', reviewRoutes)
setupSocketAPI(http)

const setupAsyncLocalStorage = require('./middlewares/setupAls.middleware')
app.all('*', setupAsyncLocalStorage)

app.get('/**', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
})