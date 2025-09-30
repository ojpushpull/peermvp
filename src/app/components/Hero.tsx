import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
      <div className="absolute inset-0 bg-black/20"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Connect with Peers
            <span className="block text-yellow-400">Across NYC</span>
          </h1>

          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-blue-100">
            Your trusted guide to finding support, building connections, and thriving in the city that never sleeps. Join a community of peers who understand your journey.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg bg-yellow-400 text-gray-900 hover:bg-yellow-300 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              Get Started Today
            </Link>

            <Link
              href="/about"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg border-2 border-white text-white hover:bg-white hover:text-blue-700 transition-all duration-200"
            >
              Learn More
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-yellow-400">500+</div>
              <div className="text-blue-100">Active Peers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-yellow-400">50+</div>
              <div className="text-blue-100">Neighborhoods</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-yellow-400">24/7</div>
              <div className="text-blue-100">Support</div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400"></div>
    </section>
  );
}