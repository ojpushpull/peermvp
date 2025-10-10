export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About NYC Peer Guide
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto text-blue-100">
              Linking peers to resources and opportunities in New York City.
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-700 mb-6">
              NYC peer guides goal is to help peers get connected with jobs and skills that will further their career.
              </p>
              <p className="text-lg text-gray-700 mb-6">
                Currently NYC Peer Guide offers a job board for peer jobs with a goal of expanding to be an encompassing resource for all peers in NYC.
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-100 to-indigo-200 rounded-2xl p-8 text-center">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <div className="text-4xl font-bold text-blue-600">500+</div>
                  <div className="text-gray-700">Jobs On This Site</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-blue-600">50+</div>
                  <div className="text-gray-700">Training Programs</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-blue-600">1000+</div>
                  <div className="text-gray-700">Peers Supported</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section 
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How NYC Peer Guide Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We make it easy to find your community and access the support you need
            </p>
          </div> 

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Connect</h3>
              <p className="text-gray-600">
                Find jobs that will help you further your career.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Engage</h3>
              <p className="text-gray-600">
                Join support groups, attend community events, and participate in meaningful conversations.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Thrive</h3>
              <p className="text-gray-600">
                Build lasting relationships, access resources, and contribute to a stronger community.
              </p>
            </div>
          </div>
        </div>
      </div> */}

      {/* Community Impact Section 
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Community Stories</h2>
            <p className="text-xl text-gray-600">Real experiences from our community members</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
              <div className="mb-4">
                <div className="flex text-yellow-400 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 italic mb-4">
                  "Finding NYC Peer Guide was a turning point for me. After moving to Brooklyn, I felt lost and isolated. The community here helped me find my footing and connect with people who truly understood my journey."
                </p>
                <div className="text-sm text-gray-600">— Maria S., Brooklyn</div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
              <div className="mb-4">
                <div className="flex text-yellow-400 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 italic mb-4">
                  "The peer support groups through NYC Peer Guide have been incredible. It's amazing how much strength you can find when you're surrounded by people who get it. This community saved my life."
                </p>
                <div className="text-sm text-gray-600">— James T., Manhattan</div>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      {/* Get Involved Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Access our information</h2>
            <p className="text-xl mb-8 text-blue-100">
              Sign up for our newsletter to get our knowledge filled emails on a regular basis. 
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/jobs"
                className="inline-flex items-center justify-center px-8 py-3 bg-white text-blue-700 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
              >
                Find Opportunities
              </a>
              <button className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-700 transition-colors">
                Signup
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}