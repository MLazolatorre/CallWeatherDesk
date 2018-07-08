// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
import * as functions from 'firebase-functions';
import { WebhookClient } from 'dialogflow-fulfillment';
import convertDateToApiFormat from './utils';
import WeatherQuestionInfo from './WeatherQuestionInfo';
import { weatherApiRequest, WetherApiSchema } from './WeatherApi';
import weatherResponse from './WeatherResponse';

process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(
  (request: {}, response: {}): void => {
    const webhookClient: WebhookClient = new WebhookClient({ request, response });
    const { body }: {} = request;

    async function reponseTheAnswer(agent: {}) {
      // stock user request's infos in an objetc
      const weatherQuestion: WeatherQuestionInfo = new WeatherQuestionInfo(body);

      // Check if the user asked a specific city.
      if (!weatherQuestion.isAddressKnown()) {
        agent.add('Dans quelle ville voullez-vous que je recherche cette information ?');
        return;
      }

      // get the wether inforation
      let reponseApi: WetherApiSchema;
      try {
        reponseApi = await weatherApiRequest(
          weatherQuestion.address,
          convertDateToApiFormat(weatherQuestion.date),
        );
      } catch (err) {
        console.log(`${err}`);
      }

      // convert the Api response in an Object
      const weatherInfo: WeatherQuestionInfo = new WeatherQuestionInfo(reponseApi);

      // personalized the answer
      const finalResponseString: string = weatherResponse(weatherInfo, weatherQuestion);

      agent.add(finalResponseString);
    }

    // Intent's declaration functions
    webhookClient.handleRequest(reponseTheAnswer);
  },
);
