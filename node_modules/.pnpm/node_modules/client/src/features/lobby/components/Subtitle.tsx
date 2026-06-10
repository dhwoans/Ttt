interface SubtitleProps {
  text: string;
  className?: string;
}

const Subtitle = ({ text, className }: SubtitleProps) => {
  const baseClassName =
    "text-2xl font-bold transition-opacity duration-200 group-hover:opacity-0 [text-shadow:1px_1px_0_#000,-1px_1px_0_#000,1px_-1px_0_#000,-1px_-1px_0_#000]";

  return (
    <h3 className={`${baseClassName} ${className ?? ""}`.trim()}>{text}</h3>
  );
};

export default Subtitle;
