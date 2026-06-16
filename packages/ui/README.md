# 🎨 @ttt/ui (Design System)

이 패키지는 프로젝트의 모든 공통 UI 컴포넌트와 디자인 토큰을 관리하는 **Neo-Brutalist 디자인 시스템** 패키지입니다.

---

## 🚀 Storybook 사용 가이드

Storybook을 사용하면 프론트엔드 앱을 실행하지 않고도 UI 컴포넌트를 독립적으로 개발하고 테스트할 수 있습니다.

### 1. 스토리북 실행하기

루트 디렉토리 또는 패키지 디렉토리에서 다음 명령어를 실행합니다.

```bash
# 루트 디렉토리에서 실행 시
pnpm --filter @ttt/ui storybook

# packages/ui 디렉토리 내에서 실행 시
pnpm storybook
```

실행 후 브라우저에서 `http://localhost:6006`에 접속하세요.

### 2. 스토리 파일 작성법

`src/components/` 디렉토리에 `[ComponentName].stories.tsx` 형식으로 파일을 생성합니다.

**예시: `Button.stories.tsx`**

```tsx
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button.js";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    children: "클릭하세요",
    variant: "default",
  },
};
```

---

## 🛠 컴포넌트 개발 규칙

새로운 컴포넌트를 추가할 때 아래 규칙을 반드시 준수해야 빌드 및 배포 에러가 발생하지 않습니다.

### 1. 파일명 및 컴포넌트명

- 파일명은 반드시 **PascalCase**를 사용하세요. (예: `MyComponent.tsx`)
- 리눅스 환경(Vercel)은 대소문자를 엄격히 구분하므로 대소문자 불일치에 주의하세요.

### 2. ESM 확장자 명시 (매우 중요)

상대 경로에서 파일을 임포트할 때는 반드시 **`.js` 확장자**를 명시해야 합니다.

```tsx
// ✅ 올바른 예
import { cn } from "../lib/utils.js";
import { Button } from "./Button.js";

// ❌ 잘못된 예
import { cn } from "../lib/utils";
```

### 3. 패키지 내보내기 (Export)

컴포넌트를 완성한 후 `src/index.ts`에 추가하여 외부에서 사용할 수 있게 하세요.

```ts
// src/index.ts
export * from "./components/MyComponent.js";
```

---

## 🎨 스타일링 (Tailwind v4)

- 이 패키지의 스타일은 `apps/client/src/index.css`에 정의된 토큰과 유틸리티를 기반으로 합니다.
- 컴포넌트 내에서 `brutal-box`, `brutal-btn`, `text-retro-stroke` 등의 유틸리티 클래스를 적극 활용하세요.
