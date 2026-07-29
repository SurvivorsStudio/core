# @survivorsstudio/core

SurvivorsStudio 앱들이 공유하는 기능 패키지. Capacitor + Vite 앱에서 씁니다.

## 설치

앱 레포 루트에 `.npmrc` 가 있어야 합니다 (`app-template` 에 이미 포함):

```
@survivorsstudio:registry=https://npm.pkg.github.com
```

```bash
npm i @survivorsstudio/core
```

> 이 패키지는 Public 이므로 설치에 인증이 필요하지 않습니다.

## 사용

```ts
import { Storage } from '@survivorsstudio/core/storage';
import { playTone } from '@survivorsstudio/core/audio';
import { track } from '@survivorsstudio/core/analytics';
import { applySafeAreaVars } from '@survivorsstudio/core/ui';

await Storage.set('highScore', '1200');
const best = await Storage.get('highScore'); // '1200'
```

| 서브패스 | 지금 들어 있는 것 |
|---|---|
| `./storage` | `Storage` — get / set / remove (Capacitor Preferences) |
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
- 그 PR 을 머지하면 태그 · CHANGELOG · GitHub Packages publish 까지 자동

앱은 `^0.1.0` 캐럿 범위로 참조하고 `package-lock.json` 을 커밋합니다.
