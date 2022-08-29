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
import { application } from 'express';

//Node-fetch
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

  const text = names.toString().replace('\n', '');
  console.log("this is the text", text)
  await browser.close();
  return text;
}

start("http://fixate.io")

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
  try {
    let text = await start("http://" + req.body.hd);
    console.log("the text", text)
    request.app.locals.text = { data: text }
    postText(text)
  } catch(err) {
    console.log(err)
  }
}

app.get('/', (req, res) => {
  res.send(app.locals.text)
})


app.post('/', (req, res) => {
  // response.setHeader('Content-Type', 'application/json')
  console.log(req)
  app.locals.text = getText(req)
  res.send("Hello")
})

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is now running on ${app.get('port')}!`)
  console.log(start("http://fixate.io"))
})

//Since the getting the text from the scraper works,
//I just need to be able to appropriately send the text back in response to the post method.
//I just need to do this piece by piece, so maybe the first thing I try to send back is the email.