type DeepMapValues<T, TTo = any, TFrom = any> = T extends object
  ? { [K in keyof T]: DeepMapValues<T[K], TFrom, TTo> }
  : T extends any[]
  ? TTo
  : T;

function isObject(value: any): value is object {
  return Object.prototype.toString.call(value) === '[object Object]';
}

function deepMapValues<T extends Record<string, any>>(
  obj: T,
  fn: (v: any, key: string) => any
): DeepMapValues<T> {
  if (!isObject(obj)) {
    throw new Error('First argument must be an object');
  }
  if (!(fn instanceof Function)) {
    throw new Error('Second argument must be a function');
  }

  var result = {} as Record<string, any>;
  var keys = Object.keys(obj);
  var len = keys.length;
  for (let i = 0; i < len; i++) {
    var key = keys[i];
    var value = obj[key];
    var mappedValue = isObject(value)
      ? deepMapValues(value, fn)
      : Array.isArray(value)
      ? value.map(v => deepMapValues(v, fn))
      : fn(value, key);
    result[key] = mappedValue;
  }
  return result as DeepMapValues<T>;
}

export type Serialized<TProp> = DeepMapValues<TProp, string, Date>;

function serializeValue(value: any): any {
  return value instanceof Date ? `DATE:${value.toISOString()}` : value;
}
function deserializeValue(value: any): any {
  return typeof value === 'string' && value.startsWith('DATE:')
    ? new Date(value.replace('DATE:', ''))
    : value;
}

export function serialize<T>(prop: T): Serialized<T> {
  return (
    Array.isArray(prop)
      ? prop.map(p => serialize(p))
      : deepMapValues(prop, (v: any) => serializeValue(v))
  ) as Serialized<T>;
}
export function deserialize<T extends Record<string, any>>(
  prop: Serialized<T>
): T {
  return (
    Array.isArray(prop)
      ? prop.map(p => deserialize(p))
      : deepMapValues(prop, (v: any) => deserializeValue(v))
  ) as T;
}
