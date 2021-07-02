const app = require('./app');

const port = process.env.PORT;


app.listen(port, ()=>{
    console.log('we are running at '+port);
});

