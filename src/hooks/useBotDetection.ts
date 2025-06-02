
import { useState, useEffect } from 'react';

interface BotDetectionResult {
  isBot: boolean;
  botType: string | null;
  userAgent: string;
}

const KNOWN_BOTS = [
  'googlebot',
  'bingbot',
  'slurp',
  'duckduckbot',
  'baiduspider',
  'yandexbot',
  'facebookexternalhit',
  'twitterbot',
  'whatsapp',
  'telegrambot',
  'applebot',
  'linkedinbot',
  'pinterestbot',
  'redditbot',
  'scrapy',
  'python-requests',
  'curl',
  'wget',
  'httpclient',
  'selenium',
  'phantomjs',
  'headlesschrome',
  'puppeteer'
];

export const useBotDetection = (): BotDetectionResult => {
  const [detection, setDetection] = useState<BotDetectionResult>({
    isBot: false,
    botType: null,
    userAgent: ''
  });

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    
    const detectedBot = KNOWN_BOTS.find(bot => userAgent.includes(bot));
    
    setDetection({
      isBot: !!detectedBot,
      botType: detectedBot || null,
      userAgent: navigator.userAgent
    });

    // Log suspicious activity
    if (detectedBot) {
      console.warn(`Bot detected: ${detectedBot}`, navigator.userAgent);
    }
  }, []);

  return detection;
};
