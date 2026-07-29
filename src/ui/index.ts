/**
 * 노치·홈 인디케이터 영역을 CSS 변수로 노출합니다.
 *
 * CSS 에서 이렇게 씁니다:
 *   padding-top: var(--safe-area-top);
 *
 * env() 값은 JS 로 읽을 수 없어서, 계산 대신 변수 정의만 심어 줍니다.
 * viewport-fit=cover 메타 태그가 있어야 0 이 아닌 값이 들어옵니다.
 */
export function applySafeAreaVars(target: HTMLElement = document.documentElement): void {
  const sides = ['top', 'right', 'bottom', 'left'] as const;
  for (const side of sides) {
    target.style.setProperty(`--safe-area-${side}`, `env(safe-area-inset-${side}, 0px)`);
  }
}
