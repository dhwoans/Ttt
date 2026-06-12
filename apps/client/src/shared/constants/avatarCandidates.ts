export type AvatarTuple = [string, string, string];

export interface AvatarCandidate {
  emoji: string;
  name: string;
  videoSrc: string;
  source: "animal" | "bot";
}

// Vite가 자동으로 처리하는 아바타/봇 리소스 import (png/webm)
const animalImages = import.meta.glob<{ default: string }>(
  "../../../assets/animals/*.{png,webm}",
  { eager: true },
);

const botImages = import.meta.glob<{ default: string }>(
  "../../../assets/bots/*.{png,webm}",
  {
    eager: true,
  },
);

// 이미지 경로 매핑
const animalImageMap = Object.entries(animalImages).reduce(
  (acc, [path, module]) => {
    const fileName = path.split("/").pop();
    acc[fileName] = module.default;
    return acc;
  },
  {} as Record<string, string>,
);

const botImageMap = Object.entries(botImages).reduce(
  (acc, [path, module]) => {
    const fileName = path.split("/").pop();
    acc[fileName] = module.default;
    return acc;
  },
  {} as Record<string, string>,
);

export const animalList: AvatarTuple[] = [
  ["🐶", "강아지", animalImageMap["DogFace.webm"]],
  ["🐱", "고양이", animalImageMap["CatFace.webm"]],
  ["🐭", "생쥐", animalImageMap["MouseFace.webm"]],
  ["🐹", "햄스터", animalImageMap["Hamster.webm"]],
  ["🐰", "토끼", animalImageMap["RabbitFace.webm"]],
  ["🦊", "여우", animalImageMap["Fox.webm"]],
  ["🐻", "곰", animalImageMap["Bear.webm"]],
  ["🦝", "너구리", animalImageMap["Raccoon.webm"]],
  ["🐨", "코알라", animalImageMap["Koala.webm"]],
  ["🐯", "호랑이", animalImageMap["TigerFace.webm"]],
  ["🦁", "사자", animalImageMap["Lion.webm"]],
  ["🐮", "소", animalImageMap["CowFace.webm"]],
  ["🐷", "돼지", animalImageMap["PigFace.webm"]],
  ["🐸", "개구리", animalImageMap["Frog.webm"]],
  ["🐵", "원숭이", animalImageMap["MonkeyFace.webm"]],
  ["🦉", "부엉이", animalImageMap["Owl.webm"]],
  ["🐢", "거북이", animalImageMap["Turtle.webm"]],
  ["🐬", "돌고래", animalImageMap["Dolphin.webm"]],
];

export const botList: AvatarTuple[] = [
  ["👾", "외계인", botImageMap["AlienMonster.webm"]],
  ["👽", "에일리언", botImageMap["Alien.webm"]],
  ["🤡", "광대", botImageMap["ClownFace.webm"]],
  ["👻", "유령", botImageMap["Ghost.webm"]],
  ["👹", "고블린", botImageMap["Ogre.webm"]],
  ["👺", "코주부", botImageMap["Goblin.webm"]],
  ["🤖", "로봇", botImageMap["Robot.webm"]],
  ["💀", "해골", botImageMap["Skull.webm"]],
  ["😈", "악마", botImageMap["SmilingFacewithHorns.webm"]],
];

export const adjectives: string[] = [
  "침착한",
  "슬픈",
  "화가많은",
  "피곤한",
  "활기찬",
  "시끄러운",
  "따뜻한",
  "차가운",
  "부드러운",
  "강한",
  "약삭빠른",
  "음침한",
  "늙은",
  "밝은",
  "느린",
  "뚱뚱한",
  "용감한",
  "겸손한",
  "이상한",
  "느긋한",
  "엄격한",
  "귀여운",
  "기묘한",
  "졸렬한",
  "공정한",
  "쌀쌀맞은",
  "야릇한",
  "논리적인",
  "객관적인",
  "분석적인",
  "통찰력있는",
  "예리한",
  "진지한",
  "사려깊은",
  "정의로운",
  "합리적인",
  "어중간한",
  "철저한",
];

export function getRandomAdj(): string {
  const randomAdj = Math.floor(Math.random() * adjectives.length);
  return adjectives[randomAdj];
}

export function randomBot(): AvatarTuple {
  const result = Math.floor(Math.random() * botList.length);
  return botList[result];
}

function toCandidate(
  [emoji, name, videoSrc]: AvatarTuple,
  source: AvatarCandidate["source"],
): AvatarCandidate {
  return {
    emoji,
    name,
    videoSrc,
    source,
  };
}

export const animalCandidates: AvatarCandidate[] = animalList.map((avatar) =>
  toCandidate(avatar, "animal"),
);

export const botCandidates: AvatarCandidate[] = botList.map((avatar) =>
  toCandidate(avatar, "bot"),
);

export const avatarCandidates: AvatarCandidate[] = [
  ...animalCandidates,
  ...botCandidates,
];
