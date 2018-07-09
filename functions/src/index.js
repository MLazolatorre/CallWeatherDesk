// @flow
// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
import * as functions from 'firebase-functions';
import { WebhookClient } from 'dialogflow-fulfillment';
import type { agentType } from 'dialogflow-fulfillment';
import convertDateToApiFormat from './utils';
import WeatherQuestionInfo from './WeatherQuestionInfo';
import { weatherApiRequest, WetherApiSchema } from './WeatherApi';
import weatherResponse from './WeatherResponse';
import type { wetherApiResponseType, requestFromDialogFlow } from './flow-typed/callWeatherDesk';

type requestType = {
  body: requestFromDialogFlow,
  header: mixed,
};

process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(
  (request: requestType, response: {}): void => {
    const webhookClient: WebhookClient = new WebhookClient({
      request,
      response,
    });
    const { body }: requestType = request;

    console.log('body');
    console.log(body);

    async function reponseTheAnswer(agent: agentType) {
      // stock user request's infos in an objetc
      const weatherQuestion: WeatherQuestionInfo = new WeatherQuestionInfo(body);

      // Check if the user asked a specific city.
      if (!weatherQuestion.isAddressKnown()) {
        agent.add('Dans quelle ville voullez-vous que je recherche cette information ?');
      } else {
        try {
          // get the wether inforation
          const reponseApi: wetherApiResponseType = await weatherApiRequest(
            weatherQuestion.address,
            convertDateToApiFormat(weatherQuestion.date),
          );
          // convert the Api response in an Object
          const weatherInfo: WetherApiSchema = new WetherApiSchema(reponseApi);

          // personalized the answer
          const finalResponseString: string = weatherResponse(weatherInfo, weatherQuestion);

          // add the weather desctiption to the response
          agent.add(finalResponseString);
        } catch (err) {
          console.log(`${err}`);
          // tell the user an error appened
          agent.add('Une erreur est survenue lors de la récupération des infos météo.');
        }
      }
    }

    // Intent's declaration functions
    webhookClient.handleRequest(reponseTheAnswer);
  },
);
