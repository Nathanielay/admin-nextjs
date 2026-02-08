import SideNav from "./_components/side-nav";
import { requireAuth } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAuth();

  return (
    <div className="min-h-screen bg-[#f2f0ea] text-[#1b1d1f]">
      <div className="mx-auto flex min-h-screen max-w-6xl gap-6 px-6 py-8">
        <aside className="hidden w-64 shrink-0 rounded-[28px] border border-black/10 bg-white/70 p-6 shadow-[0_20px_60px_-45px_rgba(15,23,42,0.45)] lg:block">
          <SideNav email={user.email} role={user.role} />
        </aside>

        <div className="flex min-h-screen flex-1 flex-col gap-6">
          <header className="flex flex-wrap items-center justify-between gap-4 rounded-[28px] border border-black/10 bg-white/80 px-6 py-5 shadow-[0_20px_60px_-45px_rgba(15,23,42,0.45)]">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[#9a6b2f]">
                Admin Studio
              </p>
              <h1 className="text-2xl font-semibold">运营概览</h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden rounded-full border border-black/10 bg-[#f8f4ef] px-4 py-2 text-xs text-[#4b5058] sm:block">
                2024.09 版本
              </div>
              <button className="rounded-full bg-[#1d1f22] px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-black/15 transition hover:-translate-y-0.5">
                新建词书
              </button>
            </div>
          </header>

          <div className="lg:hidden">
            <div className="rounded-[24px] border border-black/10 bg-white/80 p-4">
              <SideNav email={user.email} role={user.role} />
            </div>
          </div>

          <main className="flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
}
