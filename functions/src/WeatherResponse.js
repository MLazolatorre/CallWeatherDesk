// @flow
import WeatherQuestionInfo from './WeatherQuestionInfo';
import { WeatherApiSchema } from './WeatherApi';

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

  switch (intent) {
    case 'weather':
      reponse = `Le temps à ${address} est ${weatherDescDisplay}. Il y fait actuellement ${currentTempDisplay}°${unit} et les températures maximales et minimales seront : ${minTempDisplay} et ${maxTempDisplay}°${unit}`;
      break;
    case 'weather.temperature':
      reponse = `Il fait actuellement ${currentTempDisplay}°${unit} à ${address}`;
      break;
    default:
      reponse = "Je n'ai pas compris. Quelle info météo voulez-vous ?";
  }

  return reponse;
}
