export default function BackgroundYear({ year = "" }) {
  return (
    <div
      className={` text-[1rem] select-none relative h-20 pointer-events-none slide-enter`}
      style={{ "--enter-stage": -2, "--enter-step": "60ms" } as any}
    >
      <span
        className={`text-[8em] text-[transparent] absolute -left-[0.35em] -top-[0.15em] font-bold [-webkit-text-stroke-width:0.02em] [-webkit-text-stroke-color:#94a3b8] dark:[-webkit-text-stroke-color:#64748b] opacity-10 dark:opacity-20`}
      >
        {year}
      </span>
    </div>
  );
}
