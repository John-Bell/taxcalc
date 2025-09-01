/// <reference types="vite/client" />

declare module 'virtual:pwa-register' {
  interface RegisterSWOptions {
    immediate?: boolean;
  }
  function registerSW(options?: RegisterSWOptions): void;
  export { registerSW };
}
