import WeatherQuestionInfo from './WeatherQuestionInfo';
import { WetherApiSchema } from './WeatherApi';

export default function weatherResponse(
  weatherInfo: WetherApiSchema,
  weatherQuestion: WeatherQuestionInfo,
): string {
  const { intent, address, unit } = weatherQuestion;
  const { currentTemp, weatherDescDisplay, maxAndMinTemp } = weatherInfo;

  // get in simple variables the info to display
  const currentTempDisplay = currentTemp[`temp_${unit}`];
  const maxTempDisplay = maxAndMinTemp[`max${unit}`];
  const minTempDisplay = maxAndMinTemp[`min${unit}`];
  let reponse: string;

  switch (intent) {
    case 'weather':
      reponse = `Le temps à ${address} est ${weatherDescDisplay}. Il y fait actuellement ${currentTempDisplay}°${unit} et les températures maximals seront : ${minTempDisplay} et ${maxTempDisplay}°${unit}`;
      break;
    case 'weather.temperature':
      reponse = `Il fait actuellement ${currentTempDisplay}°${unit} à ${address}`;
      break;
    default:
      reponse = "Je n'ai pas compris. Quelle info météo voulez-vous ?";
  }

  return reponse;
}
