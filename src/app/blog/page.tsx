import Link from 'next/link';
import { prisma } from '@/lib/db';
import BlogPostCard from '@/app/components/BlogPostCard';

async function getBlogPosts(category?: string) {
  try {
    const posts = await prisma.blogPost.findMany({
      where: {
        published: true,
        ...(category && { category }),
      },
      orderBy: {
        publishedAt: 'desc',
      },
    });
    return posts;
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const posts = await getBlogPosts(searchParams.category);

  const categories = [
    { label: 'All', value: undefined },
    { label: 'Career', value: 'Career' },
    { label: 'Interview', value: 'Interview' },
    { label: 'Certification', value: 'Certification' },
    { label: 'Industry', value: 'Industry' },
    { label: 'Wellness', value: 'Wellness' },
    { label: 'Stories', value: 'Stories' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Blog & Resources
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Career insights, industry news, and resources for peer support professionals
            </p>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((cat) => (
              <Link
                key={cat.label}
                href={cat.value ? `/blog?category=${cat.value}` : '/blog'}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  searchParams.category === cat.value || (!searchParams.category && !cat.value)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Blog Posts Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-12 h-12 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>

              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                No Posts Yet
              </h2>

              <p className="text-lg text-gray-600 mb-8">
                We're working on creating valuable content to help you succeed in your peer support career.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/jobs"
                  className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Browse Jobs
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center px-6 py-3 bg-white text-gray-700 font-semibold border-2 border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
                >
                  Suggest Topics
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
