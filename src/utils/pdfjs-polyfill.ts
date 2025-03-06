/* eslint-disable @typescript-eslint/no-explicit-any */
// Define the PromiseWithResolvers<T> type
interface PromiseWithResolvers<T> {
  promise: Promise<T>;
  resolve: (value: T | PromiseLike<T>) => void;
  reject: (reason?: any) => void;
}

// Polyfill for Promise.withResolvers
if (typeof Promise.withResolvers !== 'function') {
  Promise.withResolvers = function<T>(): PromiseWithResolvers<T> {
    let resolve!: (value: T | PromiseLike<T>) => void;
    let reject!: (reason?: any) => void;
    const promise = new Promise<T>((res, rej) => {
      resolve = res;
      reject = rej;
    });
    return { promise, resolve, reject };
  };
}
