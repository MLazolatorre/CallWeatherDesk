// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
import * as functions from 'firebase-functions';
import { WebhookClient } from 'dialogflow-fulfillment';
import convertDateToApiFormat from './utils';
import WeatherAnswerInfo from './WeatherAnswerInfo';
import { weatherApiRequest, WetherApiSchema } from './WeatherApi';

process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(
  (request: {}, response: {}): void => {
    const webhookClient: WebhookClient = new WebhookClient({ request, response });
    const { body }: {} = request;

    console.log('body');
    console.log(body);

    async function weatherResponse(agent: {}) {
      // stock user request's infos in an objetc
      const weatherAnswer: WeatherAnswerInfo = new WeatherAnswerInfo(body);

      // Check if the user asked a specific city.
      if (!weatherAnswer.isAddressKnown()) {
        agent.add('Dans quelle ville voullez-vous que je recherche cette information ?');
        return;
      }

      let reponseApi: WetherApiSchema;
      try {
        reponseApi = await weatherApiRequest(
          weatherAnswer.address,
          convertDateToApiFormat(weatherAnswer.date),
        );
      } catch (err) {
        agent.add(`${err}`);
      }
      agent.add(`${reponseApi}`);
    }

    // Intent's declaration functions
    webhookClient.handleRequest(weatherResponse);
  },
);
