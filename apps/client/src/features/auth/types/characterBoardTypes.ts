export interface CharacterBoardState {
  index: number;
  isRandomizing: boolean;
  fullNickname: string;
  isCreating: boolean;
  shakeMotion: boolean;
  currentAvatar: [string, string, string]; // [emoji, name, imageSrc]
}

export interface CharacterBoardActions {
  handleAvatarClick: () => void;
  handleNavigateAvatar: (direction: "prev" | "next") => void;
  handleNicknameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCreateUser: () => Promise<void>;
  handleAnimationEnd: () => void;
  playBeep: () => void;
}

export interface CharacterBoardInterface {
  state: CharacterBoardState;
  actions: CharacterBoardActions;
}
