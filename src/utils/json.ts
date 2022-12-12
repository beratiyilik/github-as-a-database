export const toJSON = (data: any): string => jsonStableStringify(data, { space: 2 });

export const toObject = <Type = any>(data: string): Type => <Type>JSON.parse(data);

const jsonStableStringify = (obj: any, opts: any): any => {
  if (!opts) opts = {};
  if (typeof opts === 'function') opts = { cmp: opts };
  let space = opts.space || '';
  if (typeof space === 'number') space = Array(space + 1).join(' ');
  const cycles = typeof opts.cycles === 'boolean' ? opts.cycles : false;
  const replacer =
    opts.replacer ||
    function (_key: any, value: any): any {
      return value;
    };

  const cmp =
    opts.cmp &&
    (function (f) {
      return (node: any) => {
        return (first: any, second: any): any => {
          const firstObj = { key: first, value: node[first] };
          const secondObj = { key: second, value: node[second] };
          return f(firstObj, secondObj);
        };
      };
    })(opts.cmp);

  const seen: any[] = [];

  const stringify = (parent: any, key: string | number, node: any, level: number): any => {
    const indent = space ? `\n${new Array(level + 1).join(space)}` : '';
    const colonSeparator = space ? ': ' : ':';

    if (node && node.toJSON && typeof node.toJSON === 'function') node = node.toJSON();

    node = replacer.call(parent, key, node);

    if (node === undefined) return;

    if (typeof node !== 'object' || node === null) return JSON.stringify(node);

    if (Array.isArray(node)) {
      const out = [];
      if (node.length === 0) return '[]';
      for (let i = 0; i < node.length; i++) {
        const item = stringify(node, i, node[i], level + 1) || JSON.stringify(null);
        out.push(indent + space + item);
      }
      return `[${out.join(',')}${indent}]`;
    } else {
      if (seen.indexOf(node) !== -1) {
        if (cycles) return JSON.stringify('__cycle__');
        throw new TypeError('Converting circular structure to JSON');
      } else seen.push(node);

      const keys = Object.keys(node).sort(cmp && cmp(node));
      const out = [];
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const value = stringify(node, key, node[key], level + 1);

        if (!value) continue;

        const keyValue = JSON.stringify(key) + colonSeparator + value;
        out.push(indent + space + keyValue);
      }
      seen.splice(seen.indexOf(node), 1);
      return `{${out.join(',')}${indent}}`;
    }
  };

  return stringify({ '': obj }, '', obj, 0);
};
