import assert from 'assert';
import convertDateToApiFormat from '../utils';
import WeatherQuestionInfo from '../WeatherQuestionInfo';
import fakeRequest from './fakeRequest';
import { weatherApiRequest, WetherApiSchema } from '../WeatherApi';
import { wetherApiResponseType } from '../flow-typed/callWeatherDesk';
import weatherResponse from '../WeatherResponse';

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
      const testStructur1: wetherApiResponseType = {
        queryResult: {
          parameters: '',
        },
      };

      const testStructur2: wetherApiResponseType = {
        queryResult: {
          intent: '',
        },
      };

      assert.throws(
        () => new WetherApiSchema(testStructur1),
        /Informations are missing in the structure/,
      );
      assert.throws(
        () => new WetherApiSchema(testStructur2),
        /Informations are missing in the structure/,
      );
    });
  });

  describe('WeatherApi', () => {
    describe('Create WetherApiSchema errors', () => {
      it('Should throw an error "The structure is empty"', () => {
        assert.throws(() => new WetherApiSchema({}), /The structure is empty/);
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
          () => new WetherApiSchema(testStructur1),
          /Informations are missing in the structure/,
        );
        assert.throws(
          () => new WetherApiSchema(testStructur2),
          /Informations are missing in the structure/,
        );
      });
    });

    describe('Call to the weather API', () => {
      let apiResponse: wetherApiResponseType;
      const date = convertDateToApiFormat(new Date());

      it('Should send a request to the weather API', async () => {
        try {
          apiResponse = await weatherApiRequest('Paris', date);
        } catch (err) {
          assert.fail(`API request faile: ${err}`);
        }
      });

      it('Should transform an API request in an wetherApiSchema object', () => {
        const weatherInfo: WetherApiSchema = new WetherApiSchema(apiResponse);
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

  console.log('Juste avant WeatherResponse');

  describe('WeatherResponse', () => {
    console.log('Juste Apres WeatherResponse');
    describe('should return the apropriet response', () => {
      const date = new Date();
      const city = 'Madrid';
      // Get weatherInfo to build a WetherApiSchema object
      let weatherInfo;
      let apiResponse: wetherApiResponseType;

      // load the info frome the weather API
      before(async () => {
        try {
          apiResponse = await weatherApiRequest(city, convertDateToApiFormat(date));
        } catch (err) {
          assert.fail(`API request faile: ${err}`);
        }
        weatherInfo = new WetherApiSchema(apiResponse);
      });

      it('Should tell the temperature in °F in Mardid', () => {
        // create a fake requests to build WeatherQuestionInfo Objects
        const requestTempF = fakeRequest(city, date, 'weather.temperature', 'F');

        // The weatherResponse object need a WeatherQuestionInfo
        const tempQuestionF = new WeatherQuestionInfo(requestTempF);

        // create the response
        const tempFResponseString = weatherResponse(weatherInfo, tempQuestionF);

        // test the string response
        let includeString = 'Il fait actuellement';
        if (!tempFResponseString.includes(includeString)) {
          assert.fail(
            `The answer does not fit with the expected temperature answer. It should containe "${includeString}" but it is: "${tempFResponseString}"`,
          );
        }

        includeString = `°F à ${city}`;
        if (!tempFResponseString.includes(includeString)) {
          assert.fail(
            `The answer does not fit with the expected temperature answer. It should containe "${includeString}" but it is: "${tempFResponseString}" `,
          );
        }
      });

      it("Should tell it didn't understand the asked info", () => {
        // create a fake requests to build WeatherQuestionInfo Objects
        const requestDefault = fakeRequest(city, date, '', 'C');

        // The weatherResponse object need a WeatherQuestionInfo
        const defaultQuestion = new WeatherQuestionInfo(requestDefault);

        // create the response
        const DefaultResponseString = weatherResponse(weatherInfo, defaultQuestion);

        // test the string response
        assert.equal(DefaultResponseString, "Je n'ai pas compris. Quelle info météo voulez-vous ?");
      });

      it('Should tell the weather in °C in Mardid', () => {
        // create a fake requests to build WeatherQuestionInfo Objects
        const requestWeatherC = fakeRequest(city, date, 'weather', 'C');

        // The weatherResponse object need a WeatherQuestionInfo
        const weatherQuestionC = new WeatherQuestionInfo(requestWeatherC);

        // create the response
        const weatherCResponseString = weatherResponse(weatherInfo, weatherQuestionC);

        // test the string response
        let includeString = `Le temps à ${city} est`;
        if (!weatherCResponseString.includes(includeString)) {
          assert.fail(
            `The answer does not fit with the expected weather answer. It should containe "${includeString}" but it is: "${weatherCResponseString}"`,
          );
        }

        includeString = 'Il y fait actuellement ';
        if (!weatherCResponseString.includes(includeString)) {
          assert.fail(
            `The answer does not fit with the expected weather answer. It should containe "${includeString}" but it is: "${weatherCResponseString}"`,
          );
        }

        includeString = '°C et les températures maximals seront : ';
        if (!weatherCResponseString.includes(includeString)) {
          assert.fail(
            `The answer does not fit with the expected weather answer. It should containe "${includeString}" but it is: "${weatherCResponseString}"`,
          );
        }
      });
    });
  });
});
