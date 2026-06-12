import { useNavigate } from "react-router-dom";
import { ImageManager } from "@/shared/services/ImageManger";
import FooterLayout from "@/layouts/FooterLayout";
import LeftSideLayout from "@/layouts/LeftSideLayout";
import RightSideLayout from "@/layouts/RightSideLayout";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div>
      <main className="flex flex-col items-center justify-center h-screen gap-6">
        <img
          src={ImageManager.notFound404}
          className="max-w-[50%] max-h-[50%] object-contain"
        />
        <Button
          onClick={() => navigate("/login")}
          className="mb-24 px-6 py-2 hover:translate-x-1 hover:translate-y-1"
        >
          홈으로
        </Button>
      </main>
      <FooterLayout>
        <img src={ImageManager.toBeContinue} />
      </FooterLayout>
    </div>
  );
}
