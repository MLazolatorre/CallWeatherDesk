// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
import * as functions from 'firebase-functions';
import { WebhookClient } from 'dialogflow-fulfillment';
import { EventEmitter } from 'events';
import convertDateToApiFormat from './utils';
import WeatherAnswerInfo from './WeatherAnswerInfo';

process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements

const sendMessageEvent: EventEmitter = new EventEmitter();

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(
  (request: {}, response: {}): void => {
    const webhookClient: WebhookClient = new WebhookClient({ request, response });
    const headers: {} = { request };
    const body: {} = { request };

    console.log(`Dialogflow Request headers: ${JSON.stringify(headers)}`);
    console.log(`Dialogflow Request body: ${JSON.stringify(body)}`);

    // Check if the user asked a specific city.
    // if he don't, emit 'cityUnknow' event.
    function checkAddress(weatherAnswer: WeatherAnswerInfo): void {
      console.log('Entre dans checkAddress function');

      if (!weatherAnswer.isAddressKnown()) sendMessageEvent.emit('cityUnknow');
    }

    function weatherResponse(agent: {}) {
      // set the listeners
      sendMessageEvent.on(
        'cityUnknow',
        agent.add('Dans quelle ville voullez-vous que je recherche cette information ?'),
      );

      // stock user request's infos in an objetc
      const weatherAnswer: WeatherAnswerInfo = new WeatherAnswerInfo(body);

      checkAddress(weatherAnswer);

      convertDateToApiFormat(weatherAnswer.date);
    }

    // Intent's declaration functions
    const intentMap: Map = new Map();
    intentMap.set('weather', weatherResponse);
    intentMap.set('weather.temperature', weatherResponse);
    webhookClient.handleRequest(intentMap);
  },
);
