
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

interface SuspiciousActivity {
  rapidNavigation: boolean;
  unusualPatterns: boolean;
  suspiciousRequestCount: number;
  lastActivity: number;
}

const RAPID_NAVIGATION_THRESHOLD = 5; // navigations per 10 seconds
const SUSPICIOUS_REQUEST_THRESHOLD = 20; // requests per minute

export const useSuspiciousActivityDetection = () => {
  const location = useLocation();
  const [activity, setActivity] = useState<SuspiciousActivity>({
    rapidNavigation: false,
    unusualPatterns: false,
    suspiciousRequestCount: 0,
    lastActivity: Date.now()
  });

  const navigationCount = useRef(0);
  const navigationTimestamps = useRef<number[]>([]);
  const requestCount = useRef(0);
  const requestTimestamps = useRef<number[]>([]);

  // Track navigation patterns
  useEffect(() => {
    const now = Date.now();
    navigationTimestamps.current.push(now);
    navigationCount.current++;

    // Clean old timestamps (older than 10 seconds)
    navigationTimestamps.current = navigationTimestamps.current.filter(
      timestamp => now - timestamp < 10000
    );

    const rapidNavigation = navigationTimestamps.current.length > RAPID_NAVIGATION_THRESHOLD;

    setActivity(prev => ({
      ...prev,
      rapidNavigation,
      lastActivity: now
    }));

    if (rapidNavigation) {
      console.warn('Suspicious activity detected: Rapid navigation');
    }
  }, [location.pathname]);

  // Track request patterns
  const trackRequest = () => {
    const now = Date.now();
    requestTimestamps.current.push(now);
    requestCount.current++;

    // Clean old timestamps (older than 1 minute)
    requestTimestamps.current = requestTimestamps.current.filter(
      timestamp => now - timestamp < 60000
    );

    const suspiciousRequestCount = requestTimestamps.current.length;
    const unusualPatterns = suspiciousRequestCount > SUSPICIOUS_REQUEST_THRESHOLD;

    setActivity(prev => ({
      ...prev,
      suspiciousRequestCount,
      unusualPatterns,
      lastActivity: now
    }));

    if (unusualPatterns) {
      console.warn('Suspicious activity detected: High request frequency');
    }
  };

  const isSuspicious = activity.rapidNavigation || activity.unusualPatterns;

  return {
    activity,
    isSuspicious,
    trackRequest
  };
};
