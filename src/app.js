const express = require('express');
const app = express();
require('./db/mongoose');
const userRouter = require('./router/user');
const taskRouter = require('./router/task');

app.use(express.json());
app.use(taskRouter)
app.use(userRouter)

module.exports = app;