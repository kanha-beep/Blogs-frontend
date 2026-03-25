import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api.js";
import { useToast } from "../components/ToastProvider.jsx";
import { getErrorMessage } from "../utils/getErrorMessage.js";

const formatDate = (value) =>
  new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const readingMinutes = (content = "") =>
  Math.max(1, Math.ceil(content.trim().split(/\s+/).filter(Boolean).length / 180));

export default function Dashboard() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const hasSession = Boolean(localStorage.getItem("token") || localStorage.getItem("user"));
  const [actionLoading, setActionLoading] = useState("");
  const [dashboard, setDashboard] = useState({
    loading: true,
    totalBlogs: 0,
    totalComments: 0,
    avgReadingTime: 0,
    topCategory: "Editorial",
    latestBlogs: [],
    categoryBreakdown: [],
    currentUser: null,
  });

  useEffect(() => {
    const loadDashboard = async () => {
      if (!hasSession) {
        navigate("/auth");
        return;
      }

      try {
        const [blogsRes, userRes] = await Promise.allSettled([
          api.get("/blogs/mine?limit=100"),
          api.get("/auth/me"),
        ]);

        const blogs =
          blogsRes.status === "fulfilled" ? blogsRes.value?.data?.blogs || [] : [];
        const totalBlogs =
          blogsRes.status === "fulfilled"
            ? blogsRes.value?.data?.totalBlogs || blogs.length
            : blogs.length;
        const currentUser =
          userRes.status === "fulfilled" ? userRes.value?.data?.user : null;

        const categoryMap = blogs.reduce((acc, blog) => {
          const categories = Array.isArray(blog.category) ? blog.category : [];
          categories.forEach((item) => {
            acc[item] = (acc[item] || 0) + 1;
          });
          return acc;
        }, {});

        const categoryBreakdown = Object.entries(categoryMap)
          .map(([name, count]) => ({
            name,
            count,
            intensity: totalBlogs ? Math.max(18, Math.round((count / totalBlogs) * 100)) : 18,
          }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 4);

        const totalComments = blogs.reduce(
          (sum, blog) => sum + (blog.comments?.length || 0),
          0
        );
        const avgReadingTime = blogs.length
          ? Math.round(
              blogs.reduce((sum, blog) => sum + readingMinutes(blog.content), 0) /
                blogs.length
            )
          : 0;

        setDashboard({
          loading: false,
          totalBlogs,
          totalComments,
          avgReadingTime,
          topCategory: categoryBreakdown[0]?.name || "Editorial",
          latestBlogs: blogs.slice(0, 3),
          categoryBreakdown,
          currentUser,
        });
      } catch (error) {
        console.log("dashboard error:", error?.response?.data?.message || error.message);
        setDashboard((prev) => ({ ...prev, loading: false }));
        if (hasSession) {
          showToast({ title: "Dashboard failed", message: getErrorMessage(error) });
        }
      }
    };

    loadDashboard();
  }, [hasSession, navigate, showToast]);

  const stats = [
    {
      label: "Stories live",
      value: dashboard.totalBlogs,
      accent: "text-[#7dd3fc]",
      note: "Your active publishing inventory",
    },
    {
      label: "Comment pulse",
      value: dashboard.totalComments,
      accent: "text-[#f9a8d4]",
      note: "Conversation happening around your work",
    },
    {
      label: "Average read",
      value: `${dashboard.avgReadingTime} min`,
      accent: "text-[#86efac]",
      note: "Estimated attention window per article",
    },
    {
      label: "Top lane",
      value: dashboard.topCategory,
      accent: "text-[#fde68a]",
      note: "Most active category in your editorial mix",
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--dashboard-bg)] text-slate-900">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-10%] top-[-8%] h-72 w-72 rounded-full bg-[radial-gradient(circle,_rgba(88,196,255,0.28),_transparent_70%)] blur-2xl" />
        <div className="absolute right-[-8%] top-[18%] h-80 w-80 rounded-full bg-[radial-gradient(circle,_rgba(255,124,187,0.24),_transparent_70%)] blur-2xl" />
        <div className="absolute bottom-[-10%] left-[22%] h-96 w-96 rounded-full bg-[radial-gradient(circle,_rgba(120,255,214,0.16),_transparent_70%)] blur-3xl" />
      </div>

      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-7 sm:px-5 lg:px-7">
        <section className="grid gap-6 lg:grid-cols-[1.35fr_0.95fr]">
          <div className="dashboard-panel p-4 sm:p-5">
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-[#dbe6b8] bg-[#fff9df] px-3 py-1 text-xs uppercase tracking-[0.28em] text-[#4f5c46]">
                Editorial Command Center
              </span>
              <span className="rounded-full bg-[#eef7cc] px-3 py-1 text-xs text-[#547047]">
                Live from your blog collection
              </span>
            </div>

            <div className="max-w-2xl">
              <p className="font-display text-4xl font-semibold leading-tight text-slate-900 sm:text-5xl">
                Publish with the rhythm of a newsroom and the clarity of a creator studio.
              </p>
              <p className="mt-4 max-w-xl text-sm leading-7 text-[#42503d] sm:text-base">
                A layered dashboard inspired by modern blogging products: bold creator stats,
                streamlined publishing actions, and a visible content pipeline instead of plain admin cards.
              </p>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((item) => (
                <div
                  key={item.label}
                  className="rounded-3xl border border-[#dbe6b8] bg-[#fffdf4] p-4 shadow-[0_16px_36px_rgba(181,194,126,0.14)] backdrop-blur"
                >
                  <p className="text-xs uppercase tracking-[0.22em] text-[#4f5c46]">
                    {item.label}
                  </p>
                  <p className={`mt-3 font-display text-3xl font-semibold ${item.accent}`}>
                    {dashboard.loading ? "--" : item.value}
                  </p>
                  <p className="mt-2 text-sm text-[#42503d]">{item.note}</p>
                </div>
              ))}
            </div>
          </div>

          <aside className="dashboard-panel p-4 sm:p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-[#465240]">
                  Publishing Orbit
                </p>
                <h2 className="mt-3 font-display text-2xl font-semibold text-slate-900">
                  {dashboard.currentUser?.name
                    ? `${dashboard.currentUser.name}'s creator cockpit`
                    : "Creator cockpit"}
                </h2>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eef7cc] text-lg text-[#365027]">
                <span>01</span>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {[
                ["Signal", "Frame fresh topics and category balance before you draft."],
                ["Compose", "Turn an idea into a post with a visible reading-time target."],
                ["Amplify", "Track comments and publish more into the themes pulling readers in."],
              ].map(([title, copy], index) => (
                <div
                  key={title}
                  className="rounded-3xl border border-[#dbe6b8] bg-[#f6f7e8] p-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#cae1a8] bg-[#eef7cc] text-sm text-[#547047]">
                      0{index + 1}
                    </span>
                    <div>
                      <p className="font-medium text-slate-900">{title}</p>
                      <p className="text-sm text-[#42503d]">{copy}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                setActionLoading("Start a new story");
                navigate("/blogsform");
              }}
              disabled={actionLoading === "Start a new story"}
              className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-[#a8cb73] px-4 py-3 text-sm font-semibold text-[#24311f] transition hover:scale-[1.01] hover:bg-[#9fc46b]"
            >
              {actionLoading === "Start a new story" ? "Start a new story..." : "Start a new story"}
            </button>
          </aside>
        </section>

        <section className="grid gap-6">
          <div className="dashboard-panel p-4 sm:p-5">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-[#465240]">
                  Category Momentum
                </p>
                <h2 className="mt-2 font-display text-2xl font-semibold text-slate-900">
                  What your audience is orbiting around
                </h2>
              </div>
              <button
                onClick={() => {
                  setActionLoading("View all posts");
                  navigate("/");
                }}
                disabled={actionLoading === "View all posts"}
                className="rounded-full border border-[#dbe6b8] px-4 py-2 text-sm text-[#364331] transition hover:bg-[#f4efcf]"
              >
                {actionLoading === "View all posts" ? "View all posts..." : "View all posts"}
              </button>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {(dashboard.categoryBreakdown.length
                ? dashboard.categoryBreakdown
                : [{ name: "No categories yet", count: 0, intensity: 18 }]
              ).map((category, index) => (
                <div
                  key={category.name}
                  className="rounded-3xl border border-[#dbe6b8] bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(245,247,232,0.95))] p-5"
                >
                  <div className="flex items-center justify-between gap-4">
                    <p className="font-display text-xl text-slate-900">{category.name}</p>
                    <span className="text-sm text-[#42503d]">{category.count} posts</span>
                  </div>
                  <div className="mt-5 h-2 rounded-full bg-[#edf0d9]">
                    <div
                      className={`h-2 rounded-full ${
                        index % 2 === 0
                          ? "bg-[linear-gradient(90deg,#7dd3fc,#38bdf8)]"
                          : "bg-[linear-gradient(90deg,#f9a8d4,#fb7185)]"
                      }`}
                      style={{ width: `${category.intensity}%` }}
                    />
                  </div>
                  <p className="mt-4 text-sm text-[#42503d]">
                    Keep feeding this lane with sharper hooks, cleaner visuals, and better distribution.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section>
          <div className="dashboard-panel p-4 sm:p-5">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-[#465240]">
                  Freshly Published
                </p>
                <h2 className="mt-2 font-display text-2xl font-semibold text-slate-900">
                  Latest stories from your desk
                </h2>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {(dashboard.latestBlogs.length ? dashboard.latestBlogs : [null, null, null]).map(
                (blog, index) => (
                  <div
                    key={blog?._id || index}
                    className="rounded-3xl border border-[#dbe6b8] bg-[#fffdf4] p-5"
                  >
                    {blog ? (
                      <div className="flex h-full flex-col gap-4">
                        <div>
                          <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.2em] text-[#465240]">
                            <span>{formatDate(blog.createdAt)}</span>
                            <span>{readingMinutes(blog.content)} min read</span>
                            <span>{blog.comments?.length || 0} comments</span>
                          </div>
                          <h3 className="mt-3 font-display text-2xl text-slate-900">
                            {blog.title}
                          </h3>
                          <p className="mt-2 text-sm leading-6 text-[#42503d]">
                            {blog.content.slice(0, 140)}
                            {blog.content.length > 140 ? "..." : ""}
                          </p>
                        </div>

                        <button
                          onClick={() => {
                            setActionLoading(blog._id);
                            navigate(`/${blog._id}`);
                          }}
                          disabled={actionLoading === blog._id}
                          className="mt-auto rounded-2xl border border-[#dbe6b8] px-4 py-3 text-sm font-medium text-[#364331] transition hover:bg-[#f4efcf]"
                        >
                          {actionLoading === blog._id ? "Open article..." : "Open article"}
                        </button>
                      </div>
                    ) : (
                      <div className="animate-pulse space-y-3">
                        <div className="h-3 w-40 rounded-full bg-[#edf0d9]" />
                        <div className="h-6 w-3/4 rounded-full bg-[#edf0d9]" />
                        <div className="h-4 w-full rounded-full bg-[#edf0d9]" />
                      </div>
                    )}
                  </div>
                )
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
