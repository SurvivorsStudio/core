import { Preferences } from '@capacitor/preferences';

/**
 * Preferences 는 문자열만 저장합니다. 숫자·객체를 다루려면 변환이 필요하며,
 * 그 변환을 앱마다 반복하지 않도록 여기서 흡수합니다.
 */
async function readRaw(key: string): Promise<string | null> {
  const { value } = await Preferences.get({ key });
  return value;
}

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
    return readRaw(key);
  },

  /** 값을 저장합니다. */
  async set(key: string, value: string): Promise<void> {
    await Preferences.set({ key, value });
  },

  /** 값을 지웁니다. */
  async remove(key: string): Promise<void> {
    await Preferences.remove({ key });
  },

  /**
   * 숫자를 읽습니다. 값이 없거나 숫자로 해석할 수 없으면 `fallback` 을 돌려줍니다.
   *
   * 최고점수·레벨·카운트처럼 숫자를 저장하는 앱은 `Number(await get(k) ?? '0')` 을
   * 매번 쓰게 되므로 그 왕복을 여기서 처리합니다.
   *
   * ```ts
   * const best = await Storage.getNumber('highScore');      // 없으면 0
   * const lives = await Storage.getNumber('lives', 3);       // 없으면 3
   * ```
   */
  async getNumber(key: string, fallback = 0): Promise<number> {
    const raw = await readRaw(key);
    if (raw === null) return fallback;

    // 빈 문자열은 Number('') === 0 이라 숫자로 통과해 버립니다. 숫자 표현이 아니므로 제외합니다
    const trimmed = raw.trim();
    if (trimmed === '') return fallback;

    const parsed = Number(trimmed);
    // NaN 과 Infinity 를 함께 걸러냅니다
    return Number.isFinite(parsed) ? parsed : fallback;
  },

  /** 숫자를 저장합니다. */
  async setNumber(key: string, value: number): Promise<void> {
    await Preferences.set({ key, value: String(value) });
  },
};
