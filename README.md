# CallWeatherDesk

1.  Create a Dialogflow agent
1.  Go to your agent's settings and [Restore from zip](https://dialogflow.com/docs/agents#export_and_import) using the `weather-agent.zip` in this directory (Note: this will overwrite your existing agent)
1.  `cd` to the `functions` directory
1.  Run `npm install`
1.  Install the Firebase CLI by running `npm install -g firebase-tools`
1.  Login to your Google account with `firebase login`
1.  Add your project to the sample with `firebase use [project ID]` [find your project ID here](https://dialogflow.com/docs/agents#settings)
1.  Run `firebase deploy --only functions:dialogflowFulfillmentLibAdvancedSample`
1.  Paste the URL into your Dialogflow agent's fulfillment
