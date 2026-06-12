import { useState, useEffect } from "react";
import { animalList, getRandomAdj } from "@/shared/constants/avatarCandidates";

export function useNickname(avatarIndex: number) {
  const [fullNickname, setFullNickname] = useState(() => {
    return `${getRandomAdj()} ${animalList[0][1]}`;
  });

  // 아바타 변경 시 닉네임 자동 생성
  useEffect(() => {
    setFullNickname(`${getRandomAdj()} ${animalList[avatarIndex][1]}`);
  }, [avatarIndex]);

  // 닉네임 변경 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFullNickname(e.target.value);
  };

  return {
    fullNickname,
    handleChange,
  };
}
