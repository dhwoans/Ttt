interface FooterProps {
  children: React.ReactNode;
  className?: string;
}

export default function FooterLayout({
  children,
  className = "",
}: FooterProps) {
  return (
    <footer className={`fixed bottom-0 z-50 w-full ${className}`.trim()}>
      {children}
    </footer>
  );
}
