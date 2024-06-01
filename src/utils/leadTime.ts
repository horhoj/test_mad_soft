export const leadTime = (startUnixTime: number, endUnixTime: number) => {
  const currentTime = Math.round((endUnixTime - startUnixTime) / 1000);

  const format = (val: number) => (val < 10 ? `0${val}` : val.toString());

  const sec = currentTime % 60;
  const min = (currentTime - sec) / 60;

  return { min: format(min), sec: format(sec) };
};
