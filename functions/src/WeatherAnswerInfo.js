/**
 * Containe the informations send frome the user
 */
export default class WeatherAnswerInfo {
  constructor(struct: mixed) {
    if (!struct) throw new Error('The structure is empty');

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
  get date() {
    // if the user didn't precised the date, use the current date
    if (this.struct.queryResult.parameters['date-time'] === '') return new Date();

    return this.struct.queryResult.parameters['date-time'];
  }

  /**
   * @return {boolean} true if the address is notify, else false
   */
  isAddressKnown() {
    return this.address !== '';
  }
}