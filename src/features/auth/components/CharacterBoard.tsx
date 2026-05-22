import { Avatar } from "@/shared/components/Avatar";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useReducer, useState } from "react";
import { useAudio } from "@/shared/hooks/useAudioEffect";
import { useAvatarSelection } from "../hooks/useAvatarSelection";
import { useNickname } from "../hooks/useNickname";
import { useCreateUserAndLobbyMove } from "../hooks/useCreateUserAndLobbyMove";
import Bridge from "@/shared/components/Bridge";
import { ImageManager } from "@/shared/services/ImageManger";

type ShakeAction = { type: "trigger" } | { type: "end" };

function shakeReducer(_: boolean, action: ShakeAction) {
  switch (action.type) {
    case "trigger":
      return true;
    case "end":
      return false;
    default:
      return false;
  }
}
const shakeClass = "animate__animated animate__shakeX";

export default function CharacterBoard() {
  const { playBeep } = useAudio();
  const { isCreating, handleCreateUser } = useCreateUserAndLobbyMove();

  const avatar = useAvatarSelection();
  const nickname = useNickname(avatar.index);
  const [isShaking, dispatchShake] = useReducer(shakeReducer, false);
  const [isAvatarHovered, setIsAvatarHovered] = useState(false);

  const triggerShake = () => {
    dispatchShake({ type: "trigger" });
  };

  const handleShakeAnimationEnd = () => {
    dispatchShake({ type: "end" });
  };

  if (isCreating) {
    return <Bridge />;
  }

  return (
    <div
      className={`brutal-box relative mx-auto my-12 max-w-120 overflow-visible rounded-2xl bg-linear-to-b from-dark-1 to-dark-2 p-8 
    ${isShaking ? shakeClass : ""}`}
      onAnimationEnd={handleShakeAnimationEnd}
    >
      <img
        src={ImageManager.charater}
        className="-mt-15 bg-yellow-50 -rotate-6 mb-10 p-3"
      />
      <div className="mb-8 flex items-center justify-center gap-8">
        {/* 이전 버튼 */}
        <button
          onClick={() => avatar.navigate("prev")}
          className="brutal-btn h-20 w-20 rounded-full text-2xl border-none font-bold flex items-center justify-center"
        >
          <ChevronLeft size={50} />
        </button>
        <div className="flex flex-col items-center justify-center gap-4">
          {/* 아바타  */}
          <button
            type="button"
            onClick={avatar.randomize}
            onMouseEnter={() => setIsAvatarHovered(true)}
            onMouseLeave={() => setIsAvatarHovered(false)}
            className="relative rounded-full hover:cursor-pointer"
          >
            <div
              className={`transition-all duration-200 ${
                isAvatarHovered ? "blur-[2px]" : ""
              }`}
            >
              <Avatar>
                <video
                  src={avatar.currentAvatar.videoSrc}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-40 h-40 object-cover"
                />
              </Avatar>
            </div>
            <div
              className={`pointer-events-none absolute inset-0 grid place-items-center text-8xl transition-opacity ${isAvatarHovered ? "opacity-100" : "opacity-0"}`}
            >
              ❓
            </div>
            {/* 데코  */}
            <img
              src={ImageManager.spotlight}
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-80 w-[400%] h-[400%] object-contain"
            />
          </button>
          {/* 닉네임 입력 */}
          <input
            type="text"
            name="nickname"
            value={nickname.fullNickname}
            onChange={nickname.handleChange}
            className={`rounded-2xl w-50 text-center text-lg text-black outline-none py-1 bg-white mt-10 z-10`}
            spellCheck="false"
          />
        </div>

        {/* 다음 버튼 */}
        <button
          onClick={() => avatar.navigate("next")}
          className="brutal-btn h-20 w-20 rounded-full border-none flex items-center justify-center"
        >
          <ChevronRight size={50} />
        </button>
      </div>
      <button
        onMouseDown={playBeep}
        onClick={() =>
          handleCreateUser({
            nickname: nickname.fullNickname,
            avatarName: avatar.currentAvatar.nickname,
            avatarIndex: avatar.index,
            onError: triggerShake,
          })
        }
        disabled={isCreating}
        className={`brutal-btn w-full rounded-2xl py-4 font-black bg-accent text-xl text-dark-1 ${
          isCreating ? "opacity-60 pointer-events-none" : ""
        }`}
      >
        입장
      </button>
    </div>
  );
}
