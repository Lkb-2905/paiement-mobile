import { useEffect, useState } from 'react';
import { Event } from '../types';
import { fetchEvents } from '../services/events';

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      setLoading(true);
      const data = await fetchEvents();
      setEvents(data);
      setError('');
    } catch {
      setError('Impossible de charger les événements.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const init = async () => {
      try {
        setLoading(true);
        const data = await fetchEvents();
        if (isMounted) {
          setEvents(data);
          setError('');
        }
      } catch {
        if (isMounted) setError('Impossible de charger les événements.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    init();
    return () => {
      isMounted = false;
    };
  }, []);

  return { events, loading, error, refetch: load };
};
