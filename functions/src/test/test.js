// @flow
import assert from 'assert';
import nock from 'nock';
import convertDateToApiFormat from '../utils';
import WeatherQuestionInfo from '../WeatherQuestionInfo';
import fakeRequest from './fakeRequest';
import { weatherApiRequest, WeatherApiSchema } from '../WeatherApi';
import { weatherApiResponseType } from '../flow-typed/callWeatherDesk';
import weatherResponse from '../WeatherResponse';
import apiKey from '../WEATHER_API_KEY';
import fakeResponseFromApi from './fakeResponseFromApi';

describe('CallWeatherDesk Test', () => {
  describe('convertDateToApiFormat', () => {
    it('Should return date on forma : YYYY-MM-DD', () => {
      const date = new Date('December 17, 1995 03:24:00');
      assert.equal(convertDateToApiFormat(date), '1995-12-17');
    });
  });

  describe('WeatherQuestionInfo', () => {
    it('should create an object WeatherQuestionInfo', () => {
      const request = fakeRequest('Madrid', '1995-12-17T03:24:00', 'weather', 'K');
      const weatherQuestionInfo = new WeatherQuestionInfo(request);

      assert.equal(weatherQuestionInfo.address, 'Madrid');
      assert.equal(weatherQuestionInfo.date, '1995-12-17T03:24:00');
      assert.equal(weatherQuestionInfo.intent, 'weather');
      assert.equal(weatherQuestionInfo.unit, 'K');
      assert.equal(weatherQuestionInfo.isAddressKnown(), true);

      // the sme test without Date
      const request2 = fakeRequest('Madrid', '', 'weather', '');
      const weatherQuestionInfo2 = new WeatherQuestionInfo(request2);

      assert.equal(weatherQuestionInfo2.address, 'Madrid');
      assert.equal(
        convertDateToApiFormat(weatherQuestionInfo2.date),
        convertDateToApiFormat(new Date()),
      );
      assert.equal(weatherQuestionInfo2.intent, 'weather');
      assert.equal(weatherQuestionInfo2.unit, 'C');
      assert.equal(weatherQuestionInfo2.isAddressKnown(), true);
    });

    it('Should throw an error "The structure is empty"', () => {
      assert.throws(() => new WeatherQuestionInfo(), 'The structure is empty');
      assert.throws(() => new WeatherQuestionInfo({}), 'The structure is empty');
    });

    it('Should throw an error "Informations are missing in the structure"', () => {
      const testStructur1: weatherApiResponseType = {
        queryResult: {
          parameters: '',
        },
      };

      const testStructur2: weatherApiResponseType = {
        queryResult: {
          intent: '',
        },
      };

      assert.throws(
        () => new WeatherApiSchema(testStructur1),
        'Informations are missing in the structure',
      );
      assert.throws(
        () => new WeatherApiSchema(testStructur2),
        'Informations are missing in the structure',
      );
    });
  });

  describe('WeatherApi', () => {
    describe('Create WeatherApiSchema errors', () => {
      it('Should throw an error "The structure is empty"', () => {
        assert.throws(() => new WeatherApiSchema({}), 'The structure is empty');
      });

      it('Should throw an error "Informations are missing in the structure"', () => {
        const testStructur1 = {
          data: {
            request: [],
            current_condition: [],
          },
        };

        const testStructur2 = {
          data: {
            weather: [],
            current_condition: [],
          },
        };

        assert.throws(
          () => new WeatherApiSchema(testStructur1),
          'Informations are missing in the structure',
        );
        assert.throws(
          () => new WeatherApiSchema(testStructur2),
          'Informations are missing in the structure',
        );
      });
    });

    describe('Call to the weather API', () => {
      let apiResponse: weatherApiResponseType;
      const date = convertDateToApiFormat(new Date());

      it('Should send a request to the weather API', async () => {
        try {
          apiResponse = await weatherApiRequest('Paris', date);
        } catch (err) {
          assert.fail(`API request fails: ${err}`);
        }
      });

      it('Should transform an API request in an weatherApiSchema object', () => {
        const weatherInfo: WeatherApiSchema = new WeatherApiSchema(apiResponse);
        assert.equal(weatherInfo.city, 'Paris, France');

        // test is there is a value in currentMaxTemp
        const temp: string = weatherInfo.currentTemp;
        if (!temp && typeof temp.tempC !== 'string') assert.fail(`currentMaxTemp is empty or tempC is not a string: ${temp}`);
        if (!temp && typeof temp.tempF !== 'string') assert.fail(`currentMaxTemp is empty or tempF is not a string: ${temp}`);

        const iconURL = weatherInfo.iconUrl;
        if (!iconURL.includes('http://cdn.worldweatheronline.net/images')) assert.fail(`Icone url is not an URL: ${iconURL}`);

        const message = weatherInfo.weatherDescDisplay;
        if (typeof message !== 'string') assert.fail(`The weather description is not a string : ${message}`);

        assert.equal(weatherInfo.date, date);

        const { astronomy } = weatherInfo;
        if (!astronomy && typeof astronomy.sunset !== 'object') assert.fail(`The sunset date is null or is not a object : ${astronomy.sunset}`);
        if (!astronomy && typeof astronomy.sunrise !== 'object') assert.fail(`The sunrise date is null or is not a object : ${astronomy.sunset}`);

        const { maxAndMinTemp } = weatherInfo;
        if (!maxAndMinTemp && typeof maxAndMinTemp.maxC !== 'object') assert.fail(`The maxC value is null or is not a string : ${maxAndMinTemp.maxC}`);
        if (!maxAndMinTemp && typeof maxAndMinTemp.minC !== 'object') assert.fail(`The minC value is null or is not a string : ${maxAndMinTemp.minC}`);
        if (!maxAndMinTemp && typeof maxAndMinTemp.maxF !== 'object') assert.fail(`The maxF value is null or is not a string : ${maxAndMinTemp.maxF}`);
        if (!maxAndMinTemp && typeof maxAndMinTemp.minF !== 'object') assert.fail(`The minF value is null or is not a string : ${maxAndMinTemp.minF}`);
      });
    });
  });

  describe('WeatherResponse', () => {
    describe('should return the apropriet response', () => {
      const date = new Date();
      const city = 'Madrid';
      const currentTemp: { temp_C: string, temp_F: string } = {
        temp_C: '34',
        temp_F: '83',
      };
      const maxMinTemp: {
        maxtempC: string,
        mintempC: string,
        maxtempF: string,
        mintempF: string,
      } = {
        maxtempC: '35',
        mintempC: '24',
        maxtempF: '95',
        mintempF: '75',
      };

      // Get weatherInfo to build a WeatherApiSchema object
      let weatherInfo;
      let apiResponse: weatherApiResponseType;

      // load the info frome the weather API
      before(async () => {
        const path: string = '/premium/v1/weather.ashx';

        nock('http://api.worldweatheronline.com')
          .get(path)
          .query({
            key: apiKey,
            q: city,
            date: convertDateToApiFormat(date),
            lang: 'fr',
            format: 'json',
            num_of_days: 5,
          })
          .reply(200, fakeResponseFromApi(city, currentTemp, date, maxMinTemp));

        try {
          apiResponse = await weatherApiRequest(city, convertDateToApiFormat(date));

          console.log('apiResponse');
          console.log(apiResponse);
        } catch (err) {
          assert.fail(`API request fails: ${err}`);
        }
        weatherInfo = new WeatherApiSchema(apiResponse);
      });

      it('Should tell the temperature in °F in Mardid', () => {
        // create a fake requests to build WeatherQuestionInfo Objects
        const requestTempF = fakeRequest(city, date, 'weather.temperature', 'F');

        // The weatherResponse object need a WeatherQuestionInfo
        const tempQuestionF = new WeatherQuestionInfo(requestTempF);

        // create the response
        const tempFResponseString = weatherResponse(weatherInfo, tempQuestionF);

        // test the string response
        const responseSouldBe = `Il fait actuellement ${currentTemp.temp_F}°F, à ${city}`;

        assert.equal(tempFResponseString, responseSouldBe);
      });

      it('Should tell it did not understand the asked info', () => {
        // create a fake requests to build WeatherQuestionInfo Objects
        const requestDefault = fakeRequest(city, date, '', 'C');

        // The weatherResponse object need a WeatherQuestionInfo
        const defaultQuestion = new WeatherQuestionInfo(requestDefault);

        // create the response
        const DefaultResponseString = weatherResponse(weatherInfo, defaultQuestion);

        // test the string response
        const responseSouldBe = "Je n'ai pas compris. Quelle info météo voulez-vous ?";

        assert.equal(DefaultResponseString, responseSouldBe);
      });

      it('Should tell the weather in °C in Mardid', () => {
        // create a fake requests to build WeatherQuestionInfo Objects
        const requestWeatherC = fakeRequest(city, date, 'weather', 'C');

        // The weatherResponse object need a WeatherQuestionInfo
        const weatherQuestionC = new WeatherQuestionInfo(requestWeatherC);

        // create the response
        const weatherCResponseString = weatherResponse(weatherInfo, weatherQuestionC);

        // test the string response
        const responseSouldBe = `Le temps à ${city} est ensoleillé, il y fait actuellement ${
          currentTemp.temp_C
        }°C et les températures maximales et minimales sont : ${maxMinTemp.mintempC} et ${
          maxMinTemp.maxtempC
        }°C`;

        assert.equal(weatherCResponseString, responseSouldBe);
      });
    });
  });
});
