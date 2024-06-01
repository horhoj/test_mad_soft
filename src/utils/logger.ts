export const logger = (msg: string, params: unknown) => {
  // eslint-disable-next-line no-console
  console.log(JSON.stringify({ msg, params }, null, 2));
};
