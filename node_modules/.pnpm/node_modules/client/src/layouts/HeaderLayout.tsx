interface HeaderProps {
  children: React.ReactNode;
  className?: string;
}

export default function HeaderLayout({
  children,
  className = "",
}: HeaderProps) {
  return (
    <header className={`sticky top-0 z-50 w-full ${className}`.trim()}>
      {children}
    </header>
  );
}
