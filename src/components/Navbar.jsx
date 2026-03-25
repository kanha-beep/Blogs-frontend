import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const publicLinks = [
  { label: "Home", path: "/" },
  { label: "Archive", path: "/" },
  { label: "Discover", path: "/contacts" },
];

const privateLinks = [
  { label: "Home", path: "/" },
  { label: "Dashboard", path: "/dashboard" },
  { label: "Profile", path: "/profile" },
  { label: "Studio", path: "/blogsform" },
  { label: "Contacts", path: "/contacts" },
];

function SparkMark() {
  return (
    <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl border border-[#d8e4b6] bg-[linear-gradient(135deg,rgba(248,232,166,0.9),rgba(207,234,180,0.95))] shadow-[0_10px_30px_rgba(181,194,126,0.28)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.55),transparent_55%)]" />
      <span className="relative font-display text-lg font-semibold text-[#304122]">B</span>
    </div>
  );
}

export default function Navbar({ isLoggedIn, setIsLoggedIn }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState("");

  const navLinks = isLoggedIn ? privateLinks : publicLinks;

  const closeAndNavigate = (path, label) => {
    setActionLoading(label);
    setOpen(false);
    navigate(path);
  };

  const isActive = (path) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  const handleLogout = () => {
    setActionLoading("Logout");
    localStorage.clear();
    setIsLoggedIn(false);
    setOpen(false);
    navigate("/auth");
  };

  return (
    <header className="sticky top-0 z-50 px-4 pt-4 sm:px-6 lg:px-8">
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between rounded-[28px] border border-[#dbe6b8] bg-[rgba(255,252,242,0.88)] px-4 py-3 text-slate-900 shadow-[0_16px_40px_rgba(181,194,126,0.18)] backdrop-blur-2xl sm:px-5">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
            <SparkMark />
            <div>
              <p className="font-display text-lg font-semibold tracking-tight text-slate-900">
                Blogscape
              </p>
              <p className="text-xs uppercase tracking-[0.24em] text-[#4f5c46]">
                Modern Publishing
              </p>
            </div>
          </Link>
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          {navLinks.map((item) => (
            <button
              key={item.label}
              onClick={() => closeAndNavigate(item.path, item.label)}
              disabled={actionLoading === item.label}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                isActive(item.path)
                  ? "bg-[#eef7cc] text-[#2d401f] shadow-[0_8px_22px_rgba(181,194,126,0.22)]"
                  : "text-[#364331] hover:bg-[#f4efcf] hover:text-[#1f2a1a]"
              }`}
            >
              {actionLoading === item.label ? `${item.label}...` : item.label}
            </button>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          {isLoggedIn ? (
            <>
              <div className="rounded-full border border-[#cae1a8] bg-[#eef7cc] px-3 py-2 text-xs uppercase tracking-[0.22em] text-[#47603d]">
                Publishing live
              </div>
              <button
                onClick={() => closeAndNavigate("/blogsform", "New post")}
                disabled={actionLoading === "New post"}
                className="rounded-full bg-[#a8cb73] px-4 py-2 text-sm font-semibold text-[#24311f] transition hover:scale-[1.01] hover:bg-[#9fc46b]"
              >
                {actionLoading === "New post" ? "New post..." : "New post"}
              </button>
              <button
                onClick={handleLogout}
                disabled={actionLoading === "Logout"}
                className="rounded-full border border-[#dbe6b8] px-4 py-2 text-sm font-medium text-[#364331] transition hover:bg-[#f4efcf] hover:text-[#1f2a1a]"
              >
                {actionLoading === "Logout" ? "Logout..." : "Logout"}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => closeAndNavigate("/auth", "Sign in")}
                disabled={actionLoading === "Sign in"}
                className="rounded-full border border-[#dbe6b8] px-4 py-2 text-sm font-medium text-[#364331] transition hover:bg-[#f4efcf] hover:text-[#1f2a1a]"
              >
                {actionLoading === "Sign in" ? "Sign in..." : "Sign in"}
              </button>
              <button
                onClick={() => closeAndNavigate("/auth", "Start writing")}
                disabled={actionLoading === "Start writing"}
                className="rounded-full bg-[#a8cb73] px-4 py-2 text-sm font-semibold text-[#24311f] transition hover:scale-[1.01] hover:bg-[#9fc46b]"
              >
                {actionLoading === "Start writing" ? "Start writing..." : "Start writing"}
              </button>
            </>
          )}
        </div>

        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#dbe6b8] bg-[#fff9df] text-[#304122] transition hover:bg-[#f4efcf] lg:hidden"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Toggle navigation"
          aria-expanded={open}
        >
          <span className="text-xl">{open ? "X" : "="}</span>
        </button>
      </nav>

      {open && (
        <div className="mx-auto mt-3 w-full max-w-7xl rounded-[28px] border border-[#dbe6b8] bg-[rgba(255,252,242,0.94)] p-4 text-slate-900 shadow-[0_16px_40px_rgba(181,194,126,0.18)] backdrop-blur-2xl lg:hidden">
          <div className="grid gap-2">
            {navLinks.map((item) => (
              <button
                key={item.label}
                onClick={() => closeAndNavigate(item.path, item.label)}
                disabled={actionLoading === item.label}
                className={`rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${
                  isActive(item.path)
                    ? "bg-[#eef7cc] text-[#24311f]"
                    : "bg-[#fffdf4] text-[#364331] hover:bg-[#f4efcf]"
                }`}
              >
                {actionLoading === item.label ? `${item.label}...` : item.label}
              </button>
            ))}
          </div>

          <div className="mt-4 grid gap-2">
            {isLoggedIn ? (
              <>
                <button
                  onClick={() => closeAndNavigate("/blogsform", "Create new post")}
                  disabled={actionLoading === "Create new post"}
                  className="rounded-2xl bg-[#a8cb73] px-4 py-3 text-sm font-semibold text-[#24311f] transition hover:scale-[1.01] hover:bg-[#9fc46b]"
                >
                  {actionLoading === "Create new post" ? "Create new post..." : "Create new post"}
                </button>
                <button
                  onClick={handleLogout}
                  disabled={actionLoading === "Logout"}
                  className="rounded-2xl border border-[#dbe6b8] px-4 py-3 text-sm font-medium text-[#364331] transition hover:bg-[#f4efcf]"
                >
                  {actionLoading === "Logout" ? "Logout..." : "Logout"}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => closeAndNavigate("/auth", "Start writing")}
                  disabled={actionLoading === "Start writing"}
                  className="rounded-2xl bg-[#a8cb73] px-4 py-3 text-sm font-semibold text-[#24311f] transition hover:scale-[1.01] hover:bg-[#9fc46b]"
                >
                  {actionLoading === "Start writing" ? "Start writing..." : "Start writing"}
                </button>
                <button
                  onClick={() => closeAndNavigate("/auth", "Sign in")}
                  disabled={actionLoading === "Sign in"}
                  className="rounded-2xl border border-[#dbe6b8] px-4 py-3 text-sm font-medium text-[#364331] transition hover:bg-[#f4efcf]"
                >
                  {actionLoading === "Sign in" ? "Sign in..." : "Sign in"}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
