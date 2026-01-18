import type { ExtractedEvent, CalendarPlatform } from '../lib/types';
import {
  createSyncEventData,
  generateGoogleCalendarLink,
  generateOutlookCalendarLink,
  openCalendarLink,
} from '../lib/calendarLinks';
import { saveEmailToHistory, getAllEmails } from '../storage/emailHistory';

/**
 * Find the popup container by traversing up from the anchor element
 * Google Calendar popups use aria-modal="true" on the container div
 * The actual content is inside the first <span> child (focus traps are <div>s)
 * This keeps interactions inside the popup so Google doesn't close it
 */
function findPopupContainer(anchorElement: HTMLElement): Element | null {
  // Primary: Google Calendar popup with aria-modal="true"
  const modal = anchorElement.closest('[aria-modal="true"]');
  if (modal) {
    // Get the first span child - this is the content container
    // (the focus trap divs come before/after, but the span holds actual content)
    const contentSpan = modal.querySelector(':scope > span');
    if (contentSpan) return contentSpan;

    // Fallback to modal itself
    return modal;
  }

  // Fallback: role="dialog" (standard ARIA pattern)
  const dialog = anchorElement.closest('[role="dialog"]');
  if (dialog) {
    const contentSpan = dialog.querySelector(':scope > span');
    if (contentSpan) return contentSpan;
    return dialog;
  }

  return null;
}

/**
 * Create the share panel DOM element
 */
export function createSharePanel(
  event: ExtractedEvent,
  onClose: () => void
): HTMLElement {
  const panel = document.createElement('div');
  panel.className = 'busical-share-panel';
  panel.setAttribute('data-busical', 'true');

  // Header
  const header = document.createElement('div');
  header.className = 'busical-panel-header';
  header.innerHTML = `
    <span class="busical-panel-title">Share to Calendar</span>
    <button class="busical-close-btn" aria-label="Close">&times;</button>
  `;
  
  const closeBtn = header.querySelector('.busical-close-btn');
  closeBtn?.addEventListener('click', onClose);

  // Platform selector
  const platformSection = document.createElement('div');
  platformSection.className = 'busical-platform-section';

  const platforms: { id: CalendarPlatform; label: string; icon: string }[] = [
    { id: 'google', label: 'Google Calendar', icon: 'G' },
    { id: 'outlook', label: 'Outlook Calendar', icon: 'O' },
  ];

  let selectedPlatform: CalendarPlatform = 'google';

  platforms.forEach((platform, index) => {
    const option = document.createElement('label');
    option.className = 'busical-platform-option';
    option.innerHTML = `
      <input type="radio" name="busical-platform" value="${platform.id}" ${index === 0 ? 'checked' : ''}>
      <span class="busical-platform-icon">${platform.icon}</span>
      <span class="busical-platform-label">${platform.label}</span>
    `;
    
    const input = option.querySelector('input');
    input?.addEventListener('change', () => {
      selectedPlatform = platform.id;
      updateEmailPlaceholder();
    });
    
    platformSection.appendChild(option);
  });

  // Email input section
  const emailSection = document.createElement('div');
  emailSection.className = 'busical-email-section';

  const emailLabel = document.createElement('label');
  emailLabel.className = 'busical-email-label';
  emailLabel.textContent = 'Email (optional)';
  emailLabel.setAttribute('for', 'busical-email-input');

  const emailWrapper = document.createElement('div');
  emailWrapper.className = 'busical-email-wrapper';

  const emailInput = document.createElement('input');
  emailInput.type = 'email';
  emailInput.id = 'busical-email-input';
  emailInput.className = 'busical-email-input';
  emailInput.placeholder = 'user@gmail.com';
  emailInput.autocomplete = 'email';

  const dropdown = document.createElement('ul');
  dropdown.className = 'busical-email-dropdown';
  dropdown.style.display = 'none';

  function updateEmailPlaceholder() {
    emailInput.placeholder = selectedPlatform === 'google' 
      ? 'user@gmail.com' 
      : 'user@outlook.com';
  }

  // Email autocomplete functionality
  async function showDropdown() {
    const emails = await getAllEmails();
    if (emails.length === 0) {
      dropdown.style.display = 'none';
      return;
    }

    dropdown.innerHTML = '';
    const inputValue = emailInput.value.toLowerCase();
    
    const filtered = inputValue 
      ? emails.filter(e => e.toLowerCase().includes(inputValue))
      : emails;

    if (filtered.length === 0) {
      dropdown.style.display = 'none';
      return;
    }

    filtered.slice(0, 5).forEach(email => {
      const li = document.createElement('li');
      li.className = 'busical-email-option';
      li.textContent = email;
      li.addEventListener('click', () => {
        emailInput.value = email;
        dropdown.style.display = 'none';
      });
      dropdown.appendChild(li);
    });

    dropdown.style.display = 'block';
  }

  emailInput.addEventListener('focus', showDropdown);
  emailInput.addEventListener('input', showDropdown);
  
  // Hide dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!emailWrapper.contains(e.target as Node)) {
      dropdown.style.display = 'none';
    }
  });

  emailWrapper.appendChild(emailInput);
  emailWrapper.appendChild(dropdown);
  emailSection.appendChild(emailLabel);
  emailSection.appendChild(emailWrapper);

  // Helper text
  const helperText = document.createElement('p');
  helperText.className = 'busical-helper-text';
  helperText.textContent = 'Event will sync as "Synced Event" marked busy';

  // Action button
  const actionBtn = document.createElement('button');
  actionBtn.className = 'busical-action-btn';
  actionBtn.textContent = 'Open Calendar';
  
  actionBtn.addEventListener('click', async () => {
    const email = emailInput.value.trim() || undefined;
    const syncData = createSyncEventData(event);
    
    let url = '';
    if (selectedPlatform === 'google') {
      url = generateGoogleCalendarLink(syncData, email);
    } else {
      url = generateOutlookCalendarLink(syncData, email);
    }

    // Save email to history if provided
    if (email) {
      await saveEmailToHistory(selectedPlatform, email);
    }

    openCalendarLink(url);
    onClose();
  });

  // Assemble panel
  panel.appendChild(header);
  panel.appendChild(platformSection);
  panel.appendChild(emailSection);
  panel.appendChild(helperText);
  panel.appendChild(actionBtn);

  return panel;
}

