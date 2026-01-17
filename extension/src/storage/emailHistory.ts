import type { CalendarPlatform } from '../lib/types';

const STORAGE_KEY = 'busical_email_history';
const MAX_HISTORY_ITEMS = 10;

interface EmailHistoryData {
  google: string[];
  outlook: string[];
}

/**
 * Get email history from chrome.storage.local
 */
export async function getEmailHistory(
  platform: CalendarPlatform
): Promise<string[]> {
  try {
    const result = await chrome.storage.local.get(STORAGE_KEY);
    const data: EmailHistoryData = result[STORAGE_KEY] || {
      google: [],
      outlook: [],
    };
    return data[platform] || [];
  } catch (error) {
    console.error('Failed to get email history:', error);
    return [];
  }
}

/**
 * Save email to history (most recent first, deduped)
 */
export async function saveEmailToHistory(
  platform: CalendarPlatform,
  email: string
): Promise<void> {
  if (!email || !email.trim()) return;

  const normalizedEmail = email.trim().toLowerCase();

  try {
    const result = await chrome.storage.local.get(STORAGE_KEY);
    const data: EmailHistoryData = result[STORAGE_KEY] || {
      google: [],
      outlook: [],
    };

    // Get current history for platform
    const history = data[platform] || [];

    // Remove existing entry if present (to move to front)
    const filtered = history.filter(
      (e) => e.toLowerCase() !== normalizedEmail
    );

    // Add to front
    filtered.unshift(email.trim());

    // Limit size
    data[platform] = filtered.slice(0, MAX_HISTORY_ITEMS);

    // Save back
    await chrome.storage.local.set({ [STORAGE_KEY]: data });
  } catch (error) {
    console.error('Failed to save email to history:', error);
  }
}

/**
 * Get all emails across platforms (for general autocomplete)
 */
export async function getAllEmails(): Promise<string[]> {
  try {
    const result = await chrome.storage.local.get(STORAGE_KEY);
    const data: EmailHistoryData = result[STORAGE_KEY] || {
      google: [],
      outlook: [],
    };

    // Combine and dedupe
    const allEmails = [...data.google, ...data.outlook];
    const unique = [...new Set(allEmails.map((e) => e.toLowerCase()))];

    // Return original casing for first occurrence
    return unique.map((lower) =>
      allEmails.find((e) => e.toLowerCase() === lower) || lower
    );
  } catch (error) {
    console.error('Failed to get all emails:', error);
    return [];
  }
}

/**
 * Clear email history
 */
export async function clearEmailHistory(): Promise<void> {
  try {
    await chrome.storage.local.remove(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear email history:', error);
  }
}
