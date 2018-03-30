/**
* Converts boolean value to integer value.
* @param {boolean} value - The boolean value.
* @return {number} value converted to int, when true then 1 otherwise 0
*/  
export function bool2int(value: boolean) {
  return value === true ? 1 : 0; 
}

/**
* Coverts input date to unix timestamp.
* @param {value} Date - The date value.
* @return {number} Unix timestamp representation of the value
*/  
export function date2timestamp(value: Date) {
  return Math.floor(value.getTime() / 1000);
}

/**
* Get current date/time as unix timestamp.
* @return {number} Unix timestamp representation of the current time
*/  
export function nowTimestamp() {
  return date2timestamp(new Date());
}
