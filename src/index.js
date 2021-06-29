const express = require('express');
const app = express();
require('./db/mongoose');
const userRouter = require('./router/user');
const taskRouter = require('./router/task');

const port = process.env.PORT;
app.use(express.json());
app.use(taskRouter)
app.use(userRouter)

app.listen(port, ()=>{
    console.log('we are running at '+port);
});

