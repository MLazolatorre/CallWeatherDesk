import rp from 'request-promise';
import apiKey from '../WEATHER_API_KEY';

const host: string = 'api.worldweatheronline.com';
const wwoApiKey: string = apiKey;

type locationType = {
  query: string,
  type: string,
};

type forecastType = {
  maxtempC: string,
  maxtempF: string,
  mintempC: string,
  mintempF: string,
  date: string,
};

type responseType = {
  data: {
    weather: Array<forecastType>,
    request: Array<locationType>,
  },
};

type conditionsType = {
  weatherDesc: Array<string>,
};

class WetherApiSchema {
  constructor(struct: mixed) {
    if (!struct) throw new Error('The structure is empty');

    this.struct = struct;
  }
}

export default async function weatherApiRequest(city: string, date: string) {
  const path: string = `${'/premium/v1/weather.ashx?format=json&num_of_days=1'
    + '&q='}${encodeURIComponent(city)}&key=${wwoApiKey}&date=${date}`;

  const apiRes: Promise = await rp(`${host}${path}`);

  const response: responseType = JSON.parse(apiRes);

  return new WetherApiSchema(response);

  const forecast: forecastType = response.data.weather[0];
  const location: locationType = response.data.request[0];
  const conditions: conditionsType = response.data.current_condition[0];
  const currentConditions: string = conditions.weatherDesc[0].value;

  // Create response
  const output: string = `Current conditions in the ${location.type}
  ${location.query} are ${currentConditions} with a projected high of
  ${forecast.maxtempC}°C or ${forecast.maxtempF}°F and a low of
  ${forecast.mintempC}°C or ${forecast.mintempF}°F on
  ${forecast.date}.`;

  return output;
}
