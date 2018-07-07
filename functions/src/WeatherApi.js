import Rp from 'request-promise';
import apiKey from './WEATHER_API_KEY';
import { responseType } from '../flow-typed/callWeatherDesk';

const host: string = 'http://api.worldweatheronline.com';
const wwoApiKey: string = apiKey;

class WetherApiSchema {
  constructor(struct: responseType) {
    if (!struct) throw new Error('The structure is empty');

    [this.forecast] = struct.data.weather;
    [this.location] = struct.data.request;
    [this.conditions] = struct.data.current_condition;
    this.currentConditions = this.conditions.weatherDesc[0].value;
  }
  // Create response
  // const output: string =

  strin(): string {
    return `Current conditions in the ${this.location.type}
    ${this.location.query} are ${this.currentConditions} with a projected high of
    ${this.forecast.maxtempC}°C or ${this.forecast.maxtempF}°F and a low of
    ${this.forecast.mintempC}°C or ${this.forecast.mintempF}°F on
    ${this.forecast.date}.`;
  }
}

async function weatherApiRequest(city: string, date: string): WetherApiSchema {
  // Create the path for the HTTP request to get the weather
  const path: string = `/premium/v1/weather.ashx?key=${wwoApiKey}&q=${city}&format=json&num_of_days=5${date}`;
  console.log(`API Request: ${host}${path} hahaha`);

  let reponseAPI: responseType;
  try {
    reponseAPI = new Rp(`${host}${path}`);
  } catch (err: Error) {
    console.log(err);
    throw err;
  }

  console.log(reponseAPI);
  return reponseAPI;
}

export { weatherApiRequest, WetherApiSchema };
