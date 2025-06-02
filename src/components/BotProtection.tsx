
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useBotDetection } from '@/hooks/useBotDetection';
import { useRateLimit } from '@/hooks/useRateLimit';

const PROTECTED_ROUTES = [
  '/dashboard',
  '/admin',
  '/favorites',
  '/reports',
  '/account-info'
];

const PUBLIC_ROUTES = [
  '/',
  '/auth',
  '/learn-more',
  '/about'
];

export const BotProtection = () => {
  const location = useLocation();
  const { isBot, botType } = useBotDetection();
  const { checkRateLimit } = useRateLimit({ 
    type: 'page',
    onBlocked: () => {
      console.warn('Page rate limit exceeded');
    }
  });

  useEffect(() => {
    // Check rate limit on every route change
    checkRateLimit();
  }, [location.pathname, checkRateLimit]);

  useEffect(() => {
    const isProtectedRoute = PROTECTED_ROUTES.some(route => 
      location.pathname.startsWith(route)
    );
    
    const isPublicRoute = PUBLIC_ROUTES.includes(location.pathname);

    // Remove existing meta tags
    const existingNoIndex = document.querySelector('meta[name="robots"]');
    const existingReferrer = document.querySelector('meta[name="referrer"]');
    
    if (existingNoIndex) existingNoIndex.remove();
    if (existingReferrer) existingReferrer.remove();

    // Add appropriate meta tags based on route
    if (isProtectedRoute) {
      // Add strict bot protection for protected routes
      const noIndexMeta = document.createElement('meta');
      noIndexMeta.name = 'robots';
      noIndexMeta.content = 'noindex, nofollow, noarchive, nosnippet, noimageindex';
      document.head.appendChild(noIndexMeta);

      const referrerMeta = document.createElement('meta');
      referrerMeta.name = 'referrer';
      referrerMeta.content = 'no-referrer';
      document.head.appendChild(referrerMeta);
    } else if (isPublicRoute) {
      // Allow indexing for public marketing pages
      const indexMeta = document.createElement('meta');
      indexMeta.name = 'robots';
      indexMeta.content = 'index, follow';
      document.head.appendChild(indexMeta);

      const referrerMeta = document.createElement('meta');
      referrerMeta.name = 'referrer';
      referrerMeta.content = 'strict-origin-when-cross-origin';
      document.head.appendChild(referrerMeta);
    }

    // Log bot activity on protected routes
    if (isBot && isProtectedRoute) {
      console.warn(`Bot ${botType} accessing protected route: ${location.pathname}`);
    }
  }, [location.pathname, isBot, botType]);

  return null; // This component doesn't render anything
};
