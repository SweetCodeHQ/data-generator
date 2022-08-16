import puppeteer from 'puppeteer-core';
import fs from 'fs/promises';

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


//Endpoint for OpenAI : https://megaphone-ai-api/api/v1/extractions (what I need to post to)


export default start;