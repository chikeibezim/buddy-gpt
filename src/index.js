import dotenv from 'dotenv';
dotenv.config();

import * as readline from 'node:readline/promises';
import { Configuration, OpenAIApi } from 'openai';
import { stdin as input, stdout as output } from 'node:process';
import { google } from "googleapis";

import { authorize } from './config.js';

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
    schedules += "Event: " + event.summary + "\nDate: " + start + "\nActivity: " + event.description + "\n";    
  });

  return;

}

let messageHistory =  ``;
console.log({ messageHistory })

function generatePrompt(question){
  return `${schedules}

  Human: Hello, who are you?
  AI: I am an AI created by OpenAI. How can I help you today?
  ${messageHistory}
  Human: ${question}
  AI: `
}


async function check(){
    if(!configuration.apiKey){
      console.log("Invalid API key")
      return;
    }

    const rl = readline.createInterface({ input, output });

    rl.on('line', async (question) => {

      try{
  
        const completion = await openai.createCompletion({
          model: "text-davinci-003",
          prompt: generatePrompt(question),
          temperature: 0.6,
          max_tokens: 150,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0.6,
          
          
        });
        messageHistory += `Human: ${question} \nAI: ${completion.data.choices[0].text}\n`
        console.log(completion.data.choices[0].text);
      }catch(err){
        if(err.response){
          console.error(err.response.status, err.response.data);
        }else{
          console.error(`Error with OpenAI API request: ${err.message}`);
        }
      }
    });
}


await authorize().then(listEvents).catch(console.error);
check();