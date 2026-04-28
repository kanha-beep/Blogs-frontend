"use client";

import RecentBlogsCards from "../cards/RecentBlogsCards";
export default function RecentBlogs({ blogs }) {
  return (
    <section className="dashboard-panel p-4 sm:p-5">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-[#465240]">
            Recent Stories
          </p>
          <h2 className="mt-2 font-display text-3xl font-semibold text-slate-900">
            Fresh perspectives, styled like a magazine rail
          </h2>
          <p className="mt-2 text-sm text-[#42503d]">
            New posts get a premium spotlight before they settle into the main archive.
          </p>
        </div>
        <div className="rounded-full border border-[#dbe6b8] bg-[#fff9df] px-4 py-2 text-sm text-[#364331]">
          {blogs?.length || 0} featured now
        </div>
      </div>
      {blogs && blogs.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {blogs.map((blog) => (
            <div key={blog._id}>
              <RecentBlogsCards blog={blog} />
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-[#dbe6b8] py-10 text-center">
          <p className="text-[#465240]">No recent blogs available</p>
        </div>
      )}
    </section>
  );
}
