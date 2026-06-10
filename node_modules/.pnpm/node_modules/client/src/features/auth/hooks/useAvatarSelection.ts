import { useState } from "react";
import { animalList } from "@/shared/constants/avatarCandidates";
import { useAudio } from "@/shared/hooks/useAudioEffect";

export function useAvatarSelection() {
  const { playTick } = useAudio();
  const [index, setIndex] = useState(() =>
    Math.floor(Math.random() * animalList.length),
  );
  const [isRandomizing, setIsRandomizing] = useState(false);

  // 아바타 랜덤 선택
  const randomize = () => {
    if (isRandomizing) return;
    setIsRandomizing(true);

    let count = 0;
    const interval = setInterval(() => {
      setIndex(Math.floor(Math.random() * animalList.length));
      count++;

      if (count >= 15) {
        clearInterval(interval);
        const finalIndex = Math.floor(Math.random() * animalList.length);
        setIndex(finalIndex);
        setIsRandomizing(false);
      }
    }, 50);
  };

  // 아바타 네비게이션 (이전/다음)
  const navigate = (direction: "prev" | "next") => {
    playTick();
    const offset = direction === "prev" ? -1 : 1;
    setIndex(
      (prevIndex) =>
        (prevIndex + offset + animalList.length) % animalList.length,
    );
  };

  return {
    index,
    isRandomizing,
    currentAvatar: {
      nickname : animalList[index][0],
      emoji : animalList[index][1],
      videoSrc: animalList[index][2],
    },
    randomize,
    navigate,
  };
}