/**
 * Show the share panel anchored to a button
 */
export function showSharePanel(
  event: ExtractedEvent,
  anchorElement: HTMLElement
): { panel: HTMLElement; cleanup: () => void } {
  // Remove any existing panel
  const existingPanel = document.querySelector('.busical-share-panel');
  existingPanel?.remove();

  const cleanup = () => {
    panel.remove();
    document.removeEventListener('keydown', handleKeyDown);
    document.removeEventListener('click', handleClickOutside);
  };

  const panel = createSharePanel(event, cleanup);

  // Find the popup container to keep focus inside
  // This prevents Google Calendar from closing the popup when interacting with our panel
  const popupContainer = findPopupContainer(anchorElement);

  // Position the panel near the anchor element using fixed positioning
  // Fixed positioning works reliably regardless of the container's positioning context
  const rect = anchorElement.getBoundingClientRect();
  panel.style.position = 'fixed';
  panel.style.top = `${rect.bottom + 8}px`;
  panel.style.left = `${rect.left}px`;
  panel.style.zIndex = '10000';

  // Append to popup container if found (keeps focus inside), fallback to body
  if (popupContainer) {
    popupContainer.appendChild(panel);
  } else {
    console.warn('BusiCal: Could not find popup container, appending to body');
    document.body.appendChild(panel);
  }

  // Close on escape key
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      cleanup();
    }
  };
  document.addEventListener('keydown', handleKeyDown);

  // Close when clicking outside
  const handleClickOutside = (e: MouseEvent) => {
    if (!panel.contains(e.target as Node) && !anchorElement.contains(e.target as Node)) {
      cleanup();
    }
  };
  // Delay adding the listener to avoid immediate close
  setTimeout(() => {
    document.addEventListener('click', handleClickOutside);
  }, 100);

  return { panel, cleanup };
}
