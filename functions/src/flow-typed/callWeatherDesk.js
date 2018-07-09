// @flow
export type requestFromDialogFlow = {
  responseId: string,
  queryResult: {
    queryText: string,
    parameters: {
      address: string,
      'date-time': string,
      unit: 'C' | 'F',
    },
    intent: {
      name: string,
      displayName: string,
    },
  },
};

export type weatherApiResponseType = {
  data: {
    request: Array<{
      type: string,
      query: string,
    }>,
    current_condition: Array<{
      temp_C: string,
      temp_F: string,
      weatherIconUrl: Array<{ value: string }>,
      weatherDesc: Array<{ value: string }>,
      lang_fr: Array<{ value: string }>,
    }>,
    weather: Array<{
      date: string,
      astronomy: Array<{
        sunrise: string,
        sunset: string,
      }>,
      maxtempC: string,
      mintempC: string,
      maxtempF: string,
      mintempF: string,
    }>,
  },
};
