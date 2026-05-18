const dns = require('dns');
dns.setServers(['1.1.1.1','8.8.8.8'])

const connectDB = require('./db')

const express =  require('express');

require('dotenv').config();

const userRouter = require('./routers/users')

const app = express();

app.use(express.json())

app.use('/users', userRouter);
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`My server is running at http://localhost:${PORT}`);
})
connectDB();