// @flow
import Rp from 'request-promise';
import apiKey from './WEATHER_API_KEY';
import type { wetherApiResponseType } from './flow-typed/callWeatherDesk';

const host: string = 'http://api.worldweatheronline.com';
const wwoApiKey: string = apiKey;

class WetherApiSchema {
  struct: wetherApiResponseType;

  constructor(struct: wetherApiResponseType) {
    if (!struct && !struct.data) throw new Error('The structure is empty');
    if (!struct.data.request || !struct.data.current_condition || !struct.data.weather) throw new Error('Informations are missing in the structure');

    this.struct = struct;
  }

  get city(): string {
    return this.struct.data.request[0].query;
  }

  get currentTemp(): { temp_C: string, temp_F: string } {
    return {
      temp_C: this.struct.data.current_condition[0].temp_C,
      temp_F: this.struct.data.current_condition[0].temp_F,
    };
  }

  get iconUrl(): string {
    return this.struct.data.current_condition[0].weatherIconUrl[0].value;
  }

  get weatherDescDisplay(): string {
    return this.struct.data.current_condition[0].lang_fr[0].value;
  }

  get date(): string {
    return this.struct.data.weather[0].date;
  }

  get astronomy(): { sunrise: Date, sunset: Date } {
    return {
      sunset: new Date(this.struct.data.weather[0].astronomy[0].sunset),
      sunrise: new Date(this.struct.data.weather[0].astronomy[0].sunrise),
    };
  }

  get maxAndMinTemp(): { maxC: string, minC: string, maxF: string, minF: string } {
    return {
      maxC: this.struct.data.weather[0].maxtempC,
      minC: this.struct.data.weather[0].mintempC,
      maxF: this.struct.data.weather[0].maxtempF,
      minF: this.struct.data.weather[0].mintempF,
    };
  }
}

async function weatherApiRequest(city: string, date: string): Promise<wetherApiResponseType> {
  // Create the path for the HTTP request to get the weather
  const path: string = `/premium/v1/weather.ashx?key=${wwoApiKey}&q=${city}&format=json&num_of_days=5${date}&lang=fr`;

  let reponseAPI: string;
  try {
    reponseAPI = await new Rp(`${host}${path}`);
  } catch (err) {
    console.log(`API request faile: ${err}`);
    throw err;
  }

  return JSON.parse(reponseAPI);
}

export { weatherApiRequest, WetherApiSchema };
