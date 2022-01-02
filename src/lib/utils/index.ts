/** classname */
export const cn = (...args: any[]) => {
  return args.filter(Boolean).join(' ');
};

export const range = (n: number) => {
  return Array.from({ length: n }).map((_, i) => i);
};

/**
 * Read a ISO string
 */
export const fromISOString = (str: string) => {
  return Date.parse(str);
};

/** Convert from MilliTimestamp (javascript default) to unix  */
export const toUnixTimestamp = (milliTimestamp: number): UnixTimestamp => {
  return (milliTimestamp / 1000) as UnixTimestamp;
};

/* From Unix timestamp to DMY(internatially popular) string date   */
export function toDMYDateString(date: UnixTimestamp): string;
export function toDMYDateString(date: Date): string;
export function toDMYDateString(date: UnixTimestamp | Date): string {
  switch (typeof date) {
    case 'number':
      return new Date(date * 1000).toLocaleDateString('pt-BR');
    case 'object':
      return date.toLocaleDateString('pt-BR');
  }
}

/* From Unix timestamp to readable string date   */
export function toReadableDateString(date: UnixTimestamp): string;
export function toReadableDateString(date: Date): string;
export function toReadableDateString(date: UnixTimestamp | Date): string {
  const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  switch (typeof date) {
    case 'number':
      return new Date(date * 1000).toLocaleDateString('en-US', options);
    case 'object':
      return date.toLocaleDateString('en-US', options);
  }
}

/* format `value` as a currency  */
export function toCurrencyFormat(value: number, countryCode = 'pt-BR', currency = 'BRL') {
  return value.toLocaleString(countryCode, {
    style: 'currency',
    currency
  });
}
