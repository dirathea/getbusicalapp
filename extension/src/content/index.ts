/**
 * BusiCal Chrome Extension - Content Script
 * 
 * This script runs on Google Calendar pages and injects
 * share buttons into event popups/dialogs.
 */

import { injectShareButton, isEventPopup, removeAllInjectedButtons } from './buttonInjector';
import './styles.css';

// Debounce function to limit how often we process DOM changes
function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Scan the page for event popups and inject buttons
 */
function scanForPopups(): void {
  // Look for potential event popups/dialogs
  const candidates = document.querySelectorAll([
    '[role="dialog"]',
    '[role="alertdialog"]',
    '[data-eventid]',
    '[class*="bubble"]',
    '[class*="popup"]',
    '[class*="event-popup"]',
  ].join(', '));

  candidates.forEach((element) => {
    if (isEventPopup(element)) {
      injectShareButton(element);
    }
  });
}

/**
 * Set up MutationObserver to watch for new popups
 */
function setupObserver(): MutationObserver {
  const debouncedScan = debounce(scanForPopups, 100);

  const observer = new MutationObserver((mutations) => {
    // Check if any mutations added new nodes
    const hasNewNodes = mutations.some(mutation => 
      mutation.addedNodes.length > 0 ||
      mutation.type === 'attributes'
    );

    if (hasNewNodes) {
      debouncedScan();
    }
  });

  // Observe the entire document for changes
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class', 'style', 'data-eventid', 'aria-hidden'],
  });

  return observer;
}

/**
 * Initialize the extension
 */
function init(): void {
  console.log('BusiCal: Extension initialized');

  // Initial scan
  scanForPopups();

  // Set up observer for dynamic content
  const observer = setupObserver();

  // Clean up on page unload
  window.addEventListener('beforeunload', () => {
    observer.disconnect();
    removeAllInjectedButtons();
  });

  // Also scan when the URL changes (Google Calendar is a SPA)
  let lastUrl = location.href;
  const urlObserver = new MutationObserver(() => {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      console.log('BusiCal: URL changed, rescanning');
      // Remove old buttons and rescan
      removeAllInjectedButtons();
      scanForPopups();
    }
  });

  urlObserver.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
