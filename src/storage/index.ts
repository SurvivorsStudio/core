import { Preferences } from '@capacitor/preferences';

/**
 * 키-값 영구 저장소.
 *
 * 네이티브에서는 UserDefaults / SharedPreferences, 웹에서는 localStorage 를 씁니다.
 * 전환은 Capacitor Preferences 플러그인이 알아서 합니다 — 앱 코드에서 분기할 필요가 없습니다.
 *
 * 모든 메서드가 비동기입니다. 네이티브 브리지가 비동기라 localStorage 처럼 동기로 만들 수 없습니다.
 */
export const Storage = {
  /** 값을 읽습니다. 없으면 null. */
  async get(key: string): Promise<string | null> {
    const { value } = await Preferences.get({ key });
    return value;
  },

  /** 값을 저장합니다. */
  async set(key: string, value: string): Promise<void> {
    await Preferences.set({ key, value });
  },

  /** 값을 지웁니다. */
  async remove(key: string): Promise<void> {
    await Preferences.remove({ key });
  },
};
