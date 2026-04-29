import Footer from './Footer';

export const PageLayout = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <div className={className}>
      <main className="pt-[var(--top-spacing)] pb-26">
        {/*  pt-[var(--top-spacing)]  */}
        {children}
      </main>
      <Footer />
    </div>
  );
};
