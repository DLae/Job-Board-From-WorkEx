'use client'; 

import { useEffect } from 'react';

export default function GovUkInitialiser() {
  useEffect(() => {
    const initGovUK = async () => {
      try {
        // In version 5.10.2, the path structure is different
        // Instead of dynamic import, let's use a direct approach
        if (typeof window !== 'undefined') {
          // Create a script element
          const script = document.createElement('script');
          script.src = '/assets/govuk-frontend.js';
          script.onload = () => {
            // Once loaded, initialize all components
            if (window.GOVUKFrontend) {
              window.GOVUKFrontend.initAll();
            }
          };
          document.body.appendChild(script);
        }
      } catch (err) {
        console.error('Failed to load GOV.UK Frontend:', err);
      }
    };
    
    initGovUK();
    
    // Clean up function
    return () => {
      const script = document.querySelector('script[src="/assets/govuk-frontend.js"]');
      if (script) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return null;
}