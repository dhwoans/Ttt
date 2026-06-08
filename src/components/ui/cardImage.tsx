import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface CardImageProps {
  onClick: () => void;
  imageSrc: string;
  title: string;
  description: string;
}

export function CardImage({
  onClick,
  imageSrc,
  title,
  description,
}: CardImageProps) {
  return (
    <Card
      className="relative mx-auto w-full max-w-sm pt-0 cursor-pointer gap-0 brutal-btn"
      onClick={onClick}
    >
      <div className="relative w-full h-full aspect-video">
        <img
          src={imageSrc}
          alt="싱글플레이"
          className="w-full h-full object-cover"
        />
        <CardHeader className="absolute inset-0 flex items-center justify-center bg-black/10 z-10">
          <CardTitle><h1>{title}</h1></CardTitle>
        </CardHeader>
      </div>
      <CardFooter className="flex items-center justify-between p-4 bg-background">
        <CardDescription className="bg-background">{description}</CardDescription>
      </CardFooter>
    </Card>
  );
}
