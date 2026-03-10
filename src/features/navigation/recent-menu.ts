export type NavigationScreen =
  | 'applications'
  | 'customerInfo'
  | 'portfolioAssets'
  | 'top'
  | 'tradeHistory';

const recentMenusStorageKey = 'iys.navigation.recent-menus';
const maxRecentMenus = 4;

function readRecentMenusRaw() {
  if (typeof window === 'undefined') {
    return [] as NavigationScreen[];
  }

  try {
    const raw = window.localStorage.getItem(recentMenusStorageKey);
    if (!raw) {
      return [] as NavigationScreen[];
    }

    const parsed = JSON.parse(raw) as NavigationScreen[];
    if (!Array.isArray(parsed)) {
      return [] as NavigationScreen[];
    }

    return parsed;
  } catch {
    return [] as NavigationScreen[];
  }
}

export function listRecentMenus() {
  return readRecentMenusRaw();
}

export function pushRecentMenu(screen: NavigationScreen) {
  if (typeof window === 'undefined') {
    return;
  }

  const current = readRecentMenusRaw().filter((item) => item !== screen);
  const next = [screen, ...current].slice(0, maxRecentMenus);
  window.localStorage.setItem(recentMenusStorageKey, JSON.stringify(next));
}

