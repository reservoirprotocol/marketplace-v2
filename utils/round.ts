const round = (num: number, percision = 4) =>
  Math.floor(num * Math.pow(10, percision)) / Math.pow(10, percision);

export default round;
