export function rand(max:number, min:number = 0):number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getDigitsSum(operands:number, quantity:number):number {
  let max = 9;
  const maxPosible = max * operands;
  if (maxPosible < quantity) {
    throw new Error('Sum cannot be generated with only digits');
  }

  if (operands == 1) {
    return quantity;
  }

  const nextMaxPosible = maxPosible - max;
  const min = Math.max(quantity - nextMaxPosible, 0);
  max = Math.min(max, quantity);
  const digit = rand(max, min); // Math.floor(Math.random() * (max - min)) + min;
  return digit * Math.pow(10, operands - 1) + getDigitsSum(--operands, quantity-digit);
}
