import puppeteer from 'puppeteer';
import fs from 'fs/promises';

//EXPRESS DEPENDENCIES
import express from 'express';
const app = express();
app.use(express.json())

//CORS Dependencies
import cors from 'cors';
const corsOptions = {
  origin: true, 
  credentials:true,            //access-control-allow-credentials:true
  optionSuccessStatus:200,
}
app.use(cors(corsOptions));

import { application, response } from 'express';

//Body-Parser
import bodyParser from 'body-parser';
app.use(bodyParser.json({ type: 'application/*+json' }))

//Node-Fetch
import fetch from 'node-fetch';
 
app.set('port', process.env.PORT || 8080);
app.locals.title = 'Project Megaphone Server'

const start = async (url) => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox'],
    ignoreDefaultArgs: ['--disable-extensions'],
  });
  const page = await browser.newPage();
  await page.goto(url);
  
  const names = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('body')).map(x => x.textContent)
  })
  await fs.writeFile('names.txt', names.join("\r\n"))
  
  const text = names.toString();
  const cleanText = text.replace("/", "")
  await browser.close();
  return cleanText;
}

const postText = (words) => {
  console.log("the post body", typeof words)
  fetch('https://megaphone-ai-api.herokuapp.com/api/v1/extractions', { params: words })
  .then(response => response.json())
  .then(data => { app.locals.keywords = data })
  .catch(error => console.log("err msg", error))
}

const getText = async (req) => {
  try {
    let webText = await start("https://" + req.hd);
    const words = {text: webText}
    postText(words)
  } catch(err) {
    console.log(err)
  }
}

app.get('/', (req, res) => {
  res.send(app.locals.keywords)
})

app.post('/', (req, res) => {
  res.send(JSON.stringify(req.body));
  console.log(req.body)
  let userInfo = req.body
  getText(userInfo)
})

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is now running on ${app.get('port')}!`)
})