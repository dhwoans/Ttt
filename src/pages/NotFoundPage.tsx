import { useNavigate } from "react-router-dom";
import { ImageManager } from "@/shared/services/ImageManger";
import FooterLayout from "@/layouts/FooterLayout";
import LeftSideLayout from "@/layouts/LeftSideLayout";
import RightSideLayout from "@/layouts/RightSideLayout";
const brutal =
  "border-black font-bold rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]";
export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div>
      <main className="flex flex-col items-center justify-center h-screen gap-6">
        <img
          src={ImageManager.notFound404}
          className="max-w-[50%] max-h-[50%] object-contain"
        />
        <button
          onClick={() => navigate("/login")}
          className={`${brutal} px-6 py-2 border-4 bg-accent  hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all mb-24`}
        >
          홈으로
        </button>
      </main>
      <FooterLayout>
        <img src={ImageManager.toBeContinue} />
      </FooterLayout>
    </div>
  );
}
