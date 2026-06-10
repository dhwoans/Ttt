## 기술 스택

| 항목        | 기술                                  |
| ----------- | ------------------------------------- |
| 프레임워크  | React 19                              |
| 언어        | TypeScript                            |
| 빌드 도구   | Vite 7                                |
| 스타일      | Tailwind CSS 4                        |
| 라우팅      | React Router 7                        |
| 상태 관리   | Zustand                               |
| 실시간 통신 | socket.io-client                      |
| 테스트      | Vitest, @testing-library/react, jsdom |
| 목업 API    | MSW                                   |

## 프로젝트 구조

```text
.
├─ assets/                     # 정적 리소스
├─ public/
└─ src/
   ├─ features/
   │  ├─ auth/                 # 로그인/아바타 선택 관련 기능
   │  ├─ game/                 # 게임 UI/훅/유틸
   │  └─ lobby/                # 로비 UI/훅
   ├─ pages/                   # 라우트 단위 페이지
   ├─ shared/
   │  ├─ components/           # 공용 컴포넌트
   │  ├─ constants/            # 라우트, 상수 정의
   │  ├─ hooks/                # 공용 훅
   │  ├─ modals/               # 공용 모달
   │  └─ utils/                # 공용 유틸리티
   ├─ stores/                  # Zustand 스토어
   ├─ mock/                    # MSW 핸들러/브라우저 설정
   ├─ App.tsx                  # 앱 라우팅 엔트리
   └─ main.tsx                 # React 진입점
```

## 라우팅 개요

- `/` : 인증 상태에 따라 `/login` 또는 `/lobby`로 리다이렉트
- `/login` : 비인증 사용자 전용 화면
- `/lobby` : 인증 사용자 전용 로비
- `/game/single` : 싱글 플레이 게임 화면
- `/game/room/:roomId` : 멀티 플레이 게임 화면
- `/game/local/host/:sessionId` : 로컬 호스트 화면
- `/game/local/guest/:sessionId` : 로컬 게스트 화면

## 주요 패치 이력

### v3 - 구조 개선 및 리팩토링

아키텍처 안정화 및 코드 품질 개선에 중점을 둔 릴리스.

- shared 컴포넌트 렌더링 테스트 추가 (Nav, Bridge, Badge)
- 로비 레이아웃과 아바타 구조 정리
- 게임 흐름 분리 및 utils 구조 정리
- 게임 라우트 분리 및 경로 상수화
- 게임룸 흐름 재구성 및 single/multi 페이지 분리
- webm/webp 에셋 전환 및 404 페이지 추가
- UI/플로우 업데이트 및 오래된 문서 제거

### v2 - 멀티플레이 기능 구현

실시간 다중플레이 게임 기능 완성.

- 멀티플레이 게임 진행 기능 구현 및 안정성 개선
- 다중플레이어 상태 관리 및 플레이어 통신 구현
- 훅 네이밍 규칙 정립 및 준비 상태 시각화 구현
- Socket.IO 연결 오류 및 asset 경로 수정
- Socket.IO mock 추가
- 멀티플레이 문서 업데이트 및 시각화 자료 추가

### v1 - 기본 구조 및 초기 기능

프론트엔드 기본 구조 구성 및 게임 로직 기초 마련.

- 프로젝트 구조 개선 및 Zustand 상태 관리 도입
- 패키지 매니저 npm -> pnpm 전환
- Toastify 알림 흐름 도입 및 개선
- 로딩 애니메이션 추가
- 프로젝트 구조 변경 과정 오류 수정
- 멀티플레이 페이지 이동 이슈 수정
- 멀티 테스트 연결 오류 수정
- MSW request delay 조정
- 프로젝트 구조/네이밍 컨벤션 문서화

## Storybook

UI 컴포넌트 단위 검증을 위해 Storybook을 사용합니다.

## 디자인 시스템

현재 저장소는 Figma MCP 결과물을 직접 당겨오는 런타임 연결은 없지만, 연동을 받아들일 수 있는 구조를 갖추도록 정리했습니다.

- 디자인 토큰 레지스트리는 `src/design-system/tokens.ts`에서 관리합니다.
- 실제 스타일 소스는 `src/index.css`의 CSS 변수이며, 앱과 Storybook이 같은 토큰을 공유합니다.
- 공용 UI 컴포넌트는 `src/shared/components`에 두고 Storybook에서 상태별로 검증합니다.
- 토큰 카탈로그는 `Foundations/Design Tokens` 스토리에서 확인할 수 있습니다.

### Figma MCP 연결 권장 흐름

1. Figma MCP 또는 디자인 토큰 export 단계에서 색상, 타이포, spacing, radius를 JSON 또는 TS 객체로 추출합니다.
2. 그 결과물을 `src/design-system/tokens.ts` 구조에 맞게 매핑합니다.
3. 공용 컴포넌트는 raw hex 값 대신 semantic token 또는 CSS 변수만 사용합니다.
4. 변경 검증은 Storybook에서 먼저 하고, 이후 실제 페이지에 반영합니다.

### 실행 방법

```bash
pnpm install
pnpm storybook
```

빌드 산출물을 생성하려면 아래 명령을 사용합니다.

```bash
pnpm build-storybook
```

### 스토리 작성 기본 규칙

- 파일명은 `ComponentName.stories.tsx` 형식을 사용합니다.
- `Meta`와 `StoryObj` 타입을 사용해 타입 안전성을 유지합니다.
- `args`와 `argTypes`를 정의해 Controls 패널에서 상태/variant를 전환할 수 있게 작성합니다.
- 기본 상태(`default`) 외에 `hover`, `active`, `disabled`, `variation` 상태 스토리를 함께 제공합니다.
- 스토리 전역 스타일/프로바이더는 `.storybook/preview.tsx`의 decorator를 통해 공통 적용합니다.
