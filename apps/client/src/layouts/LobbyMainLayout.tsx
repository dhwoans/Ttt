import { useEffect, useState } from "react";
import SingleMode from "@/features/lobby/components/SingleMode";
import MultiMode from "@/features/lobby/components/MultiMode";
import LocalMode from "@/features/lobby/components/LocalMode";
import { ImageManager } from "@/shared/services/ImageManger";
import { CardImage } from "@ttt/ui";
import { useEnterMultiMode } from "@/features/lobby/hooks/useEnterMultiMode";
import { useEnterSingleMode } from "@/features/lobby/hooks/useEnterSingleMode";

const mainLayout =
  "flex flex-row gap-6 h-[75vh] transform origin-center transition-transform duration-300 w-[1200px] max-w-full";
interface CardBaseData {
  id: string;
  imageSrc: string;
  title: string;
  description: string;
}
const cardDataList: CardBaseData[] = [
  {
    id: "single",
    imageSrc: ImageManager.single,
    title: "SINGLE MODE",
    description: "AI와 1:1 대전을 즐겨보세요",
  },
  {
    id: "multi",
    imageSrc: ImageManager.multi,
    title: "MULTI MODE",
    description: "다른 플레이어들과 실력을 겨뤄보세요",
  },
  {
    id: "local",
    imageSrc: ImageManager.local,
    title: "LOCAL MODE ",
    description: "준비 중",
  },
];

export default function LobbyContentsLayout() {
  const { handleMultiMode } = useEnterMultiMode();
  const { handleSingleMode } = useEnterSingleMode();

  const getOnClickHandler = (id: string) => {
    switch (id) {
      case "single":
        return handleSingleMode;
      case "multi":
        return handleMultiMode;
      case "local":
        return () => {};
      default:
        return () => {};
    }
  };
  return (
    <div className={`${mainLayout}`}>
      {cardDataList.map((card) => (
        <CardImage
          key={card.id}
          onClick={getOnClickHandler(card.id)}
          imageSrc={card.imageSrc}
          title={card.title}
          description={card.description}
        />
      ))}
    </div>
  );
}
