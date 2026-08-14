export function Glow({ variant = "hero" }: { variant?: "hero" | "section" }) {
  if (variant === "section") {
    return (
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-accent/20 blur-[120px]" />
      </div>
    );
  }

  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-accent/30 blur-[130px]" />
      <div className="absolute -top-20 left-[15%] h-[400px] w-[400px] rounded-full bg-accent-2/25 blur-[110px]" />
      <div className="absolute top-10 right-[10%] h-[350px] w-[350px] rounded-full bg-fuchsia-500/10 blur-[110px]" />
    </div>
  );
}
