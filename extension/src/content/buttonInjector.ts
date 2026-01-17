
import { showSharePanel } from './sharePanel';
import { extractEventFromPopup } from './eventExtractor';

const BUTTON_CLASS = 'busical-share-btn';
const BUTTON_INJECTED_ATTR = 'data-busical-injected';

/**
 * Create the share button element
 */
function createShareButton(): HTMLButtonElement {
  const button = document.createElement('button');
  button.className = BUTTON_CLASS;
  button.setAttribute('aria-label', 'Share to another calendar (BusiCal)');
  button.setAttribute('title', 'Share to Calendar (BusiCal)');
  // Arrow left-right icon - indicates sync between calendars
  button.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M8 3L4 7l4 4"/>
      <path d="M4 7h16"/>
      <path d="M16 21l4-4-4-4"/>
      <path d="M20 17H4"/>
    </svg>
  `;
  return button;
}

/**
 * Find the toolbar container in a Google Calendar event popup
 * Uses the Delete button as anchor to find the parent toolbar
 */
function findToolbarContainer(popup: Element): Element | null {
  // Find the Delete event button and get its parent (the toolbar)
  const deleteButton = popup.querySelector('[aria-label="Delete event"]');
  if (deleteButton?.parentElement) {
    return deleteButton.parentElement;
  }

  // Fallback: try other common toolbar buttons
  const fallbackSelectors = [
    '[aria-label="Edit event"]',
    '[aria-label="More actions"]',
    '[aria-label="Close"]',
  ];

  for (const selector of fallbackSelectors) {
    const button = popup.querySelector(selector);
    if (button?.parentElement) {
      return button.parentElement;
    }
  }

  return null;
}

/**
 * Inject share button into a Google Calendar event popup
 */
export function injectShareButton(popup: Element): void {
  // Check if already injected
  if (popup.querySelector(`.${BUTTON_CLASS}`) || popup.hasAttribute(BUTTON_INJECTED_ATTR)) {
    return;
  }

  popup.setAttribute(BUTTON_INJECTED_ATTR, 'true');

  const toolbar = findToolbarContainer(popup);
  if (!toolbar) {
    console.log('BusiCal: Could not find toolbar in popup');
    return;
  }

  const button = createShareButton();
  
  // Store reference to the popup for event extraction
  let currentPanel: { cleanup: () => void } | null = null;

  button.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Close existing panel if open
    if (currentPanel) {
      currentPanel.cleanup();
      currentPanel = null;
      return;
    }

    // Extract event data from the popup
    const event = extractEventFromPopup(popup);
    if (!event) {
      console.error('BusiCal: Could not extract event data');
      return;
    }

    // Show the share panel
    const result = showSharePanel(event, button);
    currentPanel = result;
  });

  // Insert the button as the first child of the toolbar (leftmost position)
  toolbar.insertBefore(button, toolbar.firstChild);

  console.log('BusiCal: Share button injected');
}

/**
 * Check if an element is a Google Calendar event popup
 */
export function isEventPopup(element: Element): boolean {
  // Google Calendar event popups typically have these characteristics:
  // - role="dialog" or similar
  // - Contains event-related content
  // - Has a data-eventid somewhere

  if (element.hasAttribute('data-eventid')) {
    return true;
  }

  if (element.querySelector('[data-eventid]')) {
    return true;
  }

  // Check for popup/dialog characteristics
  const role = element.getAttribute('role');
  if (role === 'dialog' || role === 'alertdialog') {
    // Verify it's an event dialog by looking for time-related content
    const text = element.textContent || '';
    const hasTimePattern = /\d{1,2}:\d{2}\s*(am|pm)?/i.test(text);
    const hasDatePattern = /(monday|tuesday|wednesday|thursday|friday|saturday|sunday|january|february|march|april|may|june|july|august|september|october|november|december)/i.test(text);
    
    if (hasTimePattern || hasDatePattern) {
      return true;
    }
  }

  // Check for bubble/popup class patterns Google might use
  const className = element.className || '';
  if (className.includes('bubble') || className.includes('popup') || className.includes('event')) {
    return true;
  }

  return false;
}

/**
 * Remove all injected buttons (cleanup)
 */
export function removeAllInjectedButtons(): void {
  const buttons = document.querySelectorAll(`.${BUTTON_CLASS}`);
  buttons.forEach(btn => btn.remove());

  const injectedPopups = document.querySelectorAll(`[${BUTTON_INJECTED_ATTR}]`);
  injectedPopups.forEach(popup => popup.removeAttribute(BUTTON_INJECTED_ATTR));
}
