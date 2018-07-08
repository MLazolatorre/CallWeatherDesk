# CallWeatherDesk

## Setup Instructions

### Setup: WWO Weather API

1.  Get a WWO API key, by going to https://developer.worldweatheronline.com/api/ and following the instructions to get an API key that includes forecasts 14 days into the future
1.  Paste your API key for the value of the apiKey on line 1 of functions/src/WEATHER_API_KEY.js

### Steps

1.  Create a Dialogflow agent : Select Default Language "French - fr" and Default Time Zone : "(GMT+1:00)"
1.  Go to your agent's settings and [Restore from zip](https://dialogflow.com/docs/agents#export_and_import) using the `CallWeatherDesk.zip` in this directory (Note: this will overwrite your existing agent)
1.  `cd` to the `functions` directory
1.  Run `npm install`
1.  Install the Firebase CLI by running `npm install -g firebase-tools`
1.  Login to your Google account with `firebase login`
1.  Add your project to the sample with `firebase use [project ID]` [find your project ID here](https://dialogflow.com/docs/agents#settings)
1.  Run `npm run deploy` and take note of the endpoint where the fulfillment webhook has been published. It should look like `Function URL (yourAction): https://${REGION}-${PROJECT}.cloudfunctions.net/yourAction` or `Project Console: https://console.firebase.google.com/project/${PROJECT}/overview`, In the second case :
    1.  Go to the given address
    1.  The `Function URL` address is under the word `Request` in the `Envent` column and should look like `https://${REGION}-${PROJECT}.cloudfunctions.net/dialogflowFirebaseFulfillment`
1.  Go to the Dialogflow console and select _Fulfillment_ from the left navigation menu.
1.  Enable _Webhook_, set the value of _URL_ to the `Function URL` from the previous step, then click _Save_.
1.  Select _Intents_ from the left navigation menu. Select the `weather` intent, scroll down to the end of the page and click _Fulfillment_, check _Use webhook_ and then click _Save_. This will allow you to have the welcome intent be a basic webhook intent to test (Do the same with all the other intent).
1.  Run `Quel temps fera-il demain à Paris ?` for example in the Google right form.
1.  If google answer `Une erreur est survenue lors de la récupération des infos météo.` that mean you have to [upgrade your Google Formule Firebase](https://console.firebase.google.com/pricing/) to `Flame Plan`. The `Spark Plan` doesn't allow Outbound networking so the API request is canceled.

## Run Tests

1.  `cd` to the `functions` directory
1.  Run `npm run test`
