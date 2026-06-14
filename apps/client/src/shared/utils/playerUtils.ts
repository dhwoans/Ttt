import { animalList } from "../constants/avatarCandidates";

export interface GamePlayerInfo {
  nickname: string;
  avatar: string;
  imageSrc: string;
  userId: string;
  isReady: boolean;
}

/**
 * 서버에서 받은 플레이어 데이터를 클라이언트 UI용 데이터로 변환
 */
export function mapPlayerData(player: {
  userId: string;
  nickname: string;
  avatar: string | null;
  isReady: boolean;
}): GamePlayerInfo {
  const found = animalList.find((animal) => animal[0] === player.avatar);
  return {
    nickname: player.nickname,
    avatar: player.avatar ?? "",
    imageSrc: found ? found[2] : "",
    userId: player.userId,
    isReady: player.isReady,
  };
}
