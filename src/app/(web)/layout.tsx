// app/home/layout.tsx
export default function WebLayout({ children }: { children: React.ReactNode }) {
    return (
      <div>
        <div><h1>Header</h1></div>
        <div>{children}</div>
      </div>
    );
  }