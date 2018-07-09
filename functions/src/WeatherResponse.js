// @flow
import WeatherQuestionInfo from './WeatherQuestionInfo';
import { WeatherApiSchema } from './WeatherApi';
import convertDateToApiFormat from './utils';

export default function weatherResponse(
  weatherInfo: WeatherApiSchema,
  weatherQuestion: WeatherQuestionInfo,
): string {
  const { intent, address, unit }: WeatherQuestionInfo = weatherQuestion;
  const { currentTemp, weatherDescDisplay, maxAndMinTemp }: WeatherApiSchema = weatherInfo;

  // get in simple variables the info to display
  const currentTempDisplay: string = currentTemp[`temp_${unit}`];
  const maxTempDisplay: string = maxAndMinTemp[`max${unit}`];
  const minTempDisplay: string = maxAndMinTemp[`min${unit}`];
  let reponse: string;

  const actualDate: Date = new Date();
  const dateAsked: Date = new Date(weatherQuestion.date);
  const dateAskedDisplay: string = dateAsked.toLocaleString('fr', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  switch (intent) {
    case 'weather':
      if (convertDateToApiFormat(actualDate) === convertDateToApiFormat(dateAsked)) {
        // if the user asked the weather today
        reponse = `Le temps à ${address} est ${weatherDescDisplay.toLowerCase()}, il y fait actuellement ${currentTempDisplay}°${unit} et les températures maximales et minimales sont : ${minTempDisplay} et ${maxTempDisplay}°${unit}`;
      } else if (actualDate - dateAsked > 0) {
        // the user asked the weather in the past
        reponse = `Le ${dateAskedDisplay}, le temps à ${address} était ${weatherDescDisplay.toLowerCase()}, et la température y était de ${currentTempDisplay}°${unit}`;
      } else {
        // the user asked the weather in the futur
        reponse = `Le ${dateAskedDisplay}, le temps à ${address} sera ${weatherDescDisplay.toLowerCase()}, il y fera ${currentTempDisplay}°${unit} et les maximales seront : ${minTempDisplay} et ${maxTempDisplay}°${unit}`;
      }
      break;
    case 'weather.temperature':
      if (convertDateToApiFormat(actualDate) === convertDateToApiFormat(dateAsked)) {
        // if the user asked the weather today
        reponse = `Il fait actuellement ${currentTempDisplay}°${unit}, à ${address}`;
      } else if (actualDate - dateAsked > 0) {
        // the user asked the weather in the past
        reponse = `Il faisait ${currentTempDisplay}°${unit}, le ${dateAskedDisplay} à ${address}`;
      } else {
        // the user asked the weather in the futur
        reponse = `Il fera ${currentTempDisplay}°${unit}, le ${dateAskedDisplay} à ${address}`;
      }
      break;
    default:
      reponse = "Je n'ai pas compris. Quelle info météo voulez-vous ?";
  }

  return reponse;
}
