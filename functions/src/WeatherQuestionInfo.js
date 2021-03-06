// @flow
import type { requestFromDialogFlow } from './flow-typed/callWeatherDesk';

/**
 * Containe the informations send frome the user
 */
export default class WeatherQuestionInfo {
  struct: requestFromDialogFlow;

  constructor(struct: requestFromDialogFlow) {
    if (!struct) throw new Error('The structure is empty');
    if (!struct.queryResult.parameters || !struct.queryResult.intent) throw new Error('Informations are missing in the structure');

    this.struct = struct;
  }

  /**
   * @return {String} the string 'address' from the structure
   */
  get address(): string {
    return this.struct.queryResult.parameters.address;
  }

  /**
   * @return {String} the date selected or if it's not presised, the current date
   * format ISO 8601
   */
  get date(): string {
    // if the user didn't precised the date, use the current date
    if (this.struct.queryResult.parameters['date-time'] === '') return new Date().toISOString();

    return this.struct.queryResult.parameters['date-time'];
  }

  /**
   * @return {String} the intent that matched with the user text
   */
  get intent(): string {
    return this.struct.queryResult.intent.displayName;
  }

  get unit(): string {
    return this.struct.queryResult.parameters.unit || 'C';
  }

  /**
   * @return {boolean} true if the address is notify, else false
   */
  isAddressKnown(): boolean {
    return this.address !== '';
  }
}
