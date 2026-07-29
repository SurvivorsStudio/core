let context: AudioContext | undefined;

/**
 * AudioContext 는 사용자 제스처 이후에만 생성·재개할 수 있습니다.
 * 그래서 미리 만들지 않고 첫 재생 시점에 만듭니다.
 */
function getContext(): AudioContext {
  context ??= new AudioContext();
  if (context.state === 'suspended') void context.resume();
  return context;
}

/**
 * 짧은 효과음을 냅니다. 오디오 파일 없이 즉시 쓸 수 있는 최소 수단입니다.
 *
 * @param frequency 주파수(Hz)
 * @param durationMs 길이(ms)
 */
export function playTone(frequency = 440, durationMs = 120): void {
  const ctx = getContext();
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();

  oscillator.frequency.value = frequency;
  oscillator.connect(gain);
  gain.connect(ctx.destination);

  // 뚝 끊으면 클릭 노이즈가 나므로 끝을 지수적으로 줄입니다
  const endsAt = ctx.currentTime + durationMs / 1000;
  gain.gain.setValueAtTime(0.2, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, endsAt);

  oscillator.start();
  oscillator.stop(endsAt);
}
