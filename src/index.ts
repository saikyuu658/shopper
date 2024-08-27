import express, { Express }from 'express';
import router from './router/router';
import bodyParse from 'body-parser'

const app: Express = express();

app.use(bodyParse.json())
app.use(router)
app.listen(3000, ()=>{
    console.log('Server running on port 3000')
})