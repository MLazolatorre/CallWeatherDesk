import convertDateToApiFormat from '../utils';
import WeatherAnswerInfo from '../WeatherAnswerInfo';
import fakeRequest from './fakeRequest';
import { weatherApiRequest } from '../WeatherApi';

const assert = require('assert');

describe('CallWeatherDesk Test', () => {
  describe('convertDateToApiFormat', () => {
    it('should return date on forma : YYYY-MM-DD', () => {
      const date = new Date('December 17, 1995 03:24:00');
      assert.equal(convertDateToApiFormat(date), '1995-12-17');
    });
  });

  describe('WeatherAnswerInfo', () => {
    it('Build a fake reqest function', () => {
      const request = fakeRequest('Madrid', '1995-12-17T03:24:00', 'weather', 'fr');
      const weatherAnswerInfo = new WeatherAnswerInfo(request);

      assert.equal(weatherAnswerInfo.address, 'Madrid');
      assert.equal(weatherAnswerInfo.date, '1995-12-17T03:24:00');
      assert.equal(weatherAnswerInfo.intent, 'weather');
      assert.equal(weatherAnswerInfo.isAddressKnown(), true);
    });
  });

  describe('WeatherApi', () => {
    describe('Call to the weather API', () => {
      it('Avoir une reponse', async () => {
        const date = new Date();
        await weatherApiRequest('Paris', convertDateToApiFormat(date));
      });
    });
  });
});
