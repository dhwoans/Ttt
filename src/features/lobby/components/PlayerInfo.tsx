import { motion } from "motion/react";
import { Avatar } from "@/shared/components/Avatar";
import { animalList } from "@/shared/constants/avatarCandidates";
import Subtitle from "./Subtitle";
import { ImageManager } from "@/shared/utils/ImageManger";
import { useUserStore } from "@/stores/useUserStore";

const PlayerInfo = () => {
  const myPlayer = useUserStore((state) => state.myPlayer);
  const index = myPlayer?.avatarIndex ?? 3;
  const nickname = myPlayer?.nickname ?? "플레이어";
  return (
    <motion.div className="shrink-0 h-52 overflow-hidden bg-[#ffc567] rounded-2xl border-4 border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center justify-center">
      {/* <Avatar size="large">{animalList[Number(index)][0]}</Avatar>
      <small className="text-white mt-6">플레이어</small>
      <Subtitle text={nickname} className="text-yellow-300"></Subtitle> */}
      <img
        className="w-80% h-full object-cover"
        src={ImageManager.ticTacToe}
      ></img>
    </motion.div>
  );
};
export default PlayerInfo;
