import express, { Express }from 'express';
import router from './router/router';
import bodyParser from 'body-parser'
import fs from 'fs'

const app: Express = express();

app.options('*', (req, res) => {
    res.set({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Content-Type,  Authorization'
    });
res.send();
});

if (!fs.existsSync('./storage')) {
  try {
      fs.mkdirSync('./storage', { recursive: true });
      console.log('Criado')
  } catch (err) {
      console.error('Error creating folder:', err);
  }
}

app.use(bodyParser.json({ 'type': '*/*',limit: '20mb' }))

app.use(router)


app.listen(3000, ()=>{
    console.log('Server running on port 3000')
})