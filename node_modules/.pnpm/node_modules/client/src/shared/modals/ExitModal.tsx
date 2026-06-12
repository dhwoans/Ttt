import { useEffect } from "react";
import { useModalStore } from "@/stores/useModalStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
interface ExitModalProps {
  handleExit: () => void;
}

export default function ExitModal({ handleExit }: ExitModalProps) {
  const setOpenModal = useModalStore((state) => state.setOpenModal);
  const dialogClose = () => {
    setOpenModal(null);
  };
  const dialogExit = () => {
    handleExit();
    dialogClose();
  };
  return (
    <Dialog
      open={true}
      onOpenChange={(isOpen) => {
        if (!isOpen) dialogClose();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>페이지 나가기</DialogTitle>
          <DialogDescription>
            이전 페이지로 이동합니다. 정말 나가시겠습니까?
          </DialogDescription>
        </DialogHeader>

        {/* 나가기 / 머무르기 버튼 영역 */}
        <DialogFooter className="flex gap-2 sm:justify-end">
          <Button variant="outline" onClick={dialogClose}>
            머무르기
          </Button>
          <Button variant="destructive" onClick={dialogExit}>
            나가기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
