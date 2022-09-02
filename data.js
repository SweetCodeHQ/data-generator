import puppeteer from 'puppeteer';
import fs from 'fs/promises';

//Flatted Dependencies
import {parse, stringify, toJSON, fromJSON} from 'flatted';

//EXPRESS DEPENDENCIES
import express from 'express';
const app = express();
import cors from 'cors';

const corsOptions = {
  origin: true, 
  credentials:true,            //access-control-allow-credentials:true
  optionSuccessStatus:200,
}

app.use(cors(corsOptions));
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
import { application, response } from 'express';

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
  try {
    let text = await start("http://" + req.body.hd);
    postText(text)
  } catch(err) {
    console.log(err)
  }
}

app.get('/', (req, res) => {
  res.send(app.locals.text)
})

app.post('/', (req, res) => {
  res.json("Hello")
})

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is now running on ${app.get('port')}!`)
})

//STEP 1: What I can do is write a function That will take in the data I fetch from the mighty-plains
//server as an argument

//STEP 2: Use the email property of the data to get the business website, concatenate the email part
//with an http
//
//STEP 3: Pass the concatenate site through the puppeteer start function, and then 

//STEP 4:save the returned out text inn a variable

//STEP 5: pass that variable to the post function that is going to be sent to the open AI to be
//able to fetch the keywords