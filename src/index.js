import dotenv from 'dotenv';
dotenv.config();

import * as readline from 'node:readline/promises';
import { Configuration, OpenAIApi } from 'openai';
import { stdin as input, stdout as output } from 'node:process';
import { google } from "googleapis";

import { authorize } from './index2.js';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})

const openai = new OpenAIApi(configuration);

let schedules = "";

async function listEvents(auth) {
  const calendar = google.calendar({version: 'v3', auth});
  const res = await calendar.events.list({
    calendarId: 'primary',
    timeMin: new Date().toISOString(),
    maxResults: 15,
    singleEvents: true,
    orderBy: 'startTime',
  });
  const events = res.data.items; 
  if (!events || events.length === 0) {
    console.log('No upcoming events found.');
    return;
  }

  events.map((event, i) => {
    const start = event.start.dateTime || event.start.date;
    //saveAsCSV(start, event.summary, event.description);
    schedules += `Event: ${event.summary}\nDate: ${start}\nDescription: ${event.description}\n`;
    
  });

  return;

}

console.log({schedules});

function generatePrompt(answer){
  //const capitalizedAnimal = answer2[0].toUpperCase() + answer2.slice(1).toLowerCase();
  return `${answer}.

${schedules}`
}

async function check(){
    if(!configuration.apiKey){
      console.log("Invalid API key")
      return;
    }

    const rl = readline.createInterface({ input, output });

    const question = async () => {
        let answer = await rl.question('> ');
        return answer

    }

    try{
      let answer = await question();
      console.log(answer)

      const completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: generatePrompt(answer),
        temperature: 0.6,
        max_tokens: 2500,
        
      });
      console.log(completion.data.choices[0].text);
      //let answer2 = await question();
    }catch(err){
      if(err.response){
        console.error(err.response.status, err.response.data);
      }else{
        console.error(`Error with OpenAI API request: ${err.message}`);
      }
    }

    rl.on('line', async (input) => {

      const completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: generatePrompt(input),
        temperature: 0.6,
        
      });
      console.log(completion.data.choices[0].text);
    });
}


await authorize().then(listEvents).catch(console.error);
check();

/*
const app = express()
const port = 4000

app.get('/', (req, res) => {
  res.send('Hello Beanstalk!')
})

app.listen(port, () => {
  console.log(`listening on port ${port}`)
})
*/