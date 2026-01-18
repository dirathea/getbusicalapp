
import { showSharePanel } from './sharePanel';
import { extractEventFromPopup } from './eventExtractor';

const BUTTON_CLASS = 'busical-share-btn';
const BUTTON_WRAPPER_CLASS = 'busical-share-btn-wrapper';
const BUTTON_INJECTED_ATTR = 'data-busical-injected';

// BusiCal share icon - arrow left-right indicating sync between calendars
const BUSICAL_ICON_SVG = `
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M8 3L4 7l4 4"/>
    <path d="M4 7h16"/>
    <path d="M16 21l4-4-4-4"/>
    <path d="M20 17H4"/>
  </svg>
`;

/**
 * Find the Delete/Remove button's wrapper div in a Google Calendar event popup
 * Structure: div (wrapper) > ... > button[@aria-label="Delete event" or "Remove from this calendar"]
 * We get ancestor::div[1] to get the immediate parent wrapper div
 * Note: Some events show "Delete event", others show "Remove from this calendar"
 */
function findDeleteButtonWrapper(popup: Element): Element | null {
  const xpath = './/button[@aria-label="Delete event" or @aria-label="Remove from this calendar"]/ancestor::div[1]';

  const result = document.evaluate(
    xpath,
    popup,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  );

  return result.singleNodeValue as Element | null;
}

/**
 * Find the toolbar container in a Google Calendar event popup
 * Uses XPath to reliably traverse from Delete/Remove button to toolbar
 * Structure: button -> span -> div (wrapper) -> div (toolbar)
 * So we need ancestor::div[2]
 * Note: Some events show "Delete event", others show "Remove from this calendar"
 */
function findToolbarContainer(popup: Element): Element | null {
  // Find Delete/Remove button as reliable anchor, then get 2nd ancestor div (toolbar)
  const xpath = './/button[@aria-label="Delete event" or @aria-label="Remove from this calendar"]/ancestor::div[2]';

  const result = document.evaluate(
    xpath,
    popup,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  );

  return result.singleNodeValue as Element | null;
}

/**
 * Create the share button by cloning the Delete button's wrapper structure
 * This ensures we inherit all of Google Calendar's styles and layout
 */
function createShareButtonFromDeleteButton(deleteWrapper: Element): HTMLElement | null {
  // Clone the entire wrapper structure
  const wrapper = deleteWrapper.cloneNode(true) as HTMLElement;
  
  // Clear all children - we'll add our own button
  wrapper.innerHTML = '';
  
  // Add our identifier class
  wrapper.classList.add(BUTTON_WRAPPER_CLASS);
  
  // Remove Google's jsaction to prevent their event handlers
  wrapper.removeAttribute('jsaction');
  
  // Create our simple button element
  const button = document.createElement('button');
  button.className = BUTTON_CLASS;
  button.setAttribute('aria-label', 'Share to another calendar (BusiCal)');
  button.setAttribute('title', 'Share to Calendar (BusiCal)');
  button.innerHTML = BUSICAL_ICON_SVG;
  
  wrapper.appendChild(button);
  
  return wrapper;
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

  // Find the Delete button's wrapper to clone its structure
  const deleteWrapper = findDeleteButtonWrapper(popup);
  if (!deleteWrapper) {
    console.log('BusiCal: Could not find Delete button wrapper in popup');
    return;
  }

  // Find the toolbar to insert our button
  const toolbar = findToolbarContainer(popup);
  if (!toolbar) {
    console.log('BusiCal: Could not find toolbar in popup');
    return;
  }

  // Create our button by cloning the Delete button's wrapper structure
  const wrapper = createShareButtonFromDeleteButton(deleteWrapper);
  if (!wrapper) {
    console.log('BusiCal: Could not create share button wrapper');
    return;
  }

  const button = wrapper.querySelector(`.${BUTTON_CLASS}`) as HTMLButtonElement;
  
  // Store reference to the popup for event extraction
  let currentPanel: { cleanup: () => void } | null = null;

  button.addEventListener('click', (e: MouseEvent) => {
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

  // Insert the wrapper (with button) as the first child of the toolbar (leftmost position)
  toolbar.insertBefore(wrapper, toolbar.firstChild);

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
  // Remove wrappers (which contain the buttons)
  const wrappers = document.querySelectorAll(`.${BUTTON_WRAPPER_CLASS}`);
  wrappers.forEach(wrapper => wrapper.remove());

  // Also remove any standalone buttons (in case of legacy)
  const buttons = document.querySelectorAll(`.${BUTTON_CLASS}`);
  buttons.forEach(btn => btn.remove());

  const injectedPopups = document.querySelectorAll(`[${BUTTON_INJECTED_ATTR}]`);
  injectedPopups.forEach(popup => popup.removeAttribute(BUTTON_INJECTED_ATTR));
}
