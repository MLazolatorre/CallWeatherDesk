import type { requestFromDialogFlow } from '../../flow-typed/callWeatherDesk';

export default function fakeRequest(
  address: string,
  date: string,
  action: string,
  language: string,
): requestFromDialogFlow {
  return {
    responseId: '',
    queryResult: {
      queryText: '',
      parameters: {
        'date-time': date,
        address,
      },
      allRequiredParamsPresent: true,
      fulfillmentText: '',
      fulfillmentMessages: [
        {
          text: {
            text: [''],
          },
        },
      ],
      outputContexts: [
        {
          name: '',
          lifespanCount: 2,
          parameters: {
            'unit.original': '',
            'address.original': '',
            'date-time.original': '',
            address,
            unit: '',
            'date-time': date,
          },
        },
      ],
      intent: {
        name: '',
        displayName: action,
      },
      intentDetectionConfidence: 1,
      diagnosticInfo: {
        webhook_latency_ms: 2960,
      },
      languageCode: language,
    },
    webhookStatus: {
      code: 13,
      message: '',
    },
  };
}
