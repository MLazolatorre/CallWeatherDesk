import type { requestFromDialogFlow } from '../../flow-typed/callWeatherDesk';

export default function fakeRequest(
  address: string,
  date: string,
  action: string,
  unit: string,
): requestFromDialogFlow {
  return {
    responseId: '',
    queryResult: {
      queryText: '',
      parameters: {
        'date-time': date,
        address,
        unit,
      },
      intent: {
        name: '',
        displayName: action,
      },
    },
  };
}
