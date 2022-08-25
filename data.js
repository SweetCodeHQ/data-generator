import puppeteer from 'puppeteer';
import fs from 'fs/promises';


//EXPRESS DEPENDENCIES
import express from 'express';
const app = express();
import cors from 'cors';
const corsOptions ={
  origin: true, 
  credentials:true,            //access-control-allow-credentials:true
  optionSuccessStatus:200,
}
app.use(cors(corsOptions));
app.use(express.json())
import { application, response } from 'express';

//Node-fetch
import fetch from 'node-fetch';

app.set('port', process.env.PORT || 8080);
app.locals.title = 'Project Megaphone Server'
app.locals.text;


const start = async (url) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  const names = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('body')).map(x => x.textContent)
  })
  await fs.writeFile('names.txt', names.join("\r\n"))

  const text = names.toString().replace('\n', '');
  console.log("this is the text", text)
  await browser.close();
  return text;
}

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

const getText = async (req) => {
  let text = await start("http://www." + req.body.hd);
  app.locals.text = { data: text }
  console.log("the text", text)
  postText(text)
}

app.get('/', (req, res) => {
  res.send(app.locals.text)
})


app.post('/', (req, res) => {
  response.setHeader('Content-Type', 'application/json')
  getText(req)
  res.send(app?.locals?.text?.data)
  console.log("the text", app?.locals?.text?.data)
})

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is now running on ${app.get('port')}!`)
})