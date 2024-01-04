type PromisifyType = <T, Args extends any[]>(
  func: (...args: [...Args, (error: any, result: T) => void]) => void,
) => (...funcArgs: Args) => Promise<T>;

const promisify: PromisifyType = <T, Args extends any[]>(func: (...args: [...Args, (error: any, result: T) => void]) => void) => {
  return (...args: Args) =>
    new Promise<T>((resolve, reject) => {
      const callback = (error: any, result: T) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      };
      func(...args, callback);
    });
};

export default promisify;
