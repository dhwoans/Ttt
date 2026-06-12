interface RightSideProps {
  children: React.ReactNode;
}

export default function RightSideLayout({ children }: RightSideProps) {
  return (
    <aside className="fixed right-0 top-0 z-40 h-full w-fit">{children}</aside>
  );
}
