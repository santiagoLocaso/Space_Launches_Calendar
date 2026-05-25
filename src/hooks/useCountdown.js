import { useState, useEffect } from 'react';

export const useCountdown = (targetDate) => {
  const [timeParts, setTimeParts] = useState({ sign: 'T-', d: '00', h: '00', m: '00', s: '00' });

  useEffect(() => {
    const updateTimer = () => {
      const launchTime = new Date(targetDate).getTime();
      const now = new Date().getTime();
      const diff = launchTime - now;

      const isPast = diff < 0;
      const absDiff = Math.abs(diff);

      const days = Math.floor(absDiff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((absDiff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((absDiff / 1000 / 60) % 60);
      const seconds = Math.floor((absDiff / 1000) % 60);

      const pad = (num) => String(num).padStart(2, '0');
      
      setTimeParts({
        sign: isPast ? 'T+' : 'T-',
        d: pad(days),
        h: pad(hours),
        m: pad(minutes),
        s: pad(seconds)
      });
    };

    updateTimer();
    const intervalId = setInterval(updateTimer, 1000);
    return () => clearInterval(intervalId);
  }, [targetDate]);

  return timeParts;
};