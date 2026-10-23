import { PilgrimProfile } from '../types/game';
import { DEFAULT_CHARACTER_AVATARS } from '../data/canonicalCards';

const COOKIE_NAME = 'athanasia_pilgrim_profile';
const STORAGE_KEY = 'athanasia_pilgrim_profile_data';

export function setCookie(name: string, value: string, days = 365): void {
  try {
    let expires = '';
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = `; expires=${date.toUTCString()}`;
    }
    // Encode to safely handle special characters
    const encodedVal = encodeURIComponent(value);
    // Only set cookie if length is within standard browser cookie budget (< 4000 bytes)
    if (encodedVal.length < 3800) {
      document.cookie = `${name}=${encodedVal}${expires}; path=/; SameSite=Lax`;
    }
  } catch (err) {
    console.warn('Cookie set error:', err);
  }
}

export function getCookie(name: string): string | null {
  try {
    const nameEQ = `${name}=`;
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) {
        return decodeURIComponent(c.substring(nameEQ.length, c.length));
      }
    }
  } catch (err) {
    console.warn('Cookie get error:', err);
  }
  return null;
}

export function loadPilgrimProfile(): PilgrimProfile {
  const defaultProfile: PilgrimProfile = {
    playerName: localStorage.getItem('athanasia_player_name') || 'Aninag Bayani',
    characterName: 'Babaylan Tala',
    avatarUrl: DEFAULT_CHARACTER_AVATARS[0].url,
  };

  try {
    // 1. Try localStorage first (handles base64 image data URLs of any size)
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed && parsed.playerName) {
        return {
          playerName: parsed.playerName || defaultProfile.playerName,
          characterName: parsed.characterName || defaultProfile.characterName,
          avatarUrl: parsed.avatarUrl || defaultProfile.avatarUrl,
        };
      }
    }

    // 2. Fall back to Cookie
    const cookieData = getCookie(COOKIE_NAME);
    if (cookieData) {
      const parsed = JSON.parse(cookieData);
      if (parsed && parsed.playerName) {
        return {
          playerName: parsed.playerName || defaultProfile.playerName,
          characterName: parsed.characterName || defaultProfile.characterName,
          avatarUrl: parsed.avatarUrl || defaultProfile.avatarUrl,
        };
      }
    }
  } catch (err) {
    console.warn('Profile load error:', err);
  }

  return defaultProfile;
}

export function savePilgrimProfile(profile: PilgrimProfile): void {
  try {
    // Save to localStorage (unrestricted size for file uploads)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    localStorage.setItem('athanasia_player_name', profile.playerName);

    // Save to Cookie (if avatar is a short URL or stripped for cookie budget)
    const cookiePayload = {
      playerName: profile.playerName,
      characterName: profile.characterName,
      // If avatarUrl is a long base64 string, omit or use default URL in the cookie itself
      avatarUrl: profile.avatarUrl.startsWith('data:') ? 'custom_avatar_data' : profile.avatarUrl,
    };
    setCookie(COOKIE_NAME, JSON.stringify(cookiePayload), 365);
  } catch (err) {
    console.warn('Profile save error:', err);
  }
}
