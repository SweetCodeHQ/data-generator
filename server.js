
import express from 'express';
const app = express();
import cors from 'cors';
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});
// const corsOptions ={
//   origin: true, 
//   credentials:true,            //access-control-allow-credentials:true
//   optionSuccessStatus:200,
// }
// app.use(cors(corsOptions));
import { application, response } from 'express';

//Node-fetch
import fetch from 'node-fetch';

//puppeteer dependencies
import start from './data.js'

app.use(express.json())

app.set('port', process.env.PORT || 8080);
app.locals.title = 'Project Megaphone Server'

const postText = (text) => {
  fetch('/megaphone-ai-api.herokuapp.com/api/v1/extractions', 
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json'},
    body: JSON.stringify(text)
  })
  .then(response => response.json())
  .then(data => console.log("what we get from posting", data))
  .catch(error => console.log(error))
}

const getText = async (email) => {
  let text = await start("http://www." + email.body.hd);
  console.log("the text", text)
  postText(text)
}


app.post('/', (req, res) => {
  request({ url: ['https://proj-mega.herokuapp.com/', 'http://localhost:3000/'] })
  getText(req)
  res.json( req )
})

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is now running on ${app.get('port')}!`)
})