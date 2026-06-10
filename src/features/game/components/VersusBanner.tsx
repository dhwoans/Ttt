import { CharaterAvatar } from "../../../components/ui/CharaterAvatar";
import useAvatarRandomize from "../../../shared/hooks/useAvatarRandomize";
import { avatarCandidates } from "../../../shared/constants/avatarCandidates";
import { ImageManager } from "@/shared/services/ImageManger";

const FIRST_PLAYER_INDEX = 0;

interface SideProps {
  name: string;
  imageSrc?: string;
  emoji?: string;
  userId?: string;
  isReady?: boolean;
}

interface VersusBannerProps {
  left?: SideProps;
  right?: SideProps;
  sides?: SideProps[];
  playersInfos?: {
    nickname: string;
    imageSrc: string;
    userId?: string;
    isReady?: boolean;
  }[];
  dividerText?: string;
  className?: string;
}
const randomAvatarSources = avatarCandidates.map((avatar) => avatar.videoSrc);

interface AvatarRandomPreviewProps {
  imageSrc: string;
  shouldPlayIntro: boolean;
  className: string;
}

function AvatarRandomPreview({
  imageSrc,
  shouldPlayIntro,
  className,
}: AvatarRandomPreviewProps) {
  const { isRandomizing, randomIndex } = useAvatarRandomize({
    enabled: shouldPlayIntro,
    itemCount: randomAvatarSources.length,
  });

  const previewSrc =
    isRandomizing && randomAvatarSources.length > 0
      ? randomAvatarSources[randomIndex]
      : imageSrc;

  return (
    <video
      className={className}
      src={previewSrc}
      autoPlay
      loop
      muted
      playsInline
      onError={(e) => {
        (e.target as HTMLVideoElement).src = ImageManager.hourglassNotDone;
      }}
    />
  );
}

function VersusSide({
  imageSrc,
  isReady,
  shouldPlayIntro,
}: SideProps & { shouldPlayIntro: boolean }) {
  const displaySrc = imageSrc || ImageManager.hourglassNotDone;
  const opacity = isReady !== false ? "opacity-100" : "opacity-50";

  return (
    <div className="flex flex-col items-center gap-2">
      <CharaterAvatar size="large">
        <AvatarRandomPreview
          imageSrc={displaySrc}
          shouldPlayIntro={shouldPlayIntro}
          className={`w-30 h-30 transition-opacity duration-300 ${opacity}`}
        />
      </CharaterAvatar>
    </div>
  );
}

// 공용 VS 배너: 싱글/로컬/멀티 모두 사용 가능, 최대 4명까지 확장 가능
export function VersusBanner({
  left,
  right,
  sides, // 여러명 버전
  playersInfos,
  className = "",
}: VersusBannerProps) {
  // playersInfos가 있으면 우선 사용, 아니면 기존 방식
  let participants: SideProps[] = [];
  if (playersInfos && playersInfos.length > 0) {
    participants = playersInfos.map((p) => ({
      name: p.nickname,
      imageSrc: p.imageSrc,
      userId: p.userId,
      isReady:
        typeof p.isReady === "boolean" ? p.isReady : p.userId ? false : true,
    }));
  } else if (sides && sides.length > 0) {
    participants = sides;
  } else {
    participants = [left, right].filter(Boolean) as SideProps[];
  }

  const isTwoPlayers = participants.length === 2;

  const base =
    participants.length > 2
      ? "grid grid-cols-2 gap-6 md:gap-8 px-4 py-6 rounded-xl"
      : "flex items-center justify-center gap-6 md:gap-10 px-4 py-6 rounded-xl";

  return (
    <section className={`${base} ${className}`}>
      {participants.length === 1 ? (
        <>
          <VersusSide {...participants[0]} shouldPlayIntro={false} />
          <div className="text-white font-extrabold text-2xl md:text-3xl">
            <img className="h-30 w-50" src={ImageManager.verse}></img>
          </div>
          <video className="w-30 h-30" src={ImageManager.hourglassNotDone} />
        </>
      ) : isTwoPlayers ? (
        <>
          <VersusSide {...participants[0]} shouldPlayIntro={false} />
          <div className="text-white font-extrabold text-2xl md:text-3xl">
            <img className="h-30 w-50" src={ImageManager.verse}></img>
          </div>
          <VersusSide {...participants[1]} shouldPlayIntro={true} />
        </>
      ) : (
        // 3~4명일 때는 단순 그리드로 나열
        participants.map((participant, idx) => (
          <VersusSide
            key={participant.userId ?? `${participant.name}-${idx}`}
            {...participant}
            shouldPlayIntro={idx !== FIRST_PLAYER_INDEX}
          />
        ))
      )}
    </section>
  );
}
