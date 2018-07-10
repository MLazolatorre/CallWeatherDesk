// @flow
import type { weatherApiResponseType } from '../flow-typed/callWeatherDesk';

export default function fakeResponseFromApi(
  city: string,
  currentTemp: { temp_C: string, temp_F: string },
  date: string,
  maxMinTemp: { maxtempC: string, mintempC: string, maxtempF: string, mintempF: string },
): weatherApiResponseType {
  return {
    data: {
      request: [
        {
          type: 'City',
          query: city,
        },
      ],
      current_condition: [
        {
          temp_C: currentTemp.temp_C,
          temp_F: currentTemp.temp_F,
          weatherIconUrl: [{ value: 'http://fakeUrl.com' }],
          weatherDesc: [{ value: 'Sunny' }],
          lang_fr: [{ value: 'Ensoleillé' }],
        },
      ],
      weather: [
        {
          date,
          astronomy: [
            {
              sunrise: '06:54 AM',
              sunset: '09:47 PM',
            },
          ],
          maxtempC: maxMinTemp.maxtempC,
          mintempC: maxMinTemp.mintempC,
          maxtempF: maxMinTemp.maxtempF,
          mintempF: maxMinTemp.mintempF,
        },
      ],
    },
  };
}
