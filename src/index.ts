import express, { Express }from 'express';
import router from './router/router';
import bodyParser from 'body-parser'

const app: Express = express();

app.options('*', (req, res) => {
    res.set({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Content-Type,  Authorization'
    });
res.send();
});
app.use(bodyParser.json({ 'type': '*/*',limit: '20mb' }))

app.use(router)


app.listen(3000, ()=>{
    console.log('Server running on port 3000')
})