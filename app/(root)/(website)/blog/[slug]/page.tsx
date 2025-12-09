import { notFound } from "next/navigation";
import { marked } from "marked";

async function getBlog(slug: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/blog/${slug}`,
    { cache: "no-store" }
  );

  if (!res.ok) return null;
  return res.json();
}

export default async function BlogDetails({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const data = await getBlog(slug);
  if (!data?.blog) return notFound();

  const { blog } = data;

  // ✅ MARKDOWN → HTML (FIXES HEADINGS, LISTS, BLOCKQUOTES)
  const htmlContent = marked.parse(blog.content || "");

  return (
    <article className="w-full bg-white">
      {/* ================= HERO IMAGE ================= */}
      <section className="w-full bg-neutral-50 mt-28 py-6 sm:py-10">
        <div className="mx-auto max-w-screen-xl px-4 flex justify-center">
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="
              w-full
              max-w-[92vw]
              lg:max-w-[1100px]
              max-h-[85vh]
              object-contain
              rounded-2xl
              shadow-sm
            "
          />
        </div>
      </section>

      {/* ================= BLOG CONTENT ================= */}
      <section className="max-w-[760px] mx-auto px-5 sm:px-6 pt-10 pb-24">
        {/* Categories */}
        {blog.categories?.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            {blog.categories.map((c: string) => (
              <span
                key={c}
                className="
                  text-[11px]
                  uppercase
                  tracking-widest
                  text-gray-600
                  border
                  border-gray-200
                  rounded-full
                  px-3
                  py-1
                "
              >
                {c}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h1
          className="
            font-serif
            font-semibold
            text-3xl
            sm:text-4xl
            md:text-[46px]
            leading-tight
            tracking-tight
            text-gray-900
            mb-5
          "
        >
          {blog.title}
        </h1>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mb-10">
          <span className="font-medium text-gray-800">
            {blog.author}
          </span>
          <span>•</span>
          <span>{new Date(blog.createdAt).toDateString()}</span>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-gray-200 mb-10" />

        {/* ================= BLOG BODY ================= */}
        <div
          className="
            prose
            prose-lg
            sm:prose-xl
            max-w-none

            /* HEADINGS */
            prose-headings:font-serif
            prose-headings:font-semibold
            prose-headings:tracking-tight
            prose-h1:text-4xl
            prose-h2:text-3xl
            prose-h3:text-2xl
            prose-h4:text-xl

            /* PARAGRAPHS */
            prose-p:text-gray-800
            prose-p:leading-relaxed
            prose-p:my-6

            /* LISTS */
            prose-ul:list-disc
            prose-ul:pl-6
            prose-ul:my-6

            prose-ol:list-decimal
            prose-ol:pl-6
            prose-ol:my-6

            prose-li:my-2
            prose-li:text-gray-800

            /* LINKS */
            prose-a:text-rose-600
            prose-a:font-medium
            prose-a:no-underline
            hover:prose-a:underline

            /* IMAGES */
            prose-img:rounded-2xl
            prose-img:shadow-sm
            prose-img:my-10

            /* BLOCKQUOTE */
            prose-blockquote:border-l-4
            prose-blockquote:border-gray-300
            prose-blockquote:pl-6
            prose-blockquote:italic
            prose-blockquote:text-gray-700

            /* STRONG */
            prose-strong:text-gray-900
          "
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </section>
    </article>
  );
}
