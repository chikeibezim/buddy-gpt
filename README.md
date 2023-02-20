# buddy-gpt

Buddy-GPT is a mini Node Command Line App built using OpenAI's ChatGPT api.
It integrates your google calendar and helps you make queries about your schedule as well as other GPT features.

Here's how it looks:

https://user-images.githubusercontent.com/36898129/219445975-63e305c0-3f8c-46a4-a445-34943333122e.mp4

Feel free to clone and try it out.

Run **npm install** when on the project directory after cloning

- In the google Cloud console, Enable the calendar API. Click [here](https://console.cloud.google.com/flows/enableapi?apiid=calendar-json.googleapis.com)

Next, We Authorize credentials for the desktop app:

- In the Google Cloud console, go to Menu menu > APIs & Services > Credentials
- Click Create Credentials > OAuth client ID.
- Click Application type > Desktop app.
- In the Name field, type a name for the credential. This name is only shown in the Google Cloud console.
- Click Create. The OAuth client created screen appears, showing your new Client ID and Client secret.
- Click OK. The newly created credential appears under OAuth 2.0 Client IDs.
- Save the downloaded JSON file as credentials.json, and move the file to your working directory.

Run **node /src/index.js** when on the project directory and test out the command line app.



