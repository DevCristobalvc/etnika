import AdminNav from "@/components/admin/AdminNav";
import { logout } from "../actions";

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-svh bg-marfil pb-28">
      <header className="sticky top-0 z-30 bg-tinta text-marfil">
        <div className="mx-auto max-w-3xl px-5 py-4 flex items-center justify-between">
          <p className="font-display text-lg tracking-[0.3em] uppercase">Étnika</p>
          <form action={logout}>
            <button
              type="submit"
              className="text-[10px] tracking-[0.25em] uppercase text-marfil/60 hover:text-marfil transition-colors"
            >
              Salir
            </button>
          </form>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 py-6">{children}</main>

      <AdminNav />
    </div>
  );
}
