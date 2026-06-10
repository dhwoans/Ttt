interface VolumeSliderProps {
  value: number;
  onChange: (nextValue: number) => void;
}

export default function VolumeSlider({ value, onChange }: VolumeSliderProps) {
  const percent = Math.round(value * 100);

  return (
    <input
      type="range"
      min="0"
      max="100"
      value={percent}
      onChange={(e) => onChange(parseInt(e.target.value) / 100)}
      className="w-full h-3 rounded-lg appearance-none cursor-pointer accent-accent bg-gray-300"
    />
  );
}
