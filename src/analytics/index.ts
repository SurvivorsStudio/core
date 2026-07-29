export type AnalyticsProps = Record<string, string | number | boolean>;

/**
 * 이벤트를 기록합니다.
 *
 * 지금은 콘솔 출력이 전부입니다. 실제 SDK(Firebase 등)를 붙일지, 붙인다면 무엇을 붙일지는
 * 앱이 2~3개 나온 뒤에 정합니다. 호출부는 그때도 그대로 두기 위해 이름만 먼저 고정해 둡니다.
 */
export function track(event: string, props?: AnalyticsProps): void {
  console.debug('[analytics]', event, props ?? {});
}
