export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f5f1e8] text-[#1d1f22]">
      <div className="relative min-h-screen overflow-hidden">
        <div className="pointer-events-none absolute -left-24 top-10 h-[280px] w-[280px] rounded-full bg-[radial-gradient(circle_at_top,_#f7c27b,_transparent_70%)] opacity-60 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 top-40 h-[360px] w-[360px] rounded-full bg-[radial-gradient(circle_at_top,_#9ed6c3,_transparent_70%)] opacity-70 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/3 h-[220px] w-[220px] rounded-full bg-[radial-gradient(circle_at_top,_#9db7ff,_transparent_70%)] opacity-60 blur-3xl" />

        <div className="relative mx-auto flex min-h-screen max-w-6xl items-center px-6 py-16">
          <div className="grid w-full gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="flex flex-col justify-center gap-6">
              <p className="text-sm uppercase tracking-[0.35em] text-[#9a6b2f]">
                LexiBoard Console
              </p>
              <h1 className="max-w-md font-[var(--font-display)] text-4xl font-semibold leading-tight text-[#1d1f22] sm:text-5xl">
                让词书与管理员管理更一致、更轻盈。
              </h1>
              <p className="max-w-lg text-base leading-7 text-[#4b4f55]">
                统一的后台控制台，支持词书编排、审核流转、权限分层与安全登录。
                所有模块使用一致的操作语言与视觉节奏，减少学习成本。
              </p>
              <div className="flex flex-wrap gap-3 text-xs text-[#5d6067]">
                <span className="rounded-full border border-black/10 bg-white/60 px-3 py-1">
                  词书生命周期
                </span>
                <span className="rounded-full border border-black/10 bg-white/60 px-3 py-1">
                  管理员分级
                </span>
                <span className="rounded-full border border-black/10 bg-white/60 px-3 py-1">
                  可追溯日志
                </span>
              </div>
            </div>

            <div className="rounded-[32px] border border-black/10 bg-white/85 p-8 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.45)] backdrop-blur">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
