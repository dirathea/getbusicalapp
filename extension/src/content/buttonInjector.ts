
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
  button.setAttribute('aria-label', 'Share to another calendar');
  button.setAttribute('title', 'Share to Calendar (BusiCal)');
  button.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
      <polyline points="16 6 12 2 8 6"/>
      <line x1="12" y1="2" x2="12" y2="15"/>
    </svg>
  `;
  return button;
}

/**
 * Find the action button container in a Google Calendar event popup
 */
function findActionButtonContainer(popup: Element): Element | null {
  // Strategy 1: Look for the delete/edit button group
  // Google Calendar popups usually have a row of action buttons

  // Try to find button containers by looking for elements with multiple buttons
  const buttonContainers = popup.querySelectorAll('[role="button"]');
  if (buttonContainers.length > 0) {
    // Find the parent that contains these buttons
    const firstButton = buttonContainers[0];
    const parent = firstButton.parentElement;
    if (parent && parent.children.length >= 1) {
      return parent;
    }
  }

  // Strategy 2: Look for specific Google Calendar action patterns
  // The popup usually has icons/buttons for edit, delete, etc.
  const actionIcons = popup.querySelectorAll('[data-tooltip], [aria-label]');
  for (const icon of actionIcons) {
    const label = icon.getAttribute('aria-label') || icon.getAttribute('data-tooltip') || '';
    if (label.toLowerCase().includes('delete') || 
        label.toLowerCase().includes('edit') ||
        label.toLowerCase().includes('more')) {
      const parent = icon.parentElement?.parentElement;
      if (parent) {
        return parent;
      }
    }
  }

  // Strategy 3: Look for the content area of the popup
  const contentArea = popup.querySelector('[role="dialog"] > div > div') ||
                      popup.querySelector('[tabindex="-1"]');
  if (contentArea) {
    return contentArea;
  }

  // Fallback: just use the popup itself
  return popup;
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

  const container = findActionButtonContainer(popup);
  if (!container) {
    console.log('BusiCal: Could not find button container in popup');
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

  // Insert the button
  // Try to insert it in a logical position (near other action buttons)
  const existingButtons = container.querySelectorAll('button, [role="button"]');
  if (existingButtons.length > 0) {
    // Insert after the last button
    const lastButton = existingButtons[existingButtons.length - 1];
    lastButton.parentElement?.insertBefore(button, lastButton.nextSibling);
  } else {
    // Just append to the container
    container.appendChild(button);
  }

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
