# @survivorsstudio/core

SurvivorsStudio 앱들이 공유하는 기능 패키지. Capacitor + Vite 앱에서 씁니다.

## 설치

```bash
npm i @survivorsstudio/core
```

인증도 `.npmrc` 도 필요 없습니다. npm 공개 레지스트리에 올라갑니다.

> GitHub Packages 를 쓰지 않는 이유: `npm.pkg.github.com` 은 **공개 패키지도 토큰을 요구합니다**
> ("You need an access token to publish, install, and delete private, internal, and public packages").
> 팀원 4명이 각자 PAT 를 만들어 관리하는 마찰을 없애려고 npm 공개 레지스트리를 씁니다.

## 사용

```ts
import { Storage } from '@survivorsstudio/core/storage';
import { playTone } from '@survivorsstudio/core/audio';
import { track } from '@survivorsstudio/core/analytics';
import { applySafeAreaVars } from '@survivorsstudio/core/ui';

await Storage.set('highScore', '1200');
const raw = await Storage.get('highScore');       // '1200' (문자열)

// 숫자는 변환 없이 바로
await Storage.setNumber('highScore', 1200);
const best = await Storage.getNumber('highScore');   // 1200, 없으면 0
const lives = await Storage.getNumber('lives', 3);   // 없으면 3
```

`Preferences` 는 **문자열만 저장합니다.** 숫자를 다루려면 `Number(await get(k) ?? '0')` 왕복이
필요한데, 최고점수·레벨·카운트를 저장하는 앱마다 반복되므로 `getNumber` / `setNumber` 가
흡수합니다. 값이 없거나 숫자로 해석할 수 없으면(`''`, `'abc'`, `'Infinity'`) `fallback` 을 돌려줍니다.

| 서브패스 | 지금 들어 있는 것 |
|---|---|
| `./storage` | `Storage` — get / set / remove / **getNumber / setNumber** (Capacitor Preferences) |
| `./audio` | `playTone(frequency, durationMs)` — 오디오 파일 없는 효과음 |
| `./analytics` | `track(event, props?)` — 지금은 콘솔 출력 |
| `./ui` | `applySafeAreaVars()` — 노치 영역을 CSS 변수로 |

## 이 패키지가 의도적으로 비어 있는 이유

무엇이 공통인지는 앱 2~3개를 만들어 봐야 압니다. 실제 중복이 확인되기 전의 추상화는
잘못된 추상화가 될 확률이 높습니다.

**승격 기준: 같은 코드를 세 번째로 복붙하게 될 때.** 두 번째까지는 복붙이 더 쌉니다.

## 개발

```bash
npm ci
npm run lint       # ESLint
npm run typecheck  # tsc --noEmit
npm run build      # dist/ (ESM) + dist/types/ (.d.ts)
```

`@capacitor/core` 와 `@capacitor/preferences` 는 peerDependency 입니다. 앱과 core 가 서로 다른
버전의 Capacitor 를 끌어오면 네이티브 레이어에서 충돌하기 때문입니다.

## 릴리스

Conventional Commits + [release-please](https://github.com/googleapis/release-please).

- `fix:` → patch, `feat:` → minor, `feat!:` / `BREAKING CHANGE:` → major
- `main` 에 머지되면 봇이 릴리스 PR 을 만듭니다
- 그 PR 을 머지하면 태그 · CHANGELOG · npm publish 까지 자동
- publish 는 npm Trusted Publishing(OIDC) 이라 저장된 토큰이 없습니다 — 만료·유출 관리 대상이 하나 줄어듭니다

앱은 `^1.0.0` 캐럿 범위로 참조하고 `package-lock.json` 을 커밋합니다.

## 왜 1.0.0 부터 시작하나

**`^0.1.0` 은 `0.2.0` 을 받지 않습니다.** 0.x 에서 캐럿 범위는 마이너를 넘지 않기 때문입니다:

```
^0.1.0 → 0.1.1  받음
^0.1.0 → 0.2.0  안 받음      ← 승격은 정의상 마이너 업이라 매번 여기 걸림
^1.0.0 → 1.9.0  받음
```

`core` 로의 승격은 `feat:` 커밋이고 마이너를 올립니다. 0.x 로 두면 승격할 때마다 **모든 앱의
`package.json` 범위를 손으로 고쳐야** 합니다. 앱이 늘어날수록 비용이 커지므로 앱이 0개인
2026-07-29 에 1.0.0 으로 올렸습니다.

> `1.0.0` 이 "API 가 안정됐다"는 선언은 아닙니다. **범위 문법이 의도대로 동작하게 하려는 선택**입니다.
> 호환성이 깨지는 변경은 `feat!:` 로 메이저를 올려 정식으로 알립니다.
