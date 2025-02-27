// Type definition for the custom comparer function
type Comparer = (a: string, b: string) => number;

// Type definition for the custom replacer function
type Replacer = (key: string, value: any) => any | (number | string)[] | null;

// Updated SerializationOptions interface to include Comparer and replacer
interface SerializationOptions {
  replacer?: Replacer;
  space?: string | number;
  cycles?: boolean;
  comparer?: Comparer;
}

// Utility function for indentation
const getIndent = (space: string, level: number): string => `\n${new Array(level + 1).join(space)}`;

// Custom stringify function implementing the Comparer interface
const customStringify = (
  value: any,
  replacer: Replacer,
  space: string,
  isCyclic: boolean,
  comparer: Comparer | null,
  level = 0,
): string | undefined => {
  const indent = getIndent(space, level);
  const colonSeparator = space ? ': ' : ':';

  if (typeof value !== 'object' || value === null) return JSON.stringify(value);

  if (Array.isArray(value)) return serializeArray(value, replacer, space, isCyclic, comparer, level);
  else return serializeObject(value, replacer, space, isCyclic, comparer, level, indent, colonSeparator);
};

// Serialization for an array
const serializeArray = (arr: any[], replacer: Replacer, space: string, isCyclic: boolean, comparer: Comparer | null, level: number): string => {
  const items = arr.map(item => customStringify(item, replacer, space, isCyclic, comparer, level + 1) || JSON.stringify(null));
  const indent = getIndent(space, level);
  return `[${items.join(',')}${indent}]`;
};

// Serialization for an object
const serializeObject = (
  obj: any,
  replacer: Replacer,
  space: string,
  isCyclic: boolean,
  comparer: Comparer | null,
  level: number,
  indent: string,
  colonSeparator: string,
): string => {
  const keys = comparer ? Object.keys(obj).sort(comparer) : Object.keys(obj);
  const items = keys
    .map(key => {
      const value = customStringify(obj[key], replacer, space, isCyclic, comparer, level + 1);
      return value ? `${JSON.stringify(key)}${colonSeparator}${value}` : undefined;
    })
    .filter(Boolean);
  return `{${items.join(',')}${indent}}`;
};

// Main function to serialize with options, using Comparer and replacer types correctly
const jsonStableStringify = (obj: any, options: SerializationOptions = {}): string => {
  const { space = '', cycles = false, comparer = null } = options;
  const replacer = options.replacer || ((key: any, value: any) => value);
  const indentSpace = typeof space === 'number' ? ' '.repeat(space) : space;

  return customStringify(obj, replacer, indentSpace, cycles, comparer);
};

// Conversion functions using the refactored stringify, with correct type applications
const toJSON = (value: any, options?: SerializationOptions): string => jsonStableStringify(value, { ...options, space: 2 });
const toObject = <Type = unknown>(text: string, reviver?: (key: string, value: any) => any): Type => JSON.parse(text, reviver);

export { toJSON, toObject };
