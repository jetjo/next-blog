export default function BackgroundYear({ year = "" }) {
  return (
    <div
      className={`select-none relative h-20 pointer-events-none slide-enter`}
      style={{ "--enter-stage": -2, "--enter-step": "60ms" } as any}
    >
      <span
        className={`text-8em color-transparent absolute left--3rem top--2rem font-bold text-stroke-2 text-stroke-hex-aaa op10 dark:op20`}
      >
        {year}
      </span>
    </div>
  );
}
