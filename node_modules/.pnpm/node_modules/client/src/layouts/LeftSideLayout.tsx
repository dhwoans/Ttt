interface LeftSideProps {
  children: React.ReactNode;
  className?: string;
}

export default function LeftSideLayout({
  children,
  className = "",
}: LeftSideProps) {
  return (
    <aside
      className={`fixed left-0 top-0 ${className}`.trim()}
    >
      {children}
    </aside>
  );
}
