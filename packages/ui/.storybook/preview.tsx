import type { Decorator, Preview } from "@storybook/react";

// @source 지시어가 포함된 index.css는 apps/client에 있으므로,
// UI 패키지 전용 스토리북을 위해 최소한의 테일윈드 설정을 임포트하거나
// 필요 시 스타일 파일을 별도로 구성할 수 있습니다.
// 여기서는 일단 컴포넌트들이 사용하는 tailwind 클래스들이 작동하도록 설정합니다.
import "../../../apps/client/src/index.css";

const preview: Preview = {
  parameters: {
    layout: "centered",
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
