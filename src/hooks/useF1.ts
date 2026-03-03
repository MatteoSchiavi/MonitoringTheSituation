// src/hooks/useF1.ts
import { useState, useEffect } from 'react';

export function useF1() {
  const [data, setData] = useState<any>(null);
  const [status, setStatus] = useState<'loading' | 'online' | 'offline'>('loading');

  useEffect(() => {
    async function fetchF1() {
      try {
        // Fetch the latest session
        const sessionRes = await fetch('https://api.openf1.org/v1/sessions?latest');
        const sessions = await sessionRes.json();
        const latestSession = sessions[0];

        // Fetch top 5 positions for that session
        const posRes = await fetch(`https://api.openf1.org/v1/position?session_key=${latestSession.session_key}`);
        const positions = await posRes.json();
        
        // Get unique latest position for each driver
        const latestPositions = positions.reduce((acc: any, curr: any) => {
          if (!acc[curr.driver_number] || new Date(curr.date) > new Date(acc[curr.driver_number].date)) {
            acc[curr.driver_number] = curr;
          }
          return acc;
        }, {});

        setData({
          session: latestSession,
          positions: Object.values(latestPositions).slice(0, 5)
        });
        setStatus('online');
      } catch (e) {
        setStatus('offline');
      }
    }

    fetchF1();
    const interval = setInterval(fetchF1, 10000); // Update every 10 seconds
    return () => clearInterval(interval);
  }, []);

  return { data, status };
}