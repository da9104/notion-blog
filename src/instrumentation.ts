export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Node.js v22+ ships a native `localStorage` stub but its methods are undefined
    // unless --localstorage-file is set to a valid path. Any package that calls
    // localStorage.getItem() without a typeof window guard will throw.
    // Polyfill it with a safe no-op before any module can reach it.
    if (typeof localStorage !== 'undefined' && typeof (localStorage as any).getItem !== 'function') {
      Object.defineProperty(globalThis, 'localStorage', {
        value: {
          getItem: (_key: string): null => null,
          setItem: (_key: string, _value: string): void => {},
          removeItem: (_key: string): void => {},
          clear: (): void => {},
          key: (_index: number): null => null,
          length: 0,
        },
        writable: true,
        configurable: true,
      });
    }
  }
}
