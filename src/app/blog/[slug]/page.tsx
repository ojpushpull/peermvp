import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/db';

async function getBlogPost(slug: string) {
  try {
    const post = await prisma.blogPost.findUnique({
      where: {
        slug,
        published: true,
      },
    });
    return post;
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getBlogPost(params.slug);

  if (!post) {
    notFound();
  }

  const formatDate = (date: Date | null) => {
    if (!date) return 'Coming soon';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const categoryColors: { [key: string]: string } = {
    Career: 'bg-blue-100 text-blue-800',
    Interview: 'bg-purple-100 text-purple-800',
    Certification: 'bg-green-100 text-green-800',
    Industry: 'bg-orange-100 text-orange-800',
    Wellness: 'bg-pink-100 text-pink-800',
    Stories: 'bg-yellow-100 text-yellow-800',
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header with Cover Image */}
      <div className="relative">
        {post.coverImage ? (
          <div className="h-96 overflow-hidden bg-gray-900">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover opacity-70"
            />
          </div>
        ) : (
          <div className="h-96 bg-gradient-to-br from-blue-600 to-indigo-700" />
        )}

        {/* Title Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="mb-4">
              <span
                className={`inline-block px-4 py-2 text-sm font-semibold rounded-full ${
                  categoryColors[post.category] || 'bg-gray-100 text-gray-800'
                }`}
              >
                {post.category}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
              {post.title}
            </h1>
            <div className="flex items-center justify-center gap-4 text-white text-sm">
              <span className="font-medium">{post.author}</span>
              <span>•</span>
              <span>{formatDate(post.publishedAt)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600">
              Home
            </Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-blue-600">
              Blog
            </Link>
            <span>/</span>
            <span className="text-gray-900">{post.title}</span>
          </nav>
        </div>
      </div>

      {/* Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 md:p-12">
          {/* Excerpt */}
          <div className="text-xl text-gray-600 mb-8 pb-8 border-b border-gray-200 italic">
            {post.excerpt}
          </div>

          {/* Main Content */}
          <div className="prose prose-lg max-w-none">
            {/* Parse content as markdown or HTML - for now displaying as text */}
            <div
              className="text-gray-700 leading-relaxed whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="mt-8 flex justify-between items-center">
          <Link
            href="/blog"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Blog
          </Link>

          <Link
            href="/jobs"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Browse Jobs
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </article>
    </main>
  );
}
