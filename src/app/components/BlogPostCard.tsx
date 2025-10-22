import Link from 'next/link';

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string | null;
  category: string;
  author: string;
  publishedAt: Date | null;
};

export default function BlogPostCard({ post }: { post: BlogPost }) {
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
    <Link href={`/blog/${post.slug}`} className="group">
      <article className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-all hover:shadow-md h-full flex flex-col">
        {/* Cover Image */}
        {post.coverImage ? (
          <div className="h-48 overflow-hidden bg-gray-100">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        ) : (
          <div className="h-48 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
            <svg className="w-16 h-16 text-white opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
        )}

        {/* Content */}
        <div className="p-6 flex-1 flex flex-col">
          {/* Category Badge */}
          <div className="mb-3">
            <span
              className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                categoryColors[post.category] || 'bg-gray-100 text-gray-800'
              }`}
            >
              {post.category}
            </span>
          </div>

          {/* Title */}
          <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
            {post.title}
          </h2>

          {/* Excerpt */}
          <p className="text-gray-600 mb-4 flex-1 line-clamp-3">{post.excerpt}</p>

          {/* Footer */}
          <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
            <span>{post.author}</span>
            <span>{formatDate(post.publishedAt)}</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
