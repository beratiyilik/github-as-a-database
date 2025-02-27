/* eslint-disable @typescript-eslint/no-unused-vars */
import { toObject } from '.';
declare global {
  interface String {
    isFalsyOrEmpty(): boolean;
    isFalsyOrWhiteSpace(): boolean;
    toObject<T>(reviver?: (key: string, value: any) => any): T;
  }
}
String.prototype.isFalsyOrEmpty = function (): boolean {
  if (this === null || this === undefined) return true;
  return this === '';
};

String.prototype.isFalsyOrWhiteSpace = function (): boolean {
  if (this === null || this === undefined) return true;
  return this.trim() === '';
};

String.prototype.toObject = function <T>(reviver?: (key: string, value: any) => any): T {
  return toObject(this, reviver);
};

export {};
