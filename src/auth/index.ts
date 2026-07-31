import { FirebaseAuthentication } from '@capacitor-firebase/authentication';
import type { User as FirebaseUser } from '@capacitor-firebase/authentication';

/**
 * 이 모듈은 Firebase Auth 가 이미 초기화돼 있다고 가정합니다.
 *
 * 앱이 시작할 때 `firebase/app` 의 `initializeApp(config)` 를 먼저 호출해야 합니다.
 * `config` 는 앱마다 다른 Firebase 프로젝트 값이라 core 가 대신 할 수 없습니다 — 절차는
 * app-template 의 `TEMPLATE.md` 를 참고하십시오.
 */

export interface AuthUser {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoUrl: string | null;
  /** true 면 게스트(익명) 계정입니다. */
  isAnonymous: boolean;
  providerId: string;
}

function toAuthUser(user: FirebaseUser | null): AuthUser | null {
  if (!user) return null;
  return {
    uid: user.uid,
    displayName: user.displayName,
    email: user.email,
    photoUrl: user.photoUrl,
    isAnonymous: user.isAnonymous,
    providerId: user.providerId,
  };
}

function requireUser(user: FirebaseUser | null, action: string): AuthUser {
  const mapped = toAuthUser(user);
  if (!mapped) throw new Error(`${action}에 실패했습니다.`);
  return mapped;
}

/** Apple 로그인은 유료 Apple Developer Program 등록과 Sign In with Apple capability 설정이
 * 있어야 동작합니다. 그전까지는 실패하며, 여기서 그 이유를 담아 다시 던집니다. */
function wrapAppleError(action: string, error: unknown): never {
  throw new Error(
    `${action}을 사용할 수 없습니다. 유료 Apple Developer Program 등록과 ` +
      'Sign In with Apple capability 설정이 필요합니다. 절차는 app-template 의 TEMPLATE.md 를 참고하십시오.',
    { cause: error },
  );
}

/** 현재 로그인된 사용자. 없으면 null. */
export async function getCurrentUser(): Promise<AuthUser | null> {
  const { user } = await FirebaseAuthentication.getCurrentUser();
  return toAuthUser(user);
}

/** 구글 계정으로 로그인합니다. */
export async function signInWithGoogle(): Promise<AuthUser> {
  const { user } = await FirebaseAuthentication.signInWithGoogle();
  return requireUser(user, '구글 로그인');
}

/** Apple 계정으로 로그인합니다. 개발 초기에는 실패하는 것이 정상입니다 — 위 설명 참고. */
export async function signInWithApple(): Promise<AuthUser> {
  try {
    const { user } = await FirebaseAuthentication.signInWithApple();
    return requireUser(user, 'Apple 로그인');
  } catch (error) {
    wrapAppleError('Apple 로그인', error);
  }
}

/** 계정 없이 게스트로 시작합니다 (Firebase 익명 인증). */
export async function signInAsGuest(): Promise<AuthUser> {
  const { user } = await FirebaseAuthentication.signInAnonymously();
  return requireUser(user, '게스트 로그인');
}

/**
 * 게스트 계정을 구글 계정으로 전환합니다. 같은 `uid` 를 유지하므로 그동안 쌓인 데이터가
 * 그대로 이어집니다. 게스트로 로그인된 상태에서만 호출하십시오.
 */
export async function linkGuestWithGoogle(): Promise<AuthUser> {
  const { user } = await FirebaseAuthentication.linkWithGoogle();
  return requireUser(user, '구글 계정 연동');
}

/** 게스트 계정을 Apple 계정으로 전환합니다. 조건은 {@link signInWithApple} 과 같습니다. */
export async function linkGuestWithApple(): Promise<AuthUser> {
  try {
    const { user } = await FirebaseAuthentication.linkWithApple();
    return requireUser(user, 'Apple 계정 연동');
  } catch (error) {
    wrapAppleError('Apple 계정 연동', error);
  }
}

/** 로그아웃합니다. */
export async function signOut(): Promise<void> {
  await FirebaseAuthentication.signOut();
}

/**
 * 로그인 상태 변화를 구독합니다. 반환된 함수를 호출하면 구독이 해제됩니다.
 *
 * ```ts
 * const unsubscribe = await onAuthChange((user) => { ... });
 * // 나중에
 * unsubscribe();
 * ```
 */
export async function onAuthChange(
  callback: (user: AuthUser | null) => void,
): Promise<() => void> {
  const handle = await FirebaseAuthentication.addListener('authStateChange', (event) => {
    callback(toAuthUser(event.user));
  });
  return () => {
    void handle.remove();
  };
}

/** 게스트(익명) 계정인지 확인합니다. */
export function isGuest(user: AuthUser | null): boolean {
  return user?.isAnonymous ?? false;
}
