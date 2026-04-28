"use client";

import AllBlogsCards from "../cards/AllBlogsCards.jsx";
export default function AllBlogs({ blogs, loading, sort, setSort, setPage }) {
  return (
    <section className="dashboard-panel p-4 sm:p-5">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-[#465240]">
            Archive Stream
          </p>
          <h2 className="mt-2 font-display text-3xl font-semibold text-slate-900">
            Browse the full story grid
          </h2>
          <p className="mt-2 text-sm text-[#42503d]">
            {sort && sort !== "all"
              ? `Showing posts in ${sort}.`
              : "Showing every available story across your publication."}
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:items-end">
          <span className="rounded-full border border-[#cae1a8] bg-[#eef7cc] px-4 py-2 text-sm text-[#547047]">
            {blogs?.length || 0} posts visible
          </span>
          <div className="flex items-center gap-3 rounded-full border border-[#dbe6b8] bg-[#fff9df] px-3 py-2">
            <span className="text-xs uppercase tracking-[0.18em] text-[#364331]">
              Filter
            </span>
            <select
              name="category"
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setPage(1);
              }}
              className="rounded-full bg-transparent px-2 py-1 text-sm font-medium text-slate-900 outline-none"
            >
              <option value="all">All Categories</option>
              <option value="design">Design</option>
              <option value="research">Research</option>
              <option value="software">Software</option>
            </select>
          </div>
        </div>
      </div>
      {blogs && blogs.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {blogs.map((blog) => (
            <div key={blog._id}>
              <AllBlogsCards blog={blog} />
            </div>
          ))}
        </div>
      ) : (
        <div className="py-10 text-center">
          {loading && (
            <div className="space-y-4">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-cyan-300/20 border-t-cyan-200" />
              <p className="text-sm text-[#465240]">Loading blog posts...</p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
