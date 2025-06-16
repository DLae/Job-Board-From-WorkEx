'use client'; 

import { useEffect } from 'react';

export default function GovUkInitialiser() {
  useEffect(() => {
    const initGovUK = async () => {
      try {
        // In version 5.10.2, the path structure is different
        if (typeof window !== 'undefined') {
          // Use the IIFE version instead of the ES module version
          const script = document.createElement('script');
          // Make sure you're using the IIFE version, not the ES module version
          script.src = '/assets/govuk-frontend.js';
          script.type = 'text/javascript'; // Explicitly set as regular JavaScript
          script.onload = () => {
            // Once loaded, initialize all components
            if (window.GOVUKFrontend) {
              window.GOVUKFrontend.initAll();
            } else {
              console.error('GOVUKFrontend not available on window object');
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