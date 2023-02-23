import {useEffect, useState} from "react";

interface CountDownValues {
  days: number,
  hours: number,
  minutes: number,
  seconds: number,
}

const useCountdown = (targetDate: number): CountDownValues => {
  const countDownDate: number = new Date(targetDate).getTime();

  const [countDown, setCountDown] = useState<number>(countDownDate - new Date().getTime());

  useEffect(() => {
    const interval = setInterval(() => {
      setCountDown(countDownDate - new Date().getTime());
    }, 1000);

    return () => clearInterval(interval);
  }, [countDownDate]);

  return getReturnValues(countDown);
};

const getReturnValues = (countDown: number): CountDownValues => {
  
  let days: number = Math.floor((countDown / (1000 * 60 * 60 * 24)));
  let hours: number = Math.floor((countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  let minutes: number = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60));
  let seconds: number = Math.floor((countDown % (1000 * 60)) / 1000);

  if (days < 0) { days = 0; }
  if (hours < 0) { hours = 0; }
  if (minutes < 0) { minutes = 0; }
  if (seconds < 0) { seconds = 0; }

  return { days, hours, minutes, seconds };
};

export default useCountdown;