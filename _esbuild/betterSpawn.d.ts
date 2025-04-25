declare module 'better-spawn' {
  const exp: (
    command: string,
    options?: any
  ) => { close: () => void; stdout: any; stderr: any } = () => {
    return void 0;
  };

  // eslint-disable-next-line import/no-unused-modules,no-restricted-syntax
  export default exp;
}
