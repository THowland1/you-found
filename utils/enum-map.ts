export type EnumMap<TEnum extends string | number | symbol, TResult = any> = {
  [key in TEnum]: TResult;
};
