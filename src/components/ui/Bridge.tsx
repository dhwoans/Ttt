import { ImageManager } from "../../shared/services/ImageManger";

interface BridgeProps {
  imageSrc?: string;
}

export default function Bridge({ imageSrc }: BridgeProps) {
  return (
    <section className="flex min-h-screen items-center justify-center p-8">
      <img
        src={imageSrc ?? ImageManager.ticTacToe}
        alt="게임 시작 준비중"
        className="w-full max-w-xl"
      />
    </section>
  );
}
