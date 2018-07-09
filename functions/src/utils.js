// @flow
/**
 * convert the date format to the format asked by the API
 * @param {String} dateString - the date to convert
 */
function convertDateToApiFormat(dateString: string): string {
  const dateObj: Date = new Date(dateString);

  const dateSpliter: Array<string> = dateObj.toISOString().split('T');

  return dateSpliter[0];
}

export default convertDateToApiFormat;
