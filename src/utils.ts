export const randomNumber = (min: number = 0, max: number = 1): number => {
   if (min > max) throw new Error("min must be less than max");
   return Math.round(Math.random() * (max - min) + min);
};

export const sleep = (ms: number): Promise<void> => {
   return new Promise((resolve) => setTimeout(resolve, ms));
};

export const randomEnum = <T>(anEnum: T): T[keyof T] => {
   const enumValues = (Object.keys(anEnum)
      .map((n) => Number.parseInt(n))
      .filter((n) => !Number.isNaN(n)) as unknown) as T[keyof T][];
   const randomIndex = Math.floor(Math.random() * enumValues.length);
   const randomEnumValue = enumValues[randomIndex];
   return randomEnumValue;
};
