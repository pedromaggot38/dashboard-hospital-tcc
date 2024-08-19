// app/home/layout.tsx
export default function HomeLayout({ children }: { children: React.ReactNode }) {
    return (
      <div>
        <main>{children}</main>
      </div>
    );
  }
  