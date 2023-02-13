import dotenv from 'dotenv';
dotenv.config();

import * as readline from 'node:readline/promises';
import { Configuration, OpenAIApi } from 'openai';
import { stdin as input, stdout as output } from 'node:process';
import express from 'express';

console.log(process.env.OPENAI_API_KEY)

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})

const openai = new OpenAIApi(configuration);

function generatePrompt(answer){
  const capitalizedAnimal = answer[0].toUpperCase() + answer.slice(1).toLowerCase();
  return `Suggest three names for an animal that is a superhero.

  Animal: Cat
  Names: Captain Sharpclaw, Agent Fluffball, The Incredible Feline
  Animal: Dog
  Names: Ruff the Protector, Wonder Canine, Sir Barks-a-Lot
  Animal: ${capitalizedAnimal}
  Names:`
}

async function check(){
    if(!configuration.apiKey){
      console.log("Invalid API key")
      return;
    }

    const rl = readline.createInterface({ input, output });

    const answer = await rl.question('Enter an Animal? ');

    try{
      const completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: generatePrompt(answer),
        temperature: 0.6
      });
      console.log({ result: completion.data.choices[0].text})
    }catch(err){
      if(err.response){
        console.error(err.response.status, err.response.data);
      }else{
        console.error(`Error with OpenAI API request: ${err.message}`);
      }
    }
}

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