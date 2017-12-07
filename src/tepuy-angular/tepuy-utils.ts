/**
 * General purpose library to use accross the module
 * @class  TepuyUtils
 */
 export class TepuyUtils {
  /**
   * Converts boolean value to integer value.
   * @param {boolean} value - The boolean value.
   * @return {number} value converted to int, when true then 1 otherwise 0
   */  
  static bValue(value: boolean) { 
    return value === true ? 1 : 0; 
  }
}