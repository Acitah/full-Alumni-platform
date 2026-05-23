const dns = require('dns');
dns.setServers(['1.1.1.1','8.8.8.8'])

const connectDB = require('./db')

const express =  require('express');
const cors = require('cors');

require('dotenv').config();

const userRouter = require('./routers/users')
// const eventsRouter = require('./routers/events')
const messageRouter = require("./routers/message");
const notificationRouter = require("./routers/notification");
const profileRouter = require("./routers/profile");
const mentorshipRouter = require("./routers/mentorship");
const opportunityRouter = require("./routers/opportunity");
const leadershipRouter = require("./routers/leadership");
const sisterhoodRouter = require("./routers/sisterhood");
const employerRouter = require("./routers/employer");



const app = express();
app.use(express.json())



// CORS configuration

const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};

app.use(cors(corsOptions));

//user routes
app.use('/users', userRouter);

// app.use('/events', eventsRouter);

//message routes

app.use("/messages", messageRouter);

//notification routes
app.use("/notifications", notificationRouter);

//profile routes
app.use("/profile", profileRouter);

//upload routes
// app.use("/upload", uploadRouter);

//mentorship routes
app.use("/mentorship", mentorshipRouter);

//opportunity routes
app.use("/opportunities", opportunityRouter);

//leadership routes
app.use("/leadership", leadershipRouter);

//sisterhood routes
app.use("/sisterhood", sisterhoodRouter);

//employer routes
app.use("/employers", employerRouter);


const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`My server is running at http://localhost:${PORT}`);
})
connectDB();