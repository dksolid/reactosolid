declare module '*.scss' {
  const content: Record<string, string>;
  // eslint-disable-next-line no-restricted-syntax
  export default content;
}

declare module '*.jpg';
declare module '*.png';
declare module '*.svg';

declare const IS_CLIENT: boolean;
declare const PATH_SEP: string;

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions, @typescript-eslint/naming-convention
interface Console {
  js: (...args: Array<unknown>) => void;
  jsf: (...args: Array<unknown>) => void;
}

declare global {
  declare module 'solid-js' {
    namespace JSX {
      // eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/consistent-type-definitions
      interface HTMLAttributes {
        className?: string | undefined;
        key?: any;
      }
      // eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/consistent-type-definitions
      interface IntrinsicAttributes {
        key?: any;
      }
    }
  }
}
